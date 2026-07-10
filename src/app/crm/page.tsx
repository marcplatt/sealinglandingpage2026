import Link from "next/link";

import { CrmClient } from "./CrmClient";
import styles from "./crm.module.css";
import { getCrmKpiSummary, getCrmLeads } from "../../server/crmStore";

export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const [leads, summary] = await Promise.all([getCrmLeads(), getCrmKpiSummary()]);

  return (
    <main className={styles.pageShell}>
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
