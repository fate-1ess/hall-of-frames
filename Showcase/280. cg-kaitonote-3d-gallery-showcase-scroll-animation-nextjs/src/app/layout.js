import "./globals.css";

export const metadata = {
  title: "Kaitonote Scroll Animation | Codegrid",
  description: "Kaitonote Scroll Animation | Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
