import type { Metadata } from "next";
import Link from "next/link";

import { confirmFromForm } from "@/app/updates/actions";
import { TrackOnMount } from "@/components/analytics-events";
import { NoticePage, noticeButtonClass } from "@/components/notice-page";

export const metadata: Metadata = {
  title: "Confirm your email",
  robots: { index: false, follow: false },
};

type ConfirmPageProps = {
  searchParams: Promise<{ result?: string; token?: string }>;
};

const results = {
  success: {
    title: "You're on the list.",
    body: "We'll email you when there's something new to race.",
  },
  expired: {
    title: "This link has expired.",
    body: "Sign up again on the home page for a fresh one.",
  },
  unavailable: {
    title: "Something went wrong.",
    body: "Keep the email and try its link again in a few minutes.",
  },
} as const;

type ConfirmResult = keyof typeof results;

function isResult(value: string | undefined): value is ConfirmResult {
  return value !== undefined && Object.hasOwn(results, value);
}

export default async function ConfirmPage({ searchParams }: ConfirmPageProps) {
  const { result, token } = await searchParams;

  if (isResult(result)) {
    return (
      <NoticePage eyebrow="Titan Racers updates" title={results[result].title}>
        <TrackOnMount eventName="updates_confirm" properties={{ result }} />
        <p>{results[result].body}</p>
        <Link className={`mt-10 ${noticeButtonClass}`} href="/">
          Return home
        </Link>
      </NoticePage>
    );
  }

  if (token) {
    // A button rather than confirming on load, because email security
    // scanners open links, some of them in full browsers.
    return (
      <NoticePage eyebrow="Titan Racers updates" title="Confirm your email.">
        <p>Confirm to start getting Titan Racers updates.</p>
        <form action={confirmFromForm} className="mt-10">
          <input type="hidden" name="token" value={token} />
          <button className={noticeButtonClass} type="submit">
            Confirm
          </button>
        </form>
      </NoticePage>
    );
  }

  return (
    <NoticePage eyebrow="Titan Racers updates" title="Check your inbox.">
      <p>Use the link in the email to finish signing up.</p>
      <Link className={`mt-10 ${noticeButtonClass}`} href="/">
        Return home
      </Link>
    </NoticePage>
  );
}
