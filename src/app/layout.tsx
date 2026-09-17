import type { Metadata } from "next";
import { Domine, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const domine = Domine({
  variable: "--font-domine",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const sourceSans3 = Source_Sans_3({
  variable: "--font-source-sans-3",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "US Floor Design Center | Residential and Commercial Design-Build | South Orange County",
    template: "%s | US Floor Design Center",
  },
  description: "Design-build firm in Rancho Santa Margarita with 30 years in Orange County, serving homeowners, medical practices, retailers, and real estate investors across South Orange County.",
  metadataBase: new URL("https://usfloordesign.com"),
  openGraph: {
    type: "website",
    siteName: "US Floor Design Center",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${domine.variable} ${sourceSans3.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
