import type { MetadataRoute } from "next";

const siteUrl = "https://titanracers.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${siteUrl}/images/falls-view-park-habitat.webp`,
        `${siteUrl}/images/kart-editor.webp`,
        `${siteUrl}/images/island-three.webp`,
        `${siteUrl}/images/official-karts.webp`,
      ],
    },
  ];
}
