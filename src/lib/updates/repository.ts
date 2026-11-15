import { query } from "@/lib/updates/db";
import { createToken, hashToken } from "@/lib/updates/tokens";

export const attemptsPerIpPerHour = 10;

/**
 * Counts a signup attempt for a hashed IP address in the current hour and
 * reports whether it is within the limit. One statement, so concurrent
 * attempts can't both slip under it.
 */
export async function recordSignupAttempt(ipHash: string) {
  await query(
    "delete from signup_attempts where window_start < now() - interval '1 day'",
  );

  const rows = await query<{ attempts: number }>(
    `
      insert into signup_attempts (ip_hash, window_start, attempts)
      values ($1, date_trunc('hour', now()), 1)
      on conflict (ip_hash, window_start) do update
      set attempts = signup_attempts.attempts + 1
      returning attempts
    `,
    [ipHash],
  );

  return Number(rows[0]?.attempts ?? 0) <= attemptsPerIpPerHour;
}

/**
 * Adds or refreshes a subscriber and issues a confirmation, returning the
 * tokens for the email's links. Returns null when no email should go out: the
 * address is already confirmed, or was sent a confirmation in the last ten
 * minutes. The caller answers the same either way, so the form never reveals
 * who is on the list.
 *
 * The check and the claim are one statement: concurrent signups for the same
 * address queue on its row, and only the first gets tokens.
 */
export async function issueConfirmation({
  email,
  source,
}: {
  email: string;
  source: string;
}) {
  // The new unsubscribe token replaces the old one only for people who
  // aren't subscribed (unconfirmed or unsubscribed), whose old link has
  // nothing left to do.
  const unsubscribeToken = createToken();
  const claimed = await query<{ id: string }>(
    `
      insert into subscribers (
        email, unsubscribe_token_hash, source, confirmation_sent_at
      )
      values ($1, $2, $3, now())
      on conflict (email) do update
      set unsubscribe_token_hash = excluded.unsubscribe_token_hash,
          source = coalesce(subscribers.source, excluded.source),
          confirmation_sent_at = now(),
          updated_at = now()
      where not (
          subscribers.verified_at is not null
          and subscribers.unsubscribed_at is null
        )
        and (
          subscribers.confirmation_sent_at is null
          or subscribers.confirmation_sent_at < now() - interval '10 minutes'
        )
      returning id
    `,
    [email, hashToken(unsubscribeToken), source],
  );

  const subscriberId = claimed[0]?.id;

  if (!subscriberId) {
    return null;
  }

  // Earlier unconfirmed links stay valid until they expire on their own.
  const confirmToken = createToken();
  const confirmTokenHash = hashToken(confirmToken);

  await query(
    `
      insert into email_confirmations (subscriber_id, token_hash, expires_at)
      values ($1, $2, now() + interval '7 days')
    `,
    [subscriberId, confirmTokenHash],
  );

  return { confirmToken, confirmTokenHash, subscriberId, unsubscribeToken };
}

/**
 * Undoes a confirmation whose email failed to send, and lifts the cooldown so
 * a retry can go out straight away.
 */
export async function withdrawConfirmation({
  confirmTokenHash,
  subscriberId,
}: {
  confirmTokenHash: string;
  subscriberId: string;
}) {
  await query("delete from email_confirmations where token_hash = $1", [
    confirmTokenHash,
  ]);
  await query(
    "update subscribers set confirmation_sent_at = null where id = $1",
    [subscriberId],
  );
}

/**
 * Confirms the subscriber behind a confirmation token. A link that was
 * already used counts as success while the subscriber is still subscribed, so
 * a second click (or one after a mail scanner's) doesn't look expired.
 */
export async function confirmSubscriber(token: string) {
  const tokenHash = hashToken(token);
  const confirmed = await query<{ id: string }>(
    `
      with consumed as (
        update email_confirmations
        set confirmed_at = now()
        where token_hash = $1
          and confirmed_at is null
          and expires_at > now()
        returning subscriber_id
      )
      update subscribers
      set verified_at = coalesce(verified_at, now()),
          unsubscribed_at = null,
          updated_at = now()
      where id = (select subscriber_id from consumed)
      returning id
    `,
    [tokenHash],
  );

  if (confirmed.length > 0) {
    return true;
  }

  const alreadyConfirmed = await query<{ id: string }>(
    `
      select s.id
      from email_confirmations c
      join subscribers s on s.id = c.subscriber_id
      where c.token_hash = $1
        and c.confirmed_at is not null
        and s.verified_at is not null
        and s.unsubscribed_at is null
    `,
    [tokenHash],
  );

  return alreadyConfirmed.length > 0;
}

export async function unsubscribeSubscriber(token: string) {
  const rows = await query<{ id: string }>(
    `
      update subscribers
      set unsubscribed_at = coalesce(unsubscribed_at, now()),
          updated_at = now()
      where unsubscribe_token_hash = $1
      returning id
    `,
    [hashToken(token)],
  );

  return rows.length > 0;
}
