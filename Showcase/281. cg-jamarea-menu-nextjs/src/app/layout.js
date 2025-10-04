import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata = {
  title: "Jam Area Menu | Codegrid",
  description: "Jam Area Menu | Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
