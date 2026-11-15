import type { Metadata } from "next";
import Link from "next/link";

import { NoticePage, noticeButtonClass } from "@/components/notice-page";
import { unsubscribeFromUpdates } from "@/app/updates/actions";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false, follow: false },
};

type UnsubscribePageProps = {
  searchParams: Promise<{ result?: string; token?: string }>;
};

const results = {
  success: {
    title: "You're unsubscribed.",
    body: "You won't get any more Titan Racers emails. You can sign up again anytime.",
  },
  expired: {
    title: "This link doesn't work anymore.",
    body: "It may be from an older email. Use the unsubscribe link in your latest Titan Racers email, or write to elliott@coopallc.com.",
  },
  unavailable: {
    title: "Something went wrong.",
    body: "Try the link again in a few minutes.",
  },
} as const;

type UnsubscribeResult = keyof typeof results;

function isResult(value: string | undefined): value is UnsubscribeResult {
  return value !== undefined && Object.hasOwn(results, value);
}

export default async function UnsubscribePage({
  searchParams,
}: UnsubscribePageProps) {
  const { result, token } = await searchParams;

  if (isResult(result)) {
    return (
      <NoticePage eyebrow="Titan Racers updates" title={results[result].title}>
        <p>{results[result].body}</p>
        <Link className={`mt-10 ${noticeButtonClass}`} href="/">
          Return home
        </Link>
      </NoticePage>
    );
  }

  if (!token) {
    return (
      <NoticePage eyebrow="Titan Racers updates" title="Unsubscribe.">
        <p>Use the unsubscribe link in any Titan Racers email.</p>
        <Link className={`mt-10 ${noticeButtonClass}`} href="/">
          Return home
        </Link>
      </NoticePage>
    );
  }

  // A button rather than the link itself, because email security scanners
  // open links and would otherwise unsubscribe people.
  return (
    <NoticePage eyebrow="Titan Racers updates" title="Stop Titan Racers emails?">
      <p>You won&apos;t get any more updates.</p>
      <form action={unsubscribeFromUpdates} className="mt-10">
        <input type="hidden" name="token" value={token} />
        <button className={noticeButtonClass} type="submit">
          Unsubscribe
        </button>
      </form>
    </NoticePage>
  );
}
