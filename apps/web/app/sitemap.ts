import type { MetadataRoute } from "next";
import { sectors } from "@/lib/content/sectors";

const baseUrl = "https://buneka.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/paketler`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/sektorler`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${baseUrl}/ek-moduller`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${baseUrl}/kullanici-rehberi`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/demo`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
  ];

  const sectorRoutes: MetadataRoute.Sitemap = sectors.map((sector) => ({
    url: `${baseUrl}/sektorler/${sector.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  return [...staticRoutes, ...sectorRoutes];
}
