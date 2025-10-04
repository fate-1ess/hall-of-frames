import "./globals.css";

export const metadata = {
  title: "Samuel Siebler Rebuild | Codegrid",
  description: "Built by Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
