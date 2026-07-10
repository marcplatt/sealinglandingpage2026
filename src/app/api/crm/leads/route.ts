import { NextResponse } from "next/server";

import { createLeadFromSubmission, getCrmLeads } from "../../../../server/crmStore";

export async function GET() {
  const leads = await getCrmLeads();
  return NextResponse.json({ leads });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;

  const required = ["firstName", "lastName", "email", "phone"];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim().length === 0) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  const lead = await createLeadFromSubmission(body);
  return NextResponse.json({ ok: true, lead });
}