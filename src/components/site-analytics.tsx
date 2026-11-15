"use client";

import { Analytics } from "@vercel/analytics/next";

// Confirm and unsubscribe links carry tokens; page views record the URL
// without them.
export function SiteAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        const url = new URL(event.url);

        if (!url.searchParams.has("token")) {
          return event;
        }

        url.searchParams.delete("token");
        return { ...event, url: url.toString() };
      }}
    />
  );
}
