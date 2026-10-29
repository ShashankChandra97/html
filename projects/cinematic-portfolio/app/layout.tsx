import type { Metadata, Viewport } from "next";
import "./globals.css";
import localFont from "next/font/local";
import Script from "next/script";
import { withBasePath } from "@/lib/basePath";

const geist = localFont({ src: [
  { path: "../public/fonts/Geist-Latin.woff2", weight: "400", style: "normal" },
  { path: "../public/fonts/Geist-Medium.woff2", weight: "500", style: "normal" },
], variable: "--font-geist", display: "swap" });

const manrope = localFont({
  src: "../public/fonts/Manrope-Latin-Variable.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-manrope",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const metadata: Metadata = {
  title: "Shashank Chandra — AI DevOps Engineer",
  description:
    "Shashank Chandra is an AI DevOps and cloud engineer specializing in Azure infrastructure, CI/CD automation, Kubernetes, and AI-powered developer workflows.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${manrope.variable}`}>
      <head><link rel="stylesheet" href={withBasePath("/assets/legal/notice.css")} /></head>
      <body>{children}<noscript><div className="site-notice-fallback">Please enable JavaScript to read and agree to the site terms and privacy notice, or <a href="about:blank">exit this site</a>.</div></noscript><Script src={withBasePath("/assets/legal/notice.js")} strategy="afterInteractive" /></body>
    </html>
  );
}
