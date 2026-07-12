import Link from "next/link";

import { CrmClient } from "./CrmClient";
import styles from "./crm.module.css";
import { getCrmKpiSummary, getCrmLeads } from "../../server/crmStore";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  let leads = [] as Awaited<ReturnType<typeof getCrmLeads>>;
  let summary = {
    totalLeads: 0,
    wonLeads: 0,
    qualifiedLeads: 0,
    estimateSentLeads: 0,
    winRate: 0,
    totalRevenue: 0,
    totalCost: 0,
    margin: 0,
    avgRevenue: 0,
    avgQuote: 0,
    uploadReady: 0
  };
  let loadError = "";

  try {
    [leads, summary] = await Promise.all([getCrmLeads(), getCrmKpiSummary()]);
  } catch (error) {
    console.error("CRM page load failed", error);
    loadError =
      error instanceof Error && error.message
        ? error.message
        : "Unable to load CRM data";
  }

  return (
    <main className={styles.pageShell}>
      {loadError ? (
        <section className={styles.hero}>
          <div>
            <p className={styles.kicker}>CRM Storage Alert</p>
            <h1>CRM data is temporarily unavailable</h1>
            <p className={styles.heroCopy}>
              {loadError}. Check <a href="/api/crm/diagnostics">/api/crm/diagnostics</a> for
              runtime health details.
            </p>
          </div>
        </section>
      ) : null}

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Rocket Wash Pipeline Console</p>
          <h1>CRM</h1>
          <p className={styles.heroCopy}>
            Track every lead from submit to won job, then capture offline details for
            value-based optimization.
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link className="btn btn-outline" href="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </section>

      <CrmClient initialLeads={leads} initialSummary={summary} />
    </main>
  );
}
