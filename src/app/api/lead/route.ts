import { NextResponse } from "next/server";

import { createLeadFromSubmission } from "../../../server/crmStore";

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

  try {
    const lead = await createLeadFromSubmission(body);

    return NextResponse.json({ ok: true, leadId: lead.id });
  } catch (error) {
    console.error("Lead submission failed", error);
    return NextResponse.json(
      {
        error: "Lead submission failed",
        message:
          error instanceof Error && error.message
            ? error.message
            : "Unable to save lead data"
      },
      { status: 500 }
    );
  }
}
