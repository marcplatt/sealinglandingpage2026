import { NextResponse } from "next/server";

import { getCrmKpiSummary } from "../../../../server/crmStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const summary = await getCrmKpiSummary();
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("CRM summary read failed", error);
    return NextResponse.json(
      {
        error: "CRM summary read failed",
        message: error instanceof Error ? error.message : "Unable to load CRM summary"
      },
      { status: 500 }
    );
  }
}
