import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";

const demoUrl = "https://play.titanracers.com";

const allowedAnalyticsEvents = new Set([
  "play_demo_click",
  "roadmap_section_view",
  "updates_cta_click",
  "updates_form_view",
  "updates_signup_submit",
  "updates_signup",
  "updates_signup_error",
  "updates_confirm",
]);

const analyticsSourceFiles = [
  "src/app/page.tsx",
  "src/components/updates-signup-form.tsx",
  "src/app/updates/confirm/page.tsx",
];

const updatesSourceFiles = ["src/components/updates-signup-form.tsx"];

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

  test("offers updates from the hero and the closing section", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByText("Enter the Habitat")).toHaveCount(0);
    const heroLink = page.getByRole("link", { name: "Get updates" });
    await expect(heroLink).toHaveAttribute("href", "#updates");

    await heroLink.click();
    const email = page.getByLabel("Email address");
    await expect(email).toBeInViewport();
    await expect(email).toHaveAttribute("type", "email");
    await expect(page.getByRole("button", { name: "Get updates" })).toBeVisible();
    // The bot trap stays out of sight and out of the tab order.
    await expect(page.locator('input[name="website"]')).not.toBeInViewport();
    await expect(page.locator('input[name="website"]')).toHaveAttribute(
      "tabindex",
      "-1",
    );
    await expect(page.getByRole("link", { name: "Privacy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  test("ignores bots and keeps addresses out of URLs and analytics", async ({
    page,
  }) => {
    // With Vercel's script blocked, tracked events wait in window.vaq, where
    // the test can read exactly what would be sent.
    await page.route("https://va.vercel-scripts.com/**", (route) =>
      route.fulfill({ body: "", contentType: "text/javascript" }),
    );
    const queuedEvents = () =>
      page.evaluate(() =>
        JSON.stringify((window as { vaq?: unknown[] }).vaq ?? []),
      );

    await page.goto("/");
    // The honeypot answers before touching the database.
    await page
      .locator('input[name="website"]')
      .evaluate((input: HTMLInputElement) => {
        input.value = "https://spam.example";
      });
    await page.getByLabel("Email address").fill("bot@example.com");
    await page.getByRole("button", { name: "Get updates" }).click();
    await expect(
      page.getByText("Check your inbox and confirm your email to finish."),
    ).toBeVisible();
    expect(page.url()).not.toContain("example.com");

    await expect.poll(queuedEvents).toContain('"updates_signup"');
    const events = await queuedEvents();
    expect(events).toContain('"updates_signup_submit"');
    expect(events).not.toContain("bot@example.com");

    for (const file of updatesSourceFiles) {
      expect(await readFile(file, "utf8")).not.toMatch(/track\([^)]*email/);
    }
  });

  test("posts the form without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    const methods: string[] = [];
    page.on("request", (request) => {
      if (request.isNavigationRequest()) methods.push(request.method());
    });

    await page.goto("/");
    await page
      .locator('input[name="website"]')
      .evaluate((input: HTMLInputElement) => {
        input.value = "https://spam.example";
      })
      .catch(() => {});
    await page.getByLabel("Email address").fill("nojs@example.com");
    await page.getByRole("button", { name: "Get updates" }).click();
    await page.waitForLoadState();

    expect(methods).toContain("POST");
    expect(page.url()).not.toContain("example.com");
    await context.close();
  });

  test("never confirms or unsubscribes on a link load alone", async ({
    page,
  }) => {
    const posts: string[] = [];
    page.on("request", (request) => {
      if (request.method() === "POST") posts.push(request.url());
    });

    await page.goto("/updates/confirm?token=example");
    await expect(
      page.getByRole("heading", { name: "Confirm your email." }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Confirm" })).toBeVisible();

    await page.goto("/updates/unsubscribe?token=example");
    await expect(page.getByRole("button", { name: "Unsubscribe" })).toBeVisible();

    await page.waitForTimeout(1000);
    expect(posts).toEqual([]);
  });

  test("shows the confirm, unsubscribe, and privacy pages", async ({ page }) => {
    await page.goto("/updates/confirm?result=constructor");
    await expect(
      page.getByRole("heading", { name: "Check your inbox." }),
    ).toBeVisible();

    await page.goto("/updates/confirm?result=success");
    await expect(
      page.getByRole("heading", { name: "You're on the list." }),
    ).toBeVisible();

    await page.goto("/updates/confirm?result=expired");
    await expect(
      page.getByRole("heading", { name: "This link has expired." }),
    ).toBeVisible();

    await page.goto("/updates/unsubscribe?token=example");
    await expect(
      page.getByRole("heading", { name: "Stop Titan Racers emails?" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "Unsubscribe" })).toBeVisible();

    await page.goto("/updates/unsubscribe?result=success");
    await expect(
      page.getByRole("heading", { name: "You're unsubscribed." }),
    ).toBeVisible();

    await page.goto("/privacy");
    await expect(
      page.getByRole("heading", { name: "Your email, and nothing else." }),
    ).toBeVisible();
    await expect(page.getByText(/elliott@coopallc\.com/)).toBeVisible();
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
