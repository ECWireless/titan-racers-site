import { expect, test } from "@playwright/test";

import { query } from "../src/lib/updates/db";
import {
  attemptsPerIpPerHour,
  confirmSubscriber,
  issueConfirmation,
  recordSignupAttempt,
  unsubscribeSubscriber,
} from "../src/lib/updates/repository";

// Runs the list's database logic directly. Only against a local database, so
// it can never touch the production list: export `.env` first.
const databaseUrl = process.env.DATABASE_URL ?? "";
const isLocalDatabase = /@(localhost|127\.0\.0\.1|\[::1\])[:/]/.test(databaseUrl);
const run = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

test.describe("updates list database", () => {
  test.skip(!isLocalDatabase, "needs DATABASE_URL pointing at a local database");
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "database checks run once");
  });

  test.afterAll(async () => {
    if (!isLocalDatabase) return;
    await query("delete from subscribers where email like $1", [`${run}%`]);
    await query("delete from signup_attempts where ip_hash like $1", [`${run}%`]);
  });

  test("double opt-in, repeat signups, and unsubscribing", async () => {
    const email = `${run}-a@example.com`;
    const source = "test";

    const first = await issueConfirmation({ email, source });
    expect(first).not.toBeNull();
    // Within ten minutes, nothing more goes out.
    expect(await issueConfirmation({ email, source })).toBeNull();

    expect(await confirmSubscriber(first!.confirmToken)).toBe(true);
    // A second click on a used link still reads as success.
    expect(await confirmSubscriber(first!.confirmToken)).toBe(true);
    expect(await confirmSubscriber("not-a-token")).toBe(false);

    // Confirmed: signing up again sends nothing, even after the cooldown.
    await query(
      "update subscribers set confirmation_sent_at = now() - interval '11 minutes' where email = $1",
      [email],
    );
    expect(await issueConfirmation({ email, source })).toBeNull();

    expect(await unsubscribeSubscriber(first!.unsubscribeToken)).toBe(true);
    // The used confirm link no longer reads as success once unsubscribed.
    expect(await confirmSubscriber(first!.confirmToken)).toBe(false);

    // After unsubscribing, signing up again sends a fresh confirmation.
    const again = await issueConfirmation({ email, source });
    expect(again).not.toBeNull();
    expect(await confirmSubscriber(again!.confirmToken)).toBe(true);
    const [row] = await query<{ subscribed: boolean; source: string }>(
      "select (verified_at is not null and unsubscribed_at is null) as subscribed, source from subscribers where email = $1",
      [email],
    );
    expect(row).toEqual({ subscribed: true, source });
  });

  test("concurrent signups for one address send one email", async () => {
    const email = `${run}-b@example.com`;
    const results = await Promise.all(
      Array.from({ length: 6 }, () => issueConfirmation({ email, source: "test" })),
    );
    expect(results.filter(Boolean)).toHaveLength(1);
  });

  test("concurrent attempts can't exceed the hourly IP limit", async () => {
    const ipHash = `${run}-ip`;
    const allowed = await Promise.all(
      Array.from({ length: attemptsPerIpPerHour + 5 }, () =>
        recordSignupAttempt(ipHash),
      ),
    );
    expect(allowed.filter(Boolean)).toHaveLength(attemptsPerIpPerHour);
  });
});
