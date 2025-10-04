import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Menu from "@/components/Menu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Circular Futuristic Navigation Menu | Codegrid",
  description: "Circular Futuristic Navigation Menu | Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Menu />
        {children}
      </body>
    </html>
  );
}
