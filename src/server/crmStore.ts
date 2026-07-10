import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import {
  PIPELINE_STAGES,
  type CrmLead,
  type CrmLeadUpdatePayload,
  type CrmOfflineData,
  type PipelineStage,
  type TrackingPayload
} from "../types/crm";

type CrmStore = {
  leads: CrmLead[];
};

type CsvImportResult = {
  imported: number;
  updated: number;
  skipped: number;
};

const CSV_COLUMNS = [
  "id",
  "createdAt",
  "updatedAt",
  "stage",
  "firstName",
  "lastName",
  "email",
  "phone",
  "address",
  "serviceDetails",
  "serviceAreaBucket",
  "valueTierPrediction",
  "intentServiceType",
  "contactedAt",
  "qualifiedAt",
  "estimateSentAt",
  "wonAt",
  "lostAt",
  "quoteAmountCad",
  "finalRevenueCad",
  "jobCostCad",
  "closeReason",
  "lossReason",
  "notes",
  "uploadReady",
  "offlineConversionUploaded",
  "offlineConversionAt",
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "session_id",
  "lead_id",
  "submitted_at_utc"
] as const;

const dataDir = path.join(process.cwd(), "data");
const storePath = path.join(dataDir, "crm-leads.json");

const TRACKING_FIELDS: Array<keyof TrackingPayload> = [
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

function emptyStore(): CrmStore {
  return { leads: [] };
}

function toStringValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return "";
}

function toNumberOrNull(value: unknown): number | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return null;
  }
  return num;
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return fallback;
}

function toStage(value: unknown, fallback: PipelineStage): PipelineStage {
  if (typeof value !== "string") {
    return fallback;
  }
  if ((PIPELINE_STAGES as readonly string[]).includes(value)) {
    return value as PipelineStage;
  }
  return fallback;
}

function defaultOfflineData(): CrmOfflineData {
  return {
    contactedAt: "",
    qualifiedAt: "",
    estimateSentAt: "",
    wonAt: "",
    lostAt: "",
    quoteAmountCad: null,
    finalRevenueCad: null,
    jobCostCad: null,
    closeReason: "",
    lossReason: "",
    notes: "",
    uploadReady: false,
    offlineConversionUploaded: false,
    offlineConversionAt: ""
  };
}

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

async function readStore(): Promise<CrmStore> {
  try {
    const raw = await fs.readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as CrmStore;
    if (!parsed || !Array.isArray(parsed.leads)) {
      return emptyStore();
    }
    return parsed;
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: CrmStore) {
  await ensureDataDir();
  const tempPath = `${storePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tempPath, storePath);
}

function createLeadId() {
  return `lead_${crypto.randomUUID()}`;
}

function escapeCsv(value: string) {
  if (/[,\n\r"]/g.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCsv(csvText: string): Array<Record<string, string>> {
  const rows: string[][] = [];
  let currentCell = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && next === '"') {
        currentCell += '"';
        i += 1;
      } else {
        insideQuotes = !insideQuotes;
      }
      continue;
    }

    if (!insideQuotes && char === ",") {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if (!insideQuotes && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") {
        i += 1;
      }
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentCell = "";
      currentRow = [];
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  if (rows.length === 0) {
    return [];
  }

  const [header, ...bodyRows] = rows;
  return bodyRows
    .filter((row) => row.some((cell) => cell.trim().length > 0))
    .map((row) => {
      const record: Record<string, string> = {};
      header.forEach((column, index) => {
        record[column] = row[index] ?? "";
      });
      return record;
    });
}

function toCsvRows(leads: CrmLead[]): string {
  const header = CSV_COLUMNS.join(",");
  const rows = leads.map((lead) => {
    const values: string[] = [
      lead.id,
      lead.createdAt,
      lead.updatedAt,
      lead.stage,
      lead.firstName,
      lead.lastName,
      lead.email,
      lead.phone,
      lead.address,
      lead.serviceDetails,
      lead.serviceAreaBucket,
      lead.valueTierPrediction,
      lead.intentServiceType,
      lead.offline.contactedAt,
      lead.offline.qualifiedAt,
      lead.offline.estimateSentAt,
      lead.offline.wonAt,
      lead.offline.lostAt,
      lead.offline.quoteAmountCad === null ? "" : String(lead.offline.quoteAmountCad),
      lead.offline.finalRevenueCad === null ? "" : String(lead.offline.finalRevenueCad),
      lead.offline.jobCostCad === null ? "" : String(lead.offline.jobCostCad),
      lead.offline.closeReason,
      lead.offline.lossReason,
      lead.offline.notes,
      String(lead.offline.uploadReady),
      String(lead.offline.offlineConversionUploaded),
      lead.offline.offlineConversionAt,
      lead.tracking.gclid || "",
      lead.tracking.gbraid || "",
      lead.tracking.wbraid || "",
      lead.tracking.utm_source || "",
      lead.tracking.utm_medium || "",
      lead.tracking.utm_campaign || "",
      lead.tracking.utm_term || "",
      lead.tracking.utm_content || "",
      lead.tracking.utm_id || "",
      lead.tracking.session_id || "",
      lead.tracking.lead_id || "",
      lead.tracking.submitted_at_utc || ""
    ];
    return values.map((value) => escapeCsv(value)).join(",");
  });

  return [header, ...rows].join("\n");
}

export async function exportCrmLeadsCsv(): Promise<string> {
  const leads = await getCrmLeads();
  return toCsvRows(leads);
}

export async function importCrmLeadsCsv(csvText: string): Promise<CsvImportResult> {
  const records = parseCsv(csvText);
  const store = await readStore();
  let imported = 0;
  let updated = 0;
  let skipped = 0;

  for (const row of records) {
    const candidateId = row.id || row.lead_id;
    if (!candidateId) {
      skipped += 1;
      continue;
    }

    const existingIndex = store.leads.findIndex((lead) => lead.id === candidateId);
    if (existingIndex < 0) {
      const now = new Date().toISOString();
      const newLead: CrmLead = {
        id: candidateId,
        createdAt: row.createdAt || now,
        updatedAt: now,
        stage: toStage(row.stage, "new_lead"),
        firstName: row.firstName || "Imported",
        lastName: row.lastName || "Lead",
        email: row.email || "unknown@example.com",
        phone: row.phone || "",
        address: row.address || "",
        serviceDetails: row.serviceDetails || "",
        serviceAreaBucket: row.serviceAreaBucket || "",
        valueTierPrediction: row.valueTierPrediction || "",
        intentServiceType: row.intentServiceType || "concrete_sealing",
        tracking: {
          gclid: row.gclid || "",
          gbraid: row.gbraid || "",
          wbraid: row.wbraid || "",
          utm_source: row.utm_source || "",
          utm_medium: row.utm_medium || "",
          utm_campaign: row.utm_campaign || "",
          utm_term: row.utm_term || "",
          utm_content: row.utm_content || "",
          utm_id: row.utm_id || "",
          session_id: row.session_id || "",
          lead_id: row.lead_id || candidateId,
          submitted_at_utc: row.submitted_at_utc || row.createdAt || now
        },
        offline: {
          contactedAt: row.contactedAt || "",
          qualifiedAt: row.qualifiedAt || "",
          estimateSentAt: row.estimateSentAt || "",
          wonAt: row.wonAt || "",
          lostAt: row.lostAt || "",
          quoteAmountCad: toNumberOrNull(row.quoteAmountCad),
          finalRevenueCad: toNumberOrNull(row.finalRevenueCad),
          jobCostCad: toNumberOrNull(row.jobCostCad),
          closeReason: row.closeReason || "",
          lossReason: row.lossReason || "",
          notes: row.notes || "",
          uploadReady: toBoolean(row.uploadReady),
          offlineConversionUploaded: toBoolean(row.offlineConversionUploaded),
          offlineConversionAt: row.offlineConversionAt || ""
        }
      };

      store.leads.unshift(newLead);
      imported += 1;
      continue;
    }

    const current = store.leads[existingIndex];
    const merged: CrmLead = {
      ...current,
      stage: toStage(row.stage, current.stage),
      firstName: row.firstName || current.firstName,
      lastName: row.lastName || current.lastName,
      email: row.email || current.email,
      phone: row.phone || current.phone,
      address: row.address || current.address,
      serviceDetails: row.serviceDetails || current.serviceDetails,
      serviceAreaBucket: row.serviceAreaBucket || current.serviceAreaBucket,
      valueTierPrediction: row.valueTierPrediction || current.valueTierPrediction,
      intentServiceType: row.intentServiceType || current.intentServiceType,
      offline: {
        ...current.offline,
        contactedAt: row.contactedAt || current.offline.contactedAt,
        qualifiedAt: row.qualifiedAt || current.offline.qualifiedAt,
        estimateSentAt: row.estimateSentAt || current.offline.estimateSentAt,
        wonAt: row.wonAt || current.offline.wonAt,
        lostAt: row.lostAt || current.offline.lostAt,
        quoteAmountCad:
          row.quoteAmountCad === ""
            ? current.offline.quoteAmountCad
            : toNumberOrNull(row.quoteAmountCad),
        finalRevenueCad:
          row.finalRevenueCad === ""
            ? current.offline.finalRevenueCad
            : toNumberOrNull(row.finalRevenueCad),
        jobCostCad:
          row.jobCostCad === ""
            ? current.offline.jobCostCad
            : toNumberOrNull(row.jobCostCad),
        closeReason: row.closeReason || current.offline.closeReason,
        lossReason: row.lossReason || current.offline.lossReason,
        notes: row.notes || current.offline.notes,
        uploadReady:
          row.uploadReady === ""
            ? current.offline.uploadReady
            : toBoolean(row.uploadReady, current.offline.uploadReady),
        offlineConversionUploaded:
          row.offlineConversionUploaded === ""
            ? current.offline.offlineConversionUploaded
            : toBoolean(
                row.offlineConversionUploaded,
                current.offline.offlineConversionUploaded
              ),
        offlineConversionAt: row.offlineConversionAt || current.offline.offlineConversionAt
      },
      tracking: {
        ...current.tracking,
        gclid: row.gclid || current.tracking.gclid || "",
        gbraid: row.gbraid || current.tracking.gbraid || "",
        wbraid: row.wbraid || current.tracking.wbraid || "",
        utm_source: row.utm_source || current.tracking.utm_source || "",
        utm_medium: row.utm_medium || current.tracking.utm_medium || "",
        utm_campaign: row.utm_campaign || current.tracking.utm_campaign || "",
        utm_term: row.utm_term || current.tracking.utm_term || "",
        utm_content: row.utm_content || current.tracking.utm_content || "",
        utm_id: row.utm_id || current.tracking.utm_id || "",
        session_id: row.session_id || current.tracking.session_id || "",
        lead_id: row.lead_id || current.tracking.lead_id || "",
        submitted_at_utc: row.submitted_at_utc || current.tracking.submitted_at_utc || ""
      },
      updatedAt: new Date().toISOString()
    };

    store.leads[existingIndex] = merged;
    updated += 1;
  }

  if (imported > 0 || updated > 0) {
    await writeStore(store);
  }

  return { imported, updated, skipped };
}

export async function getOfflineUploadReadyLeads(): Promise<CrmLead[]> {
  const leads = await getCrmLeads();
  return leads.filter((lead) => {
    const hasClickId = Boolean(
      lead.tracking.gclid || lead.tracking.gbraid || lead.tracking.wbraid
    );
    const hasRevenue = (lead.offline.finalRevenueCad ?? 0) > 0;
    return lead.offline.uploadReady && lead.stage === "won" && hasClickId && hasRevenue;
  });
}

export async function getCrmKpiSummary() {
  const leads = await getCrmLeads();
  const won = leads.filter((lead) => lead.stage === "won");
  const qualified = leads.filter((lead) => lead.stage === "qualified");
  const estimateSent = leads.filter((lead) => lead.stage === "estimate_sent");

  const totalRevenue = won.reduce(
    (sum, lead) => sum + (lead.offline.finalRevenueCad ?? 0),
    0
  );
  const totalCost = won.reduce((sum, lead) => sum + (lead.offline.jobCostCad ?? 0), 0);
  const totalQuote = leads.reduce((sum, lead) => sum + (lead.offline.quoteAmountCad ?? 0), 0);

  const avgRevenue = won.length > 0 ? totalRevenue / won.length : 0;
  const avgQuote = leads.length > 0 ? totalQuote / leads.length : 0;
  const margin = totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;
  const winRate = leads.length > 0 ? (won.length / leads.length) * 100 : 0;
  const uploadReady = leads.filter((lead) => lead.offline.uploadReady).length;

  return {
    totalLeads: leads.length,
    wonLeads: won.length,
    qualifiedLeads: qualified.length,
    estimateSentLeads: estimateSent.length,
    winRate,
    totalRevenue,
    totalCost,
    margin,
    avgRevenue,
    avgQuote,
    uploadReady
  };
}

export async function getCrmLeads(): Promise<CrmLead[]> {
  const store = await readStore();
  return [...store.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createLeadFromSubmission(body: Record<string, unknown>): Promise<CrmLead> {
  const now = new Date().toISOString();
  const tracking: Partial<TrackingPayload> = {};

  for (const field of TRACKING_FIELDS) {
    const value = toStringValue(body[field]);
    if (value) {
      tracking[field] = value;
    }
  }

  const leadId = tracking.lead_id || createLeadId();

  const lead: CrmLead = {
    id: leadId,
    createdAt: now,
    updatedAt: now,
    stage: "new_lead",
    firstName: toStringValue(body.firstName),
    lastName: toStringValue(body.lastName),
    email: toStringValue(body.email),
    phone: toStringValue(body.phone),
    address: toStringValue(body.address),
    serviceDetails: toStringValue(body.serviceDetails),
    serviceAreaBucket: tracking.service_area_bucket || "",
    valueTierPrediction: tracking.value_tier_prediction || "",
    intentServiceType: tracking.intent_service_type || "concrete_sealing",
    tracking,
    offline: defaultOfflineData()
  };

  const store = await readStore();
  store.leads.unshift(lead);
  await writeStore(store);
  return lead;
}

export async function updateCrmLead(
  leadId: string,
  patch: CrmLeadUpdatePayload
): Promise<CrmLead | null> {
  const store = await readStore();
  const leadIndex = store.leads.findIndex((lead) => lead.id === leadId);

  if (leadIndex < 0) {
    return null;
  }

  const current = store.leads[leadIndex];
  const nextOffline: CrmOfflineData = {
    ...current.offline,
    ...(patch.offline ?? {})
  };

  if (patch.offline) {
    nextOffline.quoteAmountCad =
      patch.offline.quoteAmountCad === undefined
        ? current.offline.quoteAmountCad
        : toNumberOrNull(patch.offline.quoteAmountCad);

    nextOffline.finalRevenueCad =
      patch.offline.finalRevenueCad === undefined
        ? current.offline.finalRevenueCad
        : toNumberOrNull(patch.offline.finalRevenueCad);

    nextOffline.jobCostCad =
      patch.offline.jobCostCad === undefined
        ? current.offline.jobCostCad
        : toNumberOrNull(patch.offline.jobCostCad);

    nextOffline.uploadReady =
      patch.offline.uploadReady === undefined
        ? current.offline.uploadReady
        : toBoolean(patch.offline.uploadReady, current.offline.uploadReady);

    nextOffline.offlineConversionUploaded =
      patch.offline.offlineConversionUploaded === undefined
        ? current.offline.offlineConversionUploaded
        : toBoolean(
            patch.offline.offlineConversionUploaded,
            current.offline.offlineConversionUploaded
          );
  }

  const updated: CrmLead = {
    ...current,
    stage: patch.stage ? toStage(patch.stage, current.stage) : current.stage,
    firstName: patch.firstName ?? current.firstName,
    lastName: patch.lastName ?? current.lastName,
    email: patch.email ?? current.email,
    phone: patch.phone ?? current.phone,
    address: patch.address ?? current.address,
    serviceDetails: patch.serviceDetails ?? current.serviceDetails,
    serviceAreaBucket: patch.serviceAreaBucket ?? current.serviceAreaBucket,
    valueTierPrediction: patch.valueTierPrediction ?? current.valueTierPrediction,
    intentServiceType: patch.intentServiceType ?? current.intentServiceType,
    offline: nextOffline,
    updatedAt: new Date().toISOString()
  };

  store.leads[leadIndex] = updated;
  await writeStore(store);
  return updated;
}