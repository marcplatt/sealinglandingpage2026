const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_ADS_API_BASE = "https://googleads.googleapis.com";
const GOOGLE_ADS_API_VERSIONS = ["v22", "v21"] as const;

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
  debug?: {
    stage: string;
    reason: string;
    missingEnv?: string[];
  };
};

const DEFAULT_CAMPAIGN_ID = "24014313278";

type GoogleAdsEnv = {
  developerToken: string;
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  loginCustomerId: string;
  customerId: string;
};

type GoogleAdsRow = {
  campaign?: {
    id?: string;
    name?: string;
    status?: string;
  };
  metrics?: {
    costMicros?: string;
    conversions?: number;
    conversionsValue?: number;
    clicks?: string;
    impressions?: string;
  };
  searchTermView?: {
    searchTerm?: string;
  };
  recommendation?: {
    resourceName?: string;
    type?: string;
    dismissed?: boolean;
    impact?: {
      baseMetrics?: {
        costMicros?: string;
      };
      potentialMetrics?: {
        costMicros?: string;
      };
    };
  };
};

function getGoogleAdsEnv(): GoogleAdsEnv | null {
  const normalizeAdsId = (value: string | undefined) => (value ?? "").replace(/\D/g, "");

  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const loginCustomerId = normalizeAdsId(process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID);
  const customerId = normalizeAdsId(process.env.GOOGLE_ADS_CUSTOMER_ID);

  if (
    !developerToken ||
    !clientId ||
    !clientSecret ||
    !refreshToken ||
    !loginCustomerId ||
    !customerId
  ) {
    return null;
  }

  return {
    developerToken,
    clientId,
    clientSecret,
    refreshToken,
    loginCustomerId,
    customerId
  };
}

async function getAccessToken(env: GoogleAdsEnv): Promise<string> {
  const body = new URLSearchParams({
    client_id: env.clientId,
    client_secret: env.clientSecret,
    refresh_token: env.refreshToken,
    grant_type: "refresh_token"
  });

  const response = await fetch(GOOGLE_OAUTH_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(
      `OAuth token request failed: ${response.status} ${bodyText.slice(0, 240)}`
    );
  }

  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) {
    throw new Error("OAuth token response missing access_token");
  }

  return json.access_token;
}

async function gaqlSearch(
  env: GoogleAdsEnv,
  accessToken: string,
  query: string
): Promise<GoogleAdsRow[]> {
  let lastError = "";

  for (const version of GOOGLE_ADS_API_VERSIONS) {
    const endpoint = `${GOOGLE_ADS_API_BASE}/${version}/customers/${env.customerId}/googleAds:searchStream`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": env.developerToken,
        "login-customer-id": env.loginCustomerId,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      const bodyText = await response.text();
      lastError = `${version} ${response.status} ${bodyText.slice(0, 240)}`;
      continue;
    }

    const chunks = (await response.json()) as Array<{ results?: GoogleAdsRow[] }>;
    return chunks.flatMap((chunk) => chunk.results ?? []);
  }

  throw new Error(`Google Ads query failed for all versions: ${lastError}`);
}

function toCurrencyFromMicros(value: string | undefined): number {
  const micros = Number(value ?? "0");
  return Number.isFinite(micros) ? micros / 1_000_000 : 0;
}

function buildFallbackTargetCampaign(campaignId: string): LiveCampaign {
  return {
    id: campaignId,
    name: "Concrete Sealing Cowichan",
    status: "UNKNOWN",
    spend: 0,
    revenue: 0,
    conversions: 0
  };
}

function toTitleCase(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function fetchCampaigns(env: GoogleAdsEnv, accessToken: string): Promise<LiveCampaign[]> {
  const query = `
    SELECT
      campaign.id,
      campaign.name,
      campaign.status,
      metrics.cost_micros,
      metrics.conversions,
      metrics.conversions_value
    FROM campaign
    WHERE campaign.status != REMOVED
      AND campaign.advertising_channel_type = SEARCH
      AND campaign.name LIKE '%Cowichan%'
      AND segments.date DURING LAST_30_DAYS
    ORDER BY metrics.cost_micros DESC
    LIMIT 20
  `;

  const rows = await gaqlSearch(env, accessToken, query);
  return rows.map((row) => ({
    id: row.campaign?.id ?? "",
    name: row.campaign?.name ?? "Unknown campaign",
    status: row.campaign?.status ?? "UNKNOWN",
    spend: toCurrencyFromMicros(row.metrics?.costMicros),
    revenue: Number(row.metrics?.conversionsValue ?? 0),
    conversions: Number(row.metrics?.conversions ?? 0)
  }));
}

async function fetchSearchTermRecommendations(
  env: GoogleAdsEnv,
  accessToken: string,
  campaignId: string
): Promise<LiveRecommendation[]> {
  const query = `
    SELECT
      search_term_view.search_term,
      metrics.cost_micros,
      metrics.clicks,
      metrics.conversions,
      metrics.impressions
    FROM search_term_view
    WHERE campaign.id = ${campaignId}
      AND segments.date DURING LAST_30_DAYS
      AND metrics.cost_micros > 0
    ORDER BY metrics.cost_micros DESC
    LIMIT 80
  `;

  const rows = await gaqlSearch(env, accessToken, query);
  const recommendations: LiveRecommendation[] = [];

  for (const row of rows) {
    const conversions = Number(row.metrics?.conversions ?? 0);
    const clicks = Number(row.metrics?.clicks ?? 0);
    if (conversions > 0 || clicks < 2) {
      continue;
    }

    const term = row.searchTermView?.searchTerm?.trim();
    if (!term) {
      continue;
    }

    const spend = toCurrencyFromMicros(row.metrics?.costMicros);
    recommendations.push({
      id: `neg-${Math.abs(
        [...term].reduce((acc, char) => ((acc * 31 + char.charCodeAt(0)) | 0) >>> 0, 0)
      )}`,
      title: `Add negative keyword: ${term}`,
      reason: `Search term has ${clicks} clicks, ${Number(
        row.metrics?.impressions ?? 0
      )} impressions, and no conversions in the last 30 days.`,
      action: "Add as campaign-level negative keyword and monitor cost shift.",
      dollarsRecoverable: Number(spend.toFixed(2))
    });

    if (recommendations.length >= 10) {
      break;
    }
  }

  return recommendations;
}

async function fetchGoogleRecommendations(
  env: GoogleAdsEnv,
  accessToken: string,
  campaignId: string
): Promise<LiveRecommendation[]> {
  const query = `
    SELECT
      recommendation.resource_name,
      recommendation.type,
      recommendation.impact,
      recommendation.dismissed
    FROM recommendation
    WHERE recommendation.campaign = 'customers/${env.customerId}/campaigns/${campaignId}'
      AND recommendation.dismissed = FALSE
    LIMIT 15
  `;

  const rows = await gaqlSearch(env, accessToken, query);
  return rows.map((row) => {
    const baseMicros = Number(row.recommendation?.impact?.baseMetrics?.costMicros ?? "0");
    const potentialMicros = Number(
      row.recommendation?.impact?.potentialMetrics?.costMicros ?? "0"
    );
    const recoverable = Math.max(0, (baseMicros - potentialMicros) / 1_000_000);
    const typeName = toTitleCase(row.recommendation?.type ?? "RECOMMENDATION");

    return {
      id: row.recommendation?.resourceName?.replaceAll("/", "-") ?? `rec-${typeName}`,
      title: `Apply recommendation: ${typeName}`,
      reason: "Google Ads generated this recommendation for campaign optimization.",
      action: "Review and apply only after checking expected impact against lead quality.",
      dollarsRecoverable: Number(recoverable.toFixed(2))
    };
  });
}

function fallbackDashboardData(
  campaignId: string,
  debug?: DashboardData["debug"]
): DashboardData {
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
    ],
    debug
  };
}

export async function getGoogleAdsDashboardData(
  campaignId: string = DEFAULT_CAMPAIGN_ID
): Promise<DashboardData> {
  try {
    const env = getGoogleAdsEnv();
    if (!env) {
      const requiredVars = [
        "GOOGLE_ADS_DEVELOPER_TOKEN",
        "GOOGLE_ADS_CLIENT_ID",
        "GOOGLE_ADS_CLIENT_SECRET",
        "GOOGLE_ADS_REFRESH_TOKEN",
        "GOOGLE_ADS_LOGIN_CUSTOMER_ID",
        "GOOGLE_ADS_CUSTOMER_ID"
      ];

      const missingEnv = requiredVars.filter((key) => {
        if (key.includes("CUSTOMER_ID")) {
          return !(process.env[key] ?? "").replace(/\D/g, "");
        }
        return !process.env[key];
      });

      return fallbackDashboardData(campaignId, {
        stage: "env",
        reason: "Missing required Google Ads environment variables.",
        missingEnv
      });
    }

    const accessToken = await getAccessToken(env);
    const campaigns = await fetchCampaigns(env, accessToken);
    const targetCampaign =
      campaigns.find((campaign) => campaign.id === campaignId) ??
      buildFallbackTargetCampaign(campaignId);

    let recommendations = await fetchSearchTermRecommendations(env, accessToken, campaignId);
    if (recommendations.length === 0) {
      recommendations = await fetchGoogleRecommendations(env, accessToken, campaignId);
    }

    return {
      source: "google-ads-live",
      customerId: env.customerId,
      campaignId,
      targetCampaign,
      campaigns,
      recommendations: recommendations.sort(
        (a, b) => b.dollarsRecoverable - a.dollarsRecoverable
      ),
      debug: {
        stage: "ok",
        reason: "Live Google Ads data loaded."
      }
    };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    return fallbackDashboardData(campaignId, {
      stage: "google-ads-api",
      reason
    });
  }
}