import { NextResponse } from "next/server";

import { getCrmStorageHealth } from "../../../../server/crmStore";

export async function GET() {
  const health = await getCrmStorageHealth();
  return NextResponse.json({ ok: true, health });
}
