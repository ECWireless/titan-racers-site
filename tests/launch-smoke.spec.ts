import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const demoUrl = "https://play.titanracers.com";

const allowedAnalyticsEvents = new Set([
  "play_demo_click",
  "roadmap_section_view",
]);

const analyticsSourceFiles = ["src/app/page.tsx"];

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
    expect(eventNames).toEqual(
      expect.arrayContaining([...allowedAnalyticsEvents]),
    );
  });

  test("renders the homepage and sends players to the demo", async ({
    page,
  }) => {
    // The demo itself isn't part of this site's check.
    await page.route(`${demoUrl}/**`, (route) =>
      route.fulfill({ body: "<title>Demo</title>", contentType: "text/html" }),
    );
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /Build the kart\./i }),
    ).toBeVisible();
    await expect(page.getByText("Race the habitat.")).toBeVisible();
    await expect(page.getByText("Earn your place.")).toBeVisible();
    await expect(page.getByText("The first demo is out")).toBeVisible();
    await expect(page.getByText("Out now")).toBeAttached();
    await expect(page.getByText(/RaidGuild|Forge/)).toHaveCount(0);
    expect(await page.content()).not.toMatch(/RaidGuild|forge\.raidguild/i);

    const playLinks = page.getByRole("link", { name: "Play the demo" });
    await expect(playLinks).toHaveCount(2);
    for (const link of await playLinks.all()) {
      await expect(link).toHaveAttribute("href", demoUrl);
    }

    await playLinks.first().click();
    await expect(page).toHaveURL(new RegExp(`^${demoUrl}`));
  });

  test("sends old signup confirmation links home", async ({ page }) => {
    await page.goto("/subscribe/confirm?result=success");
    await expect
      .poll(() => new URL(page.url()).pathname)
      .toBe("/");
    await expect(
      page.getByRole("heading", { name: /Build the kart\./i }),
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
