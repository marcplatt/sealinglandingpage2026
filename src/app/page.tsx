import Link from "next/link";
import { landingPageConfigs } from "./landing/config";

export default function HomePage() {
  return (
    <main className="home-shell">
      <div className="home-card">
        <h1>Landing Pages</h1>
        <p>Open a route:</p>
        <ul>
          {landingPageConfigs.map((config) => (
            <li key={config.slug}>
              <Link href={`/${config.slug}`}>{config.routeLabel}</Link>
            </li>
          ))}
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
