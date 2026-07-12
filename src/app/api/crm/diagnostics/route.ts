import { NextResponse } from "next/server";

import {
  getCrmKpiSummary,
  getCrmLeads,
  getCrmStorageHealth
} from "../../../../server/crmStore";

export const dynamic = "force-dynamic";

function toStageCounts(
  leads: Awaited<ReturnType<typeof getCrmLeads>>
): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const lead of leads) {
    counts[lead.stage] = (counts[lead.stage] || 0) + 1;
  }
  return counts;
}

function buildFingerprint(leads: Awaited<ReturnType<typeof getCrmLeads>>): string {
  return leads
    .slice(0, 25)
    .map((lead) => `${lead.id}:${lead.updatedAt || lead.createdAt}`)
    .join("|");
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const inspectLeadId = (url.searchParams.get("leadId") || "").trim();

  const [health, leads, summary] = await Promise.all([
    getCrmStorageHealth(),
    getCrmLeads(),
    getCrmKpiSummary()
  ]);

  const inspectedLead = inspectLeadId
    ? leads.find((lead) => lead.id === inspectLeadId)
    : undefined;

  return NextResponse.json(
    {
      ok: true,
      generatedAt: new Date().toISOString(),
      health,
      leadCount: leads.length,
      summaryTotalLeads: summary.totalLeads,
      stageCounts: toStageCounts(leads),
      leadFingerprint: buildFingerprint(leads),
      inspectLeadId: inspectLeadId || null,
      inspectLeadPresent: Boolean(inspectedLead),
      inspectLeadUpdatedAt: inspectedLead?.updatedAt || null,
      inspectLeadStage: inspectedLead?.stage || null
    },
    {
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
