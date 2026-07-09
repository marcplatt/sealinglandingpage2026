"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Tracking = {
  gclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
};

type LeadFormProps = {
  tracking: Tracking;
};

export function LeadForm({ tracking }: LeadFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle"
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = Object.fromEntries(formData.entries());

    setStatus("saving");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setStatus("success");
      form.reset();
      router.push("/thank-you");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <div className="form-grid">
        <label>
          First name
          <input type="text" name="firstName" required />
        </label>

        <label>
          Last name
          <input type="text" name="lastName" required />
        </label>

        <label>
          Email
          <input type="email" name="email" required />
        </label>

        <label>
          Phone
          <input type="tel" name="phone" required />
        </label>

        <label className="full">
          Address
          <input type="text" name="address" />
        </label>

        <label className="full">
          What services do you need?
          <textarea name="serviceDetails" rows={4} />
        </label>
      </div>

      <input type="hidden" name="gclid" value={tracking.gclid} readOnly />
      <input type="hidden" name="utm_source" value={tracking.utm_source} readOnly />
      <input type="hidden" name="utm_medium" value={tracking.utm_medium} readOnly />
      <input
        type="hidden"
        name="utm_campaign"
        value={tracking.utm_campaign}
        readOnly
      />
      <input type="hidden" name="utm_term" value={tracking.utm_term} readOnly />
      <input
        type="hidden"
        name="utm_content"
        value={tracking.utm_content}
        readOnly
      />

      <button type="submit" className="btn btn-solid" disabled={status === "saving"}>
        {status === "saving" ? "Submitting..." : "Request Your Quote"}
      </button>

      {status === "success" && (
        <p className="form-status ok">Thanks. We received your quote request.</p>
      )}
      {status === "error" && (
        <p className="form-status error">
          Something went wrong. Please call us and we will help right away.
        </p>
      )}
    </form>
  );
}
