import "./globals.css";

import Nav from "./components/Nav/Nav";

import { ViewTransitions } from "next-view-transitions";

export const metadata = {
  title: "ISOChrome | MWT by Codegrid",
  description: "MWT by Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html lang="en">
        <body>
          <Nav />
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}
