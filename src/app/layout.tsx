import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://titanracers.com"),
  title: {
    default: "Titan Racers",
    template: "%s | Titan Racers",
  },
  description:
    "A sci-fi RC kart racing game set inside humanity's last Titan colony, where every machine has a builder and every race builds reputation.",
  applicationName: "Titan Racers",
  openGraph: {
    title: "Titan Racers",
    description:
      "Build the kart. Race the habitat. Earn the surface.",
    url: "https://titanracers.com",
    siteName: "Titan Racers",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Titan Racers",
    description:
      "Build the kart. Race the habitat. Earn the surface.",
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
