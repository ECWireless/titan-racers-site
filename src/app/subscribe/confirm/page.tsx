import Link from "next/link";

import { TrackOnMount } from "@/components/analytics-events";
import { AutoConfirmSubscription } from "@/components/auto-confirm-subscription";

type ConfirmPageProps = {
  searchParams: Promise<{
    result?: string;
    token?: string;
  }>;
};

export default async function ConfirmSubscribePage({
  searchParams,
}: ConfirmPageProps) {
  const { result, token } = await searchParams;
  const confirmed = result === "success";
  const failed = result === "error";
  const unavailable = result === "unavailable";
  const isChecking = !confirmed && !failed && !unavailable && Boolean(token);

  return (
    <main className="min-h-screen bg-titan-black px-5 py-20 text-titan-ice sm:px-8 lg:px-12">
      {confirmed ? <TrackOnMount eventName="confirmation_success" /> : null}
      {failed || unavailable ? (
        <TrackOnMount
          eventName="confirmation_error"
          properties={{ reason: unavailable ? "unavailable" : "expired" }}
        />
      ) : null}
      {isChecking && token ? <AutoConfirmSubscription token={token} /> : null}
      <section className="mx-auto flex min-h-[72vh] max-w-3xl flex-col justify-center">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-orange">
          Titan Racers updates
        </p>
        <h1 className="mt-5 text-4xl font-black uppercase leading-none text-balance sm:text-6xl">
          {confirmed
            ? "You are on the signal."
            : failed
              ? "Confirmation link expired."
              : unavailable
                ? "Signal temporarily unavailable."
              : isChecking
                ? "Confirming your signal."
                : "Check your inbox."}
        </h1>
        <p className="mt-6 text-lg leading-8 text-titan-ice/72">
          {confirmed
            ? "You are confirmed for Titan Racers demo drops, build notes, and early racer updates."
            : failed
              ? "This confirmation link is invalid or no longer active. You can request a fresh one from the Titan Racers site."
              : unavailable
                ? "The confirmation system is temporarily offline. Keep the email link and try again in a few minutes."
              : isChecking
                ? "One moment while we confirm your Titan Racers updates."
                : "Use the confirmation link in your email to finish joining Titan Racers updates."}
        </p>
        <div className="mt-10">
          <Link
            className="inline-flex min-h-12 items-center justify-center border border-titan-orange bg-titan-orange px-6 font-mono text-sm font-bold uppercase tracking-[0.16em] text-titan-black transition hover:bg-titan-hazard"
            href="/"
          >
            Return Home
          </Link>
        </div>
      </section>
    </main>
  );
}
