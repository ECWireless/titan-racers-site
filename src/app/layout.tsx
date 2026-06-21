import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

import "./globals.css";

const siteUrl = "https://titanracers.com";
const siteDescription =
  "Build the kart. Race the habitat. Earn your place in a sci-fi RC racing game set inside humanity's last Titan colony.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Titan Racers",
    template: "%s | Titan Racers",
  },
  description: siteDescription,
  applicationName: "Titan Racers",
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "RaidGuild Forge", url: "https://forge.raidguild.org" }],
  category: "video game",
  creator: "RaidGuild Forge",
  keywords: [
    "Titan Racers",
    "sci-fi racing game",
    "RC kart racing game",
    "kart builder game",
    "RaidGuild Forge",
  ],
  publisher: "RaidGuild Forge",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Titan Racers",
    description: siteDescription,
    url: siteUrl,
    siteName: "Titan Racers",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Titan Racers - Build the kart. Race the habitat. Earn your place.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Titan Racers",
    description: siteDescription,
    images: [
      {
        url: "/twitter-image",
        alt: "Titan Racers - Build the kart. Race the habitat. Earn your place.",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
