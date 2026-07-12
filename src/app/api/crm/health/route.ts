import { NextResponse } from "next/server";

import { getCrmStorageHealth } from "../../../../server/crmStore";

export const dynamic = "force-dynamic";

export async function GET() {
  const health = await getCrmStorageHealth();
  return NextResponse.json({ ok: true, health });
}
