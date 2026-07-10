export const PIPELINE_STAGES = [
  "new_lead",
  "contacted",
  "qualified",
  "estimate_sent",
  "won",
  "lost"
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  qualified: "Qualified",
  estimate_sent: "Estimate Sent",
  won: "Won",
  lost: "Lost"
};

export type TrackingPayload = {
  gclid: string;
  gbraid: string;
  wbraid: string;
  msclkid: string;
  fbclid: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  utm_id: string;
  landing_page_path: string;
  landing_page_url: string;
  referrer_url: string;
  referrer_host: string;
  page_variant_id: string;
  form_variant_id: string;
  session_id: string;
  lead_id: string;
  first_seen_at_utc: string;
  submitted_at_utc: string;
  seconds_to_submit: string;
  scroll_depth_max_pct: string;
  engaged_time_seconds: string;
  device_type: string;
  browser_family: string;
  os_family: string;
  viewport_w: string;
  viewport_h: string;
  language: string;
  timezone: string;
  service_area_bucket: string;
  value_tier_prediction: string;
  intent_service_type: string;
};

export type CrmOfflineData = {
  contactedAt: string;
  qualifiedAt: string;
  estimateSentAt: string;
  wonAt: string;
  lostAt: string;
  quoteAmountCad: number | null;
  finalRevenueCad: number | null;
  jobCostCad: number | null;
  closeReason: string;
  lossReason: string;
  notes: string;
  uploadReady: boolean;
  offlineConversionUploaded: boolean;
  offlineConversionAt: string;
};

export type CrmLead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  stage: PipelineStage;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  serviceDetails: string;
  serviceAreaBucket: string;
  valueTierPrediction: string;
  intentServiceType: string;
  tracking: Partial<TrackingPayload>;
  offline: CrmOfflineData;
};

export type CrmLeadUpdatePayload = {
  stage?: PipelineStage;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  serviceDetails?: string;
  serviceAreaBucket?: string;
  valueTierPrediction?: string;
  intentServiceType?: string;
  offline?: Partial<CrmOfflineData>;
};