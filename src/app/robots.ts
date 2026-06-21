import type { MetadataRoute } from "next";

const siteUrl = "https://titanracers.com";
const siteHost = "titanracers.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteHost,
  };
}
