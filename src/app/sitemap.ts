import type { MetadataRoute } from "next";

const siteUrl = "https://titanracers.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: "2026-06-21",
      changeFrequency: "weekly",
      priority: 1,
      images: [
        `${siteUrl}/images/titan-racers-training-bay.png`,
        `${siteUrl}/images/titan-racers-kart-workbench.png`,
        `${siteUrl}/images/titan-racers-habitat.png`,
        `${siteUrl}/images/titan-racers-catalogue.png`,
      ],
    },
  ];
}
