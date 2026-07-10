import { NextResponse } from "next/server";

import { importCrmLeadsCsv } from "../../../../server/crmStore";

export async function POST(request: Request) {
  const formData = await request.formData();
  const csvFile = formData.get("file");

  if (!(csvFile instanceof File)) {
    return NextResponse.json({ error: "CSV file is required" }, { status: 400 });
  }

  const text = await csvFile.text();
  const result = await importCrmLeadsCsv(text);

  return NextResponse.json({ ok: true, ...result });
}
