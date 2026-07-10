import { NextResponse } from "next/server";

import { deleteCrmLead, updateCrmLead } from "../../../../../server/crmStore";
import type { CrmLeadUpdatePayload } from "../../../../../types/crm";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await context.params;
    if (!leadId || leadId.trim().length === 0) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }

    const body = (await request.json()) as CrmLeadUpdatePayload;
    const lead = await updateCrmLead(leadId, body, { createIfMissing: true });

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    console.error("CRM lead update failed", error);
    return NextResponse.json(
      {
        error: "CRM lead update failed",
        message: "Unable to save lead changes"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await context.params;
    if (!leadId || leadId.trim().length === 0) {
      return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
    }

    const deleted = await deleteCrmLead(leadId);
    if (!deleted) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, deleted: true, leadId });
  } catch (error) {
    console.error("CRM lead delete failed", error);
    return NextResponse.json(
      {
        error: "CRM lead delete failed",
        message: "Unable to delete lead"
      },
      { status: 500 }
    );
  }
}