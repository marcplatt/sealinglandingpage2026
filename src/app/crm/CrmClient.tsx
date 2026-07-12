"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  PIPELINE_STAGE_LABELS,
  PIPELINE_STAGES,
  type CrmLead,
  type CrmLeadUpdatePayload,
  type PipelineStage
} from "../../types/crm";
import styles from "./crm.module.css";

type CrmClientProps = {
  initialLeads: CrmLead[];
  initialSummary: {
    totalLeads: number;
    wonLeads: number;
    qualifiedLeads: number;
    estimateSentLeads: number;
    winRate: number;
    totalRevenue: number;
    totalCost: number;
    margin: number;
    avgRevenue: number;
    avgQuote: number;
    uploadReady: number;
  };
};

function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) {
    return "-";
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(value);
}

function toInputDateTime(value: string) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function fromInputDateTime(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    return "";
  }
  return new Date(value).toISOString();
}

function readOptionalNumber(value: FormDataEntryValue | null) {
  if (!value || typeof value !== "string" || value.trim().length === 0) {
    return null;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    return null;
  }
  return num;
}

function extractBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true";
}

async function readApiError(response: Response, fallback: string) {
  try {
    const body = (await response.json()) as { error?: string; message?: string };
    return body.message || body.error || fallback;
  } catch {
    return fallback;
  }
}

export function CrmClient({ initialLeads, initialSummary }: CrmClientProps) {
  const [leads, setLeads] = useState<CrmLead[]>(initialLeads);
  const [summary, setSummary] = useState(initialSummary);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(initialLeads[0]?.id || "");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [saveErrorMessage, setSaveErrorMessage] = useState("");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "deleted" | "error">(
    "idle"
  );
  const [deleteErrorMessage, setDeleteErrorMessage] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const refreshRequestSeqRef = useRef(0);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId),
    [leads, selectedLeadId]
  );

  const leadsByStage = useMemo(
    () =>
      PIPELINE_STAGES.map((stage) => ({
        stage,
        leads: leads.filter((lead) => lead.stage === stage)
      })),
    [leads]
  );

  async function refreshData() {
    const requestSeq = ++refreshRequestSeqRef.current;

    const [leadsResponse, summaryResponse] = await Promise.all([
      fetch("/api/crm/leads", { cache: "no-store" }),
      fetch("/api/crm/summary", { cache: "no-store" })
    ]);

    if (requestSeq !== refreshRequestSeqRef.current) {
      return;
    }

    let latestLeads: CrmLead[] | null = null;

    if (leadsResponse.ok) {
      const leadsResult = (await leadsResponse.json()) as { leads: CrmLead[] };
      latestLeads = leadsResult.leads;
      setLeads(latestLeads);
      setSelectedLeadId((currentSelectedLeadId) => {
        if (currentSelectedLeadId && latestLeads?.some((lead) => lead.id === currentSelectedLeadId)) {
          return currentSelectedLeadId;
        }
        return latestLeads?.[0]?.id || "";
      });
    }

    if (summaryResponse.ok) {
      const summaryResult = (await summaryResponse.json()) as {
        summary: CrmClientProps["initialSummary"];
      };
      setSummary({
        ...summaryResult.summary,
        totalLeads: latestLeads ? latestLeads.length : summaryResult.summary.totalLeads
      });
      return;
    }

    if (latestLeads) {
      setSummary((current) => ({
        ...current,
        totalLeads: latestLeads.length
      }));
    }
  }

  useEffect(() => {
    void refreshData();
  }, []);

  function onClickImport() {
    fileInputRef.current?.click();
  }

  async function onFilePicked(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setImportStatus("Importing...");

    try {
      const response = await fetch("/api/crm/import", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Import failed");
      }

      const result = (await response.json()) as {
        imported: number;
        updated: number;
        skipped: number;
      };
      await refreshData();
      setImportStatus(
        `Import complete. Imported ${result.imported}, updated ${result.updated}, skipped ${result.skipped}.`
      );
    } catch {
      setImportStatus("Import failed. Check your CSV format and try again.");
    } finally {
      event.target.value = "";
    }
  }

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedLead) {
      return;
    }

    setSaveErrorMessage("");
    setDeleteStatus("idle");
    setDeleteErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const stage = String(formData.get("stage") || selectedLead.stage) as PipelineStage;

    const patch: CrmLeadUpdatePayload = {
      stage,
      firstName: String(formData.get("firstName") || ""),
      lastName: String(formData.get("lastName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || ""),
      serviceDetails: String(formData.get("serviceDetails") || ""),
      serviceAreaBucket: String(formData.get("serviceAreaBucket") || ""),
      valueTierPrediction: String(formData.get("valueTierPrediction") || ""),
      intentServiceType: String(formData.get("intentServiceType") || ""),
      offline: {
        contactedAt: fromInputDateTime(formData.get("contactedAt")),
        qualifiedAt: fromInputDateTime(formData.get("qualifiedAt")),
        estimateSentAt: fromInputDateTime(formData.get("estimateSentAt")),
        wonAt: fromInputDateTime(formData.get("wonAt")),
        lostAt: fromInputDateTime(formData.get("lostAt")),
        quoteAmountCad: readOptionalNumber(formData.get("quoteAmountCad")),
        finalRevenueCad: readOptionalNumber(formData.get("finalRevenueCad")),
        jobCostCad: readOptionalNumber(formData.get("jobCostCad")),
        closeReason: String(formData.get("closeReason") || ""),
        lossReason: String(formData.get("lossReason") || ""),
        notes: String(formData.get("notes") || ""),
        uploadReady: extractBoolean(formData.get("uploadReady")),
        offlineConversionUploaded: extractBoolean(formData.get("offlineConversionUploaded")),
        offlineConversionAt: fromInputDateTime(formData.get("offlineConversionAt"))
      }
    };

    setSaveStatus("saving");

    try {
      const response = await fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(patch)
      });

      if (!response.ok) {
        const message = await readApiError(response, "Unable to save lead changes");
        throw new Error(message);
      }

      const result = (await response.json()) as { lead: CrmLead };
      setLeads((current) =>
        current.map((lead) => (lead.id === result.lead.id ? result.lead : lead))
      );
      await refreshData();
      setSaveStatus("saved");
    } catch (error) {
      setSaveStatus("error");
      setSaveErrorMessage(
        error instanceof Error && error.message
          ? error.message
          : "Unable to save lead changes"
      );
    }
  }

  async function onDeleteLead() {
    if (!selectedLead) {
      return;
    }

    const confirmed = window.confirm(
      `Delete lead ${selectedLead.firstName} ${selectedLead.lastName} (${selectedLead.id})?`
    );
    if (!confirmed) {
      return;
    }

    setDeleteStatus("deleting");
    setDeleteErrorMessage("");
    setSaveStatus("idle");
    setSaveErrorMessage("");

    try {
      const response = await fetch(`/api/crm/leads/${selectedLead.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const message = await readApiError(response, "Unable to delete lead");
        throw new Error(message);
      }

      const deletedLeadId = selectedLead.id;
      const remainingLeads = leads.filter((lead) => lead.id !== deletedLeadId);
      const nextSelectedId =
        remainingLeads.find((lead) => lead.id === selectedLeadId)?.id ||
        remainingLeads[0]?.id ||
        "";

      setLeads(remainingLeads);
      setSelectedLeadId(nextSelectedId);
      await refreshData();
      setDeleteStatus("deleted");
    } catch (error) {
      setDeleteStatus("error");
      setDeleteErrorMessage(
        error instanceof Error && error.message ? error.message : "Unable to delete lead"
      );
    }
  }

  return (
    <section className={styles.gridShell}>
      <div className={styles.kpiStrip}>
        <article className={styles.kpiCard}>
          <p>Total Leads</p>
          <strong>{leads.length}</strong>
        </article>
        <article className={styles.kpiCard}>
          <p>Won Leads</p>
          <strong>{summary.wonLeads}</strong>
        </article>
        <article className={styles.kpiCard}>
          <p>Win Rate</p>
          <strong>{summary.winRate.toFixed(1)}%</strong>
        </article>
        <article className={styles.kpiCard}>
          <p>Avg Quote</p>
          <strong>{formatCurrency(Math.round(summary.avgQuote))}</strong>
        </article>
        <article className={styles.kpiCard}>
          <p>Avg Revenue</p>
          <strong>{formatCurrency(Math.round(summary.avgRevenue))}</strong>
        </article>
        <article className={styles.kpiCard}>
          <p>Margin</p>
          <strong>{summary.margin.toFixed(1)}%</strong>
        </article>
      </div>

      <div className={styles.actionRow}>
        <Link className="btn btn-outline" href="/api/crm/export">
          Export CSV
        </Link>
        <button className="btn btn-outline" type="button" onClick={onClickImport}>
          Import CSV
        </button>
        <a className="btn btn-outline" href="/api/crm/offline-upload-ready" target="_blank" rel="noreferrer">
          View Upload-Ready Feed
        </a>
        <input
          ref={fileInputRef}
          className={styles.hiddenInput}
          type="file"
          accept=".csv,text/csv"
          onChange={onFilePicked}
        />
      </div>
      {importStatus ? <p className={styles.importStatus}>{importStatus}</p> : null}

      <div className={styles.pipelineWrap}>
        {leadsByStage.map((bucket) => (
          <article key={bucket.stage} className={styles.pipelineColumn}>
            <header className={styles.columnHeader}>
              <h2>{PIPELINE_STAGE_LABELS[bucket.stage]}</h2>
              <span>{bucket.leads.length}</span>
            </header>
            <div className={styles.cardStack}>
              {bucket.leads.length === 0 ? <p className={styles.emptyState}>No leads</p> : null}
              {bucket.leads.map((lead) => {
                const isSelected = lead.id === selectedLeadId;
                return (
                  <button
                    key={lead.id}
                    type="button"
                    className={`${styles.leadCard} ${isSelected ? styles.leadCardSelected : ""}`}
                    onClick={() => setSelectedLeadId(lead.id)}
                  >
                    <strong>
                      {lead.firstName} {lead.lastName}
                    </strong>
                    <span>{lead.phone}</span>
                    <span>{lead.serviceAreaBucket || "unknown area"}</span>
                    <span>
                      Quote {formatCurrency(lead.offline.quoteAmountCad)} | Revenue{" "}
                      {formatCurrency(lead.offline.finalRevenueCad)}
                    </span>
                  </button>
                );
              })}
            </div>
          </article>
        ))}
      </div>

      <aside className={styles.editorPane}>
        {!selectedLead ? (
          <p>Select a lead to edit.</p>
        ) : (
          <form className={styles.editorForm} onSubmit={onSave}>
            <div className={styles.sectionHeader}>
              <h2>
                {selectedLead.firstName} {selectedLead.lastName}
              </h2>
              <p>Lead ID: {selectedLead.id}</p>
            </div>

            <label>
              Stage
              <select name="stage" defaultValue={selectedLead.stage}>
                {PIPELINE_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {PIPELINE_STAGE_LABELS[stage]}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.gridTwo}>
              <label>
                First name
                <input name="firstName" defaultValue={selectedLead.firstName} required />
              </label>
              <label>
                Last name
                <input name="lastName" defaultValue={selectedLead.lastName} required />
              </label>
              <label>
                Email
                <input name="email" type="email" defaultValue={selectedLead.email} required />
              </label>
              <label>
                Phone
                <input name="phone" defaultValue={selectedLead.phone} required />
              </label>
            </div>

            <label>
              Address
              <input name="address" defaultValue={selectedLead.address} />
            </label>

            <label>
              Service details
              <textarea name="serviceDetails" rows={3} defaultValue={selectedLead.serviceDetails} />
            </label>

            <div className={styles.gridThree}>
              <label>
                Service area bucket
                <input name="serviceAreaBucket" defaultValue={selectedLead.serviceAreaBucket} />
              </label>
              <label>
                Value tier prediction
                <input name="valueTierPrediction" defaultValue={selectedLead.valueTierPrediction} />
              </label>
              <label>
                Intent service type
                <input name="intentServiceType" defaultValue={selectedLead.intentServiceType} />
              </label>
            </div>

            <h3>Offline Close-Loop Data</h3>

            <div className={styles.gridTwo}>
              <label>
                Contacted at
                <input
                  type="datetime-local"
                  name="contactedAt"
                  defaultValue={toInputDateTime(selectedLead.offline.contactedAt)}
                />
              </label>
              <label>
                Qualified at
                <input
                  type="datetime-local"
                  name="qualifiedAt"
                  defaultValue={toInputDateTime(selectedLead.offline.qualifiedAt)}
                />
              </label>
              <label>
                Estimate sent at
                <input
                  type="datetime-local"
                  name="estimateSentAt"
                  defaultValue={toInputDateTime(selectedLead.offline.estimateSentAt)}
                />
              </label>
              <label>
                Won at
                <input
                  type="datetime-local"
                  name="wonAt"
                  defaultValue={toInputDateTime(selectedLead.offline.wonAt)}
                />
              </label>
              <label>
                Lost at
                <input
                  type="datetime-local"
                  name="lostAt"
                  defaultValue={toInputDateTime(selectedLead.offline.lostAt)}
                />
              </label>
              <label>
                Offline conversion uploaded at
                <input
                  type="datetime-local"
                  name="offlineConversionAt"
                  defaultValue={toInputDateTime(selectedLead.offline.offlineConversionAt)}
                />
              </label>
            </div>

            <div className={styles.gridThree}>
              <label>
                Quote amount (CAD)
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="quoteAmountCad"
                  defaultValue={selectedLead.offline.quoteAmountCad ?? ""}
                />
              </label>
              <label>
                Final revenue (CAD)
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="finalRevenueCad"
                  defaultValue={selectedLead.offline.finalRevenueCad ?? ""}
                />
              </label>
              <label>
                Job cost (CAD)
                <input
                  type="number"
                  min="0"
                  step="1"
                  name="jobCostCad"
                  defaultValue={selectedLead.offline.jobCostCad ?? ""}
                />
              </label>
            </div>

            <label>
              Close reason
              <input name="closeReason" defaultValue={selectedLead.offline.closeReason} />
            </label>

            <label>
              Loss reason
              <input name="lossReason" defaultValue={selectedLead.offline.lossReason} />
            </label>

            <label>
              Notes
              <textarea name="notes" rows={4} defaultValue={selectedLead.offline.notes} />
            </label>

            <div className={styles.checkboxRow}>
              <label>
                <input
                  type="checkbox"
                  name="uploadReady"
                  defaultChecked={selectedLead.offline.uploadReady}
                />
                Ready for offline conversion upload
              </label>
              <label>
                <input
                  type="checkbox"
                  name="offlineConversionUploaded"
                  defaultChecked={selectedLead.offline.offlineConversionUploaded}
                />
                Offline conversion already uploaded
              </label>
            </div>

            <div className={styles.trackingBlock}>
              <h3>Tracking Snapshot</h3>
              <p>
                gclid: {selectedLead.tracking.gclid || "-"} | campaign:{" "}
                {selectedLead.tracking.utm_campaign || "-"} | variant:{" "}
                {selectedLead.tracking.page_variant_id || "-"}
              </p>
              <p>
                Session: {selectedLead.tracking.session_id || "-"} | Submitted: {" "}
                {selectedLead.tracking.submitted_at_utc || selectedLead.createdAt}
              </p>
            </div>

            <div className={styles.formActions}>
              <button className="btn btn-solid" type="submit" disabled={saveStatus === "saving"}>
                {saveStatus === "saving" ? "Saving..." : "Save Lead"}
              </button>
              <button
                className="btn btn-outline"
                type="button"
                onClick={onDeleteLead}
                disabled={deleteStatus === "deleting"}
              >
                {deleteStatus === "deleting" ? "Deleting..." : "Delete Lead"}
              </button>
            </div>

            {saveStatus === "saved" ? <p className={styles.statusOk}>Saved.</p> : null}
            {saveStatus === "error" ? (
              <p className={styles.statusError}>
                Save failed. {saveErrorMessage || "Try again."}
              </p>
            ) : null}
            {deleteStatus === "deleted" ? <p className={styles.statusOk}>Lead deleted.</p> : null}
            {deleteStatus === "error" ? (
              <p className={styles.statusError}>
                Delete failed. {deleteErrorMessage || "Try again."}
              </p>
            ) : null}
          </form>
        )}
      </aside>
    </section>
  );
}
