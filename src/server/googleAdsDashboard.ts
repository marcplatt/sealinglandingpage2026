import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execFileAsync = promisify(execFile);

export type LiveCampaign = {
  id: string;
  name: string;
  status: string;
  spend: number;
  revenue: number;
  conversions: number;
};

export type LiveRecommendation = {
  id: string;
  title: string;
  reason: string;
  action: string;
  dollarsRecoverable: number;
};

export type DashboardData = {
  source: "google-ads-live" | "fallback";
  customerId?: string;
  campaignId: string;
  targetCampaign?: LiveCampaign;
  campaigns: LiveCampaign[];
  recommendations: LiveRecommendation[];
};

const DEFAULT_CAMPAIGN_ID = "24014313278";

function parseScriptOutput(stdout: string): DashboardData | null {
  const lines = stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    try {
      const data = JSON.parse(lines[i]) as DashboardData;
      if (Array.isArray(data.campaigns) && Array.isArray(data.recommendations)) {
        return data;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function fallbackDashboardData(campaignId: string): DashboardData {
  return {
    source: "fallback",
    campaignId,
    campaigns: [
      {
        id: "csc-search",
        name: "Concrete Sealing Cowichan | Search",
        status: "PAUSED",
        spend: 3180,
        revenue: 14310,
        conversions: 42
      }
    ],
    recommendations: [
      {
        id: "fallback-r1",
        title: "Add negative terms from broad-match drift",
        reason:
          "Search terms show non-buying traffic patterns that can be filtered without reducing high-intent volume.",
        action: "Create a campaign-level negative list for low-intent modifiers and unrelated service variants.",
        dollarsRecoverable: 1200
      },
      {
        id: "fallback-r2",
        title: "Split exact high-intent terms",
        reason:
          "Top converting terms are grouped with broad intent and are not receiving priority budget allocation.",
        action: "Move best exact-match terms into a dedicated ad group with focused RSA copy.",
        dollarsRecoverable: 900
      }
    ]
  };
}

export async function getGoogleAdsDashboardData(
  campaignId: string = DEFAULT_CAMPAIGN_ID
): Promise<DashboardData> {
  try {
    const repoRoot = path.resolve(process.cwd(), "..");
    const pythonExe = path.join(repoRoot, ".venv", "Scripts", "python.exe");
    const scriptPath = path.join(
      repoRoot,
      "google-ads-api-setup",
      "dashboard_concrete_sealing_snapshot.py"
    );

    const { stdout } = await execFileAsync(pythonExe, [
      scriptPath,
      "--campaign-id",
      campaignId
    ]);

    const parsed = parseScriptOutput(stdout);
    if (!parsed) {
      return fallbackDashboardData(campaignId);
    }
    return parsed;
  } catch {
    return fallbackDashboardData(campaignId);
  }
}