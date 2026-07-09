import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const required = ["firstName", "lastName", "email", "phone"];
  for (const field of required) {
    if (!body[field] || String(body[field]).trim().length === 0) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      );
    }
  }

  // Replace this with your CRM/webhook integration.
  console.log("Lead captured", {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    address: body.address,
    serviceDetails: body.serviceDetails,
    gclid: body.gclid,
    utm_source: body.utm_source,
    utm_medium: body.utm_medium,
    utm_campaign: body.utm_campaign,
    utm_term: body.utm_term,
    utm_content: body.utm_content
  });

  return NextResponse.json({ ok: true });
}
