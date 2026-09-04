import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "US Floor Design Center | Kitchen, Bathroom and Flooring | Rancho Santa Margarita",
    template: "%s | US Floor Design Center",
  },
  description: "Design-build studio in Rancho Santa Margarita, Orange County. Kitchen remodeling, bathroom remodeling, flooring, tile, cabinets, and countertops. Visit our showroom.",
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
    <html lang="en" className={`${inter.variable} ${newsreader.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
