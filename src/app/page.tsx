import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-shell">
      <div className="home-card">
        <h1>Landing Pages</h1>
        <p>Open a route:</p>
        <ul>
          <li>
            <Link href="/concrete-sealing-cowichan">Concrete Sealing landing page</Link>
          </li>
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
