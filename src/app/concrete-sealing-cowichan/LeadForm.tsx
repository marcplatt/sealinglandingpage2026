"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TrackingPayload } from "../../types/crm";

type Tracking = Partial<TrackingPayload>;

type LeadFormProps = {
  tracking: Tracking;
};

const TRACKING_FIELD_NAMES: Array<keyof TrackingPayload> = [
  "gclid",
  "gbraid",
  "wbraid",
  "msclkid",
  "fbclid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "landing_page_path",
  "landing_page_url",
  "referrer_url",
  "referrer_host",
  "page_variant_id",
  "form_variant_id",
  "session_id",
  "lead_id",
  "first_seen_at_utc",
  "submitted_at_utc",
  "seconds_to_submit",
  "scroll_depth_max_pct",
  "engaged_time_seconds",
  "device_type",
  "browser_family",
  "os_family",
  "viewport_w",
  "viewport_h",
  "language",
  "timezone",
  "service_area_bucket",
  "value_tier_prediction",
  "intent_service_type"
];

function createLeadId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `lead_${crypto.randomUUID()}`;
  }
  return `lead_${Date.now()}`;
}

function getParam(url: URL, key: string) {
  return url.searchParams.get(key) ?? "";
}

function parseBrowserFamily(userAgent: string) {
  if (/edg\//i.test(userAgent)) {
    return "Edge";
  }
  if (/chrome\//i.test(userAgent) && !/edg\//i.test(userAgent)) {
    return "Chrome";
  }
  if (/safari\//i.test(userAgent) && !/chrome\//i.test(userAgent)) {
    return "Safari";
  }
  if (/firefox\//i.test(userAgent)) {
    return "Firefox";
  }
  return "Other";
}

function parseOsFamily(userAgent: string) {
  if (/windows/i.test(userAgent)) {
    return "Windows";
  }
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return "iOS";
  }
  if (/macintosh|mac os/i.test(userAgent)) {
    return "macOS";
  }
  if (/linux/i.test(userAgent)) {
    return "Linux";
  }
  return "Other";
}

function inferDeviceType(userAgent: string, width: number) {
  if (/ipad|tablet/i.test(userAgent) || (width >= 768 && width < 1024)) {
    return "tablet";
  }
  if (/mobile|iphone|android/i.test(userAgent) || width < 768) {
    return "mobile";
  }
  return "desktop";
}

function bucketServiceArea(address: string) {
  const normalized = address.toLowerCase();
  if (!normalized) {
    return "unknown";
  }
  if (normalized.includes("ladysmith")) {
    return "ladysmith";
  }
  if (normalized.includes("duncan") || normalized.includes("cowichan")) {
    return "cowichan_core";
  }
  if (normalized.includes("nanaimo")) {
    return "nanaimo";
  }
  if (normalized.includes("victoria")) {
    return "victoria";
  }
  return "extended_service_area";
}

function predictValueTier(serviceDetails: string) {
  const normalized = serviceDetails.toLowerCase();
  if (!normalized.trim()) {
    return "unknown";
  }
  if (
    normalized.includes("driveway") ||
    normalized.includes("large") ||
    normalized.includes("commercial") ||
    normalized.includes("multiple")
  ) {
    return "high";
  }
  if (normalized.includes("patio") || normalized.includes("walkway")) {
    return "medium";
  }
  return "low";
}

export function LeadForm({ tracking }: LeadFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");
  const mountTimeRef = useRef(Date.now());
  const scrollDepthRef = useRef(0);

  const [trackingFields, setTrackingFields] = useState<Tracking>(() => ({
    ...tracking,
    intent_service_type: tracking.intent_service_type || "concrete_sealing",
    page_variant_id: tracking.page_variant_id || "lp_v1",
    form_variant_id: tracking.form_variant_id || "quote_form_v1"
  }));

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const referrer = document.referrer;
    const referrerHost = referrer ? new URL(referrer).hostname : "";
    const userAgent = navigator.userAgent;

    const sessionStorageKey = "rw_session_id";
    const firstSeenKey = "rw_first_seen_at_utc";

    let sessionId = window.sessionStorage.getItem(sessionStorageKey);
    if (!sessionId) {
      sessionId = createLeadId().replace("lead_", "session_");
      window.sessionStorage.setItem(sessionStorageKey, sessionId);
    }

    let firstSeenAt = window.sessionStorage.getItem(firstSeenKey);
    if (!firstSeenAt) {
      firstSeenAt = new Date().toISOString();
      window.sessionStorage.setItem(firstSeenKey, firstSeenAt);
    }

    const fromUrl: Tracking = {
      gclid: getParam(currentUrl, "gclid"),
      gbraid: getParam(currentUrl, "gbraid"),
      wbraid: getParam(currentUrl, "wbraid"),
      msclkid: getParam(currentUrl, "msclkid"),
      fbclid: getParam(currentUrl, "fbclid"),
      utm_source: getParam(currentUrl, "utm_source"),
      utm_medium: getParam(currentUrl, "utm_medium"),
      utm_campaign: getParam(currentUrl, "utm_campaign"),
      utm_term: getParam(currentUrl, "utm_term"),
      utm_content: getParam(currentUrl, "utm_content"),
      utm_id: getParam(currentUrl, "utm_id"),
      page_variant_id: getParam(currentUrl, "pv") || getParam(currentUrl, "page_variant"),
      form_variant_id: getParam(currentUrl, "fv") || getParam(currentUrl, "form_variant")
    };

    setTrackingFields((current) => ({
      ...current,
      ...Object.fromEntries(
        Object.entries(fromUrl).filter(([, value]) => typeof value === "string" && value.length > 0)
      ),
      landing_page_path: currentUrl.pathname,
      landing_page_url: currentUrl.toString(),
      referrer_url: referrer,
      referrer_host: referrerHost,
      session_id: sessionId,
      lead_id: createLeadId(),
      first_seen_at_utc: firstSeenAt,
      device_type: inferDeviceType(userAgent, window.innerWidth),
      browser_family: parseBrowserFamily(userAgent),
      os_family: parseOsFamily(userAgent),
      viewport_w: String(window.innerWidth),
      viewport_h: String(window.innerHeight),
      language: navigator.language || "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
      intent_service_type: current.intent_service_type || "concrete_sealing",
      page_variant_id: current.page_variant_id || fromUrl.page_variant_id || "lp_v1",
      form_variant_id: current.form_variant_id || fromUrl.form_variant_id || "quote_form_v1"
    }));

    const updateScrollDepth = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const current = scrollHeight <= 0 ? 100 : Math.round((window.scrollY / scrollHeight) * 100);
      scrollDepthRef.current = Math.max(scrollDepthRef.current, Math.min(current, 100));
    };

    updateScrollDepth();
    window.addEventListener("scroll", updateScrollDepth, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollDepth);
    };
  }, [tracking]);

  const hiddenTrackingFields = useMemo(() => {
    const result: Record<string, string> = {};
    for (const field of TRACKING_FIELD_NAMES) {
      result[field] = trackingFields[field] || "";
    }
    return result;
  }, [trackingFields]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const submittedAtUtc = new Date().toISOString();
    const secondsToSubmit = String(Math.max(1, Math.round((Date.now() - mountTimeRef.current) / 1000)));
    const engagedTimeSeconds = secondsToSubmit;

    const address = String(formData.get("address") || "");
    const serviceDetails = String(formData.get("serviceDetails") || "");

    formData.set("submitted_at_utc", submittedAtUtc);
    formData.set("seconds_to_submit", secondsToSubmit);
    formData.set("engaged_time_seconds", engagedTimeSeconds);
    formData.set("scroll_depth_max_pct", String(scrollDepthRef.current));
    formData.set("service_area_bucket", bucketServiceArea(address));
    formData.set("value_tier_prediction", predictValueTier(serviceDetails));

    for (const [field, value] of Object.entries(hiddenTrackingFields)) {
      if (value) {
        formData.set(field, value);
      }
    }

    const payload = Object.fromEntries(formData.entries());

    setStatus("saving");
    setErrorMessage("");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorBody = (await response.json().catch(() => null)) as
          | { error?: string; message?: string }
          | null;
        throw new Error(errorBody?.message || errorBody?.error || "Request failed");
      }

      setStatus("success");
      setTrackingFields((current) => ({
        ...current,
        lead_id: createLeadId()
      }));
      form.reset();
      router.push("/thank-you");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Something went wrong while saving your lead"
      );
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

      {Object.entries(hiddenTrackingFields).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} readOnly />
      ))}

      <button type="submit" className="btn btn-solid" disabled={status === "saving"}>
        {status === "saving" ? "Submitting..." : "Request Your Quote"}
      </button>

      {status === "success" && (
        <p className="form-status ok">Thanks. We received your quote request.</p>
      )}
      {status === "error" && (
        <p className="form-status error">
          {errorMessage || "Something went wrong. Please call us and we will help right away."}
        </p>
      )}
    </form>
  );
}
