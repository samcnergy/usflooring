import type { MetadataRoute } from "next";

const BASE = "https://usfloordesign.com";
const NOW = new Date("2026-09-03");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, lastModified: NOW, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/request-a-visit`, lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/services`, lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/showroom`, lastModified: NOW, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/shop`, lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/projects`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/faq`, lastModified: NOW, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: NOW, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog/2027-interior-design-trends`, lastModified: NOW, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/blog/quartz-countertop-maintenance-guide`, lastModified: NOW, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/blog/porcelain-countertop-care-maintenance`, lastModified: NOW, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/blog/natural-stone-countertop-care-maintenance`, lastModified: NOW, changeFrequency: "yearly", priority: 0.7 },
    { url: `${BASE}/trade`, lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/academy`, lastModified: NOW, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/warranty`, lastModified: NOW, changeFrequency: "yearly", priority: 0.6 },
  ];
}
