import { NextResponse } from "next/server";

import { updateCrmLead } from "../../../../../server/crmStore";
import type { CrmLeadUpdatePayload } from "../../../../../types/crm";

type RouteContext = {
  params: {
    leadId: string;
  };
};

export async function PATCH(request: Request, context: RouteContext) {
  const body = (await request.json()) as CrmLeadUpdatePayload;
  const lead = await updateCrmLead(context.params.leadId, body);

  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, lead });
}