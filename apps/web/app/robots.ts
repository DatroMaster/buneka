import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/app/", "/api/", "/login"],
    },
    sitemap: "https://buneka.com/sitemap.xml",
    host: "https://buneka.com",
  };
}
