import { NextResponse } from "next/server";

import { updateCrmLead } from "../../../../../server/crmStore";
import type { CrmLeadUpdatePayload } from "../../../../../types/crm";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ leadId: string }> }
) {
  const { leadId } = await context.params;
  const body = (await request.json()) as CrmLeadUpdatePayload;
  const lead = await updateCrmLead(leadId, body);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead });
}