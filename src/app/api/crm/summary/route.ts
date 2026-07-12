import { NextResponse } from "next/server";

import { getCrmKpiSummary } from "../../../../server/crmStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = await getCrmKpiSummary();
  return NextResponse.json({ summary });
}
