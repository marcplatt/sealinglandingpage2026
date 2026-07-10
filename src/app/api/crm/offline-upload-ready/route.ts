import { NextResponse } from "next/server";

import { getOfflineUploadReadyLeads } from "../../../../server/crmStore";

export async function GET() {
  const leads = await getOfflineUploadReadyLeads();
  const rows = leads.map((lead) => ({
    leadId: lead.id,
    gclid: lead.tracking.gclid || "",
    gbraid: lead.tracking.gbraid || "",
    wbraid: lead.tracking.wbraid || "",
    conversionAction: "job_won",
    conversionTime: lead.offline.wonAt || lead.updatedAt,
    conversionValueCad: lead.offline.finalRevenueCad ?? 0,
    currencyCode: "CAD",
    orderId: lead.id,
    uploaded: lead.offline.offlineConversionUploaded
  }));

  return NextResponse.json({ count: rows.length, rows });
}
