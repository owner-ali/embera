import type { Metadata } from "next";
import { Fraunces, Manrope, Space_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EMBERA — Crafted for the Extraordinary.",
    template: "%s · EMBERA",
  },
  description:
    "A premium fire-driven dining experience. Reserve your table or order online at EMBERA.",
  openGraph: {
    title: "EMBERA — Crafted for the Extraordinary.",
    description: "Where fire, flavor and creativity meet.",
    siteName: "EMBERA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMBERA — Crafted for the Extraordinary.",
    description: "Where fire, flavor and creativity meet.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable} ${spaceMono.variable}`}>
      <body>
        {children}
        <Toaster theme="dark" position="bottom-right" richColors />
      </body>
    </html>
  );
}
