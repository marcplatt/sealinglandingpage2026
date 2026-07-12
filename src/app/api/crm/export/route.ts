import { NextResponse } from "next/server";

import { exportCrmLeadsCsv } from "../../../../server/crmStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const csv = await exportCrmLeadsCsv();

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="crm-leads-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
}
