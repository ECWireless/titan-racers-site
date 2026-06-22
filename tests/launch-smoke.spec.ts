import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

const allowedAnalyticsEvents = new Set([
  "hero_cta_click",
  "newsletter_form_view",
  "newsletter_submit",
  "newsletter_success",
  "newsletter_error",
  "confirmation_success",
  "confirmation_error",
  "roadmap_section_view",
]);

const analyticsSourceFiles = [
  "src/app/page.tsx",
  "src/app/subscribe/confirm/page.tsx",
  "src/components/newsletter-signup-form.tsx",
];

function collectAnalyticsEvents(page: Page) {
  const events: unknown[] = [];

  page.on("request", (request) => {
    const url = request.url();

    if (!url.includes("/_vercel/insights")) {
      return;
    }

    const payload = request.postDataJSON();

    if (payload) {
      events.push(payload);
    }
  });

  return events;
}

function flatten(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => flatten(item));
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap((item) => flatten(item));
  }

  return [value];
}

async function extractAnalyticsEventNamesFromSource() {
  const eventNames = new Set<string>();

  for (const file of analyticsSourceFiles) {
    const source = await readFile(file, "utf8");

    for (const match of source.matchAll(/\btrack\(\s*["']([^"']+)["']/g)) {
      eventNames.add(match[1]);
    }

    for (const match of source.matchAll(/\beventName=["']([^"']+)["']/g)) {
      eventNames.add(match[1]);
    }
  }

  return [...eventNames].sort();
}

test.describe("launch smoke", () => {
  test("uses only approved custom analytics event names", async () => {
    const eventNames = await extractAnalyticsEventNamesFromSource();
    const unknownEventNames = eventNames.filter(
      (eventName) => !allowedAnalyticsEvents.has(eventName),
    );

    expect(unknownEventNames).toEqual([]);
    expect(eventNames).toEqual(expect.arrayContaining([...allowedAnalyticsEvents]));
  });

  test("renders the homepage and submits the newsletter form without leaking email to analytics", async ({
    page,
  }) => {
    const analyticsEvents = collectAnalyticsEvents(page);
    const submitRequests: unknown[] = [];

    await page.route("**/api/subscribe", async (route) => {
      const request = route.request();
      submitRequests.push(request.postDataJSON());

      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({ ok: true, message: "Confirmation email sent." }),
      });
    });

    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Build the kart\./i }),
    ).toBeVisible();
    await expect(page.getByText("Race the habitat.")).toBeVisible();
    await expect(page.getByText("Earn your place.")).toBeVisible();
    await expect(page.getByText("A RaidGuild Forge project")).toBeVisible();

    await page.getByRole("link", { name: /Get Demo Updates/i }).click();
    await expect(page.locator("#updates")).toBeInViewport();

    await page.getByLabel("Email address").fill("pilot@example.com");
    await page.getByRole("button", { name: /Get Demo Updates/i }).click();
    await expect(page.getByText(/Check your inbox/i)).toBeVisible();

    expect(submitRequests).toEqual([{ email: "pilot@example.com" }]);

    for (const event of analyticsEvents) {
      const values = flatten(event);

      expect(values).not.toContain("pilot@example.com");
    }
  });

  test("renders confirmation result states with home CTA", async ({ page }) => {
    await page.goto("/subscribe/confirm?result=success");
    await expect(
      page.getByRole("heading", { name: /You are on the signal/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /Return Home/i })).toHaveAttribute(
      "href",
      "/",
    );

    await page.goto("/subscribe/confirm?result=error");
    await expect(
      page.getByRole("heading", { name: /Confirmation link expired/i }),
    ).toBeVisible();

    await page.goto("/subscribe/confirm?result=unavailable");
    await expect(
      page.getByRole("heading", { name: /Signal temporarily unavailable/i }),
    ).toBeVisible();
  });

  test("serves launch metadata endpoints", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.ok()).toBe(true);

    await expect(page).toHaveTitle("Titan Racers");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /Build the kart\. Race the habitat\. Earn your place/,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /opengraph-image/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );

    await expect(await page.request.get("/robots.txt")).toBeOK();
    await expect(await page.request.get("/sitemap.xml")).toBeOK();
    await expect(await page.request.get("/opengraph-image")).toBeOK();
    await expect(await page.request.get("/twitter-image")).toBeOK();
    await expect(await page.request.get("/icon.svg")).toBeOK();
  });
});
