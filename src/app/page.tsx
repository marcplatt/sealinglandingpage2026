import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-shell">
      <div className="home-card">
        <h1>Landing Pages</h1>
        <p>Open the Concrete Sealing Cowichan page:</p>
        <Link href="/concrete-sealing-cowichan">Go to landing page</Link>
      </div>
    </main>
  );
}
