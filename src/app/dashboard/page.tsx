import Link from "next/link";

import { SendToClaudeButton } from "./SendToClaudeButton";
import styles from "./dashboard.module.css";
import { getGoogleAdsDashboardData } from "../../server/googleAdsDashboard";

export const dynamic = "force-dynamic";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatRoas(revenue: number, spend: number) {
  if (spend <= 0) {
    return "0.00x";
  }
  return `${(revenue / spend).toFixed(2)}x`;
}

export default async function DashboardPage() {
  const dashboard = await getGoogleAdsDashboardData("24014313278");
  const campaigns = dashboard.campaigns;
  const totals = campaigns.reduce(
    (acc, campaign) => {
      acc.spend += campaign.spend;
      acc.revenue += campaign.revenue;
      acc.conversions += campaign.conversions;
      return acc;
    },
    { spend: 0, revenue: 0, conversions: 0 }
  );

  const rankedRecommendations = [...dashboard.recommendations].sort(
    (a, b) => b.dollarsRecoverable - a.dollarsRecoverable
  );

  const dollarsAtStake = rankedRecommendations.reduce(
    (sum, rec) => sum + rec.dollarsRecoverable,
    0
  );

  return (
    <main className={styles.pageShell}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Google Ads Performance Console</p>
          <h1>Dashboard</h1>
          <p className={styles.heroCopy}>
            Campaign-level ROAS snapshot plus the highest-value optimization
            opportunities, ranked by recoverable dollars.
          </p>
          <p className={styles.dataTag}>
            Data source: {dashboard.source === "google-ads-live" ? "Google Ads Live" : "Fallback"}
          </p>
        </div>
        <div className={styles.heroActions}>
          <Link className="btn btn-outline" href="/crm">
            Open CRM
          </Link>
          <Link className="btn btn-outline" href="/concrete-sealing-cowichan">
            Open Landing Page
          </Link>
        </div>
      </section>

      <section className={styles.statGrid} aria-label="Account totals">
        <article className={styles.statCard}>
          <p>Total Spend</p>
          <strong>{formatCurrency(totals.spend)}</strong>
        </article>
        <article className={styles.statCard}>
          <p>Total Revenue</p>
          <strong>{formatCurrency(totals.revenue)}</strong>
        </article>
        <article className={styles.statCard}>
          <p>Blended ROAS</p>
          <strong>{formatRoas(totals.revenue, totals.spend)}</strong>
        </article>
        <article className={styles.statCard}>
          <p>Dollars Recoverable</p>
          <strong>{formatCurrency(dollarsAtStake)}</strong>
        </article>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h2>ROAS by Campaign</h2>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.roasTable}>
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Spend</th>
                <th>Revenue</th>
                <th>Conversions</th>
                <th>ROAS</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.name}</td>
                  <td>{formatCurrency(campaign.spend)}</td>
                  <td>{formatCurrency(campaign.revenue)}</td>
                  <td>{campaign.conversions}</td>
                  <td>{formatRoas(campaign.revenue, campaign.spend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockHeader}>
          <h2>Top Recommendations</h2>
          <p>Ranked by dollars recoverable.</p>
        </div>
        <div className={styles.recommendationList}>
          {rankedRecommendations.length === 0 ? (
            <article className={styles.recommendationCard}>
              <div className={styles.recommendationBody}>
                <h3>No recommendations yet</h3>
                <p>
                  This campaign has no recoverable-dollar opportunities in the
                  last 30 days based on current search-term behavior.
                </p>
              </div>
            </article>
          ) : null}

          {rankedRecommendations.map((recommendation, index) => {
            const campaign = dashboard.targetCampaign ?? campaigns[0];
            return (
              <article className={styles.recommendationCard} key={recommendation.id}>
                <div className={styles.recommendationMeta}>
                  <p className={styles.rank}>#{index + 1}</p>
                  <p className={styles.recoverable}>
                    {formatCurrency(recommendation.dollarsRecoverable)} recoverable
                  </p>
                </div>

                <div className={styles.recommendationBody}>
                  <h3>{recommendation.title}</h3>
                  <p className={styles.campaignName}>{campaign?.name ?? "Unknown campaign"}</p>
                  <p>{recommendation.reason}</p>
                  <p className={styles.actionLine}>
                    <strong>Action:</strong> {recommendation.action}
                  </p>
                </div>

                <div className={styles.recommendationCta}>
                  <SendToClaudeButton
                    recommendationTitle={recommendation.title}
                    campaignName={campaign?.name ?? "Unknown campaign"}
                    dollarsRecoverable={recommendation.dollarsRecoverable}
                    reason={recommendation.reason}
                    action={recommendation.action}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}