import "./globals.css";

export const metadata = {
  title: "Concrete Sealing Cowichan | Rocket Wash",
  description:
    "Concrete Sealing Cowichan landing page with click-to-call and lead form tracking fields."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
