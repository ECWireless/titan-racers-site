"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { useActionState, useEffect } from "react";

import { signUpForUpdates, type SignupState } from "@/app/updates/actions";

const location = "closing";

const errorMessages = {
  invalid: "Enter a valid email address.",
  rate_limited: "Too many tries from here. Try again in a little while.",
  unavailable: "Something went wrong. Try again in a moment.",
} as const;

export function UpdatesSignupForm() {
  // A server action as the form's action, so the form still posts (never a
  // GET with the address in the URL) before or without JavaScript.
  const [state, formAction, isPending] = useActionState<SignupState, FormData>(
    signUpForUpdates,
    null,
  );
  const hasError = state?.status === "error";

  useEffect(() => {
    if (state?.status === "sent") {
      track("updates_signup", { location });
    } else if (state?.status === "error") {
      track("updates_signup_error", { location, reason: state.reason });
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="relative mt-8 max-w-2xl"
      onSubmit={(event) => {
        if (isPending) {
          event.preventDefault();
          return;
        }

        track("updates_signup_submit", { location });
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="updates-email">
          Email address
        </label>
        <input
          // Remounts with each answer, so an address that failed is put back.
          key={hasError ? `retry-${state.email}` : "fresh"}
          id="updates-email"
          aria-describedby="updates-message"
          aria-invalid={hasError && state.reason === "invalid" ? true : undefined}
          autoComplete="email"
          className="min-h-12 min-w-0 flex-1 border border-titan-ice/40 bg-transparent px-4 font-mono text-base text-titan-ice transition placeholder:text-titan-ice/40 hover:border-titan-ice/70 focus-visible:border-titan-hazard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-titan-hazard aria-[invalid=true]:border-titan-hazard"
          defaultValue={hasError ? state.email : ""}
          inputMode="email"
          maxLength={320}
          name="email"
          placeholder="you@example.com"
          readOnly={isPending}
          required
          type="email"
        />
        {/* Hidden from people; bots that fill it in are ignored. */}
        <div
          aria-hidden="true"
          className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden"
        >
          <label htmlFor="updates-website">Website</label>
          <input
            id="updates-website"
            autoComplete="off"
            name="website"
            tabIndex={-1}
            type="text"
          />
        </div>
        <button
          aria-disabled={isPending || undefined}
          className="inline-flex min-h-12 items-center justify-center border border-titan-ice/50 px-6 font-mono text-sm uppercase tracking-[0.16em] text-titan-ice transition hover:border-titan-hazard hover:text-titan-hazard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-titan-hazard aria-disabled:cursor-wait aria-disabled:opacity-60"
          type="submit"
        >
          {isPending ? "Sending" : "Get updates"}
        </button>
      </div>
      <p
        id="updates-message"
        aria-live="polite"
        className={`mt-4 min-h-7 text-base leading-7 ${
          hasError ? "text-titan-hazard" : "text-titan-ice/80"
        }`}
      >
        {state?.status === "sent"
          ? "Check your inbox and confirm your email to finish."
          : hasError
            ? errorMessages[state.reason]
            : null}
      </p>
      <p className="mt-2 font-mono text-xs uppercase tracking-[0.16em] text-titan-ice/50">
        Only Titan Racers news. Unsubscribe anytime.{" "}
        <span aria-hidden="true">·</span>{" "}
        <Link
          className="underline decoration-titan-ice/30 underline-offset-4 transition hover:text-titan-hazard hover:decoration-titan-hazard"
          href="/privacy"
        >
          Privacy
        </Link>
      </p>
    </form>
  );
}
