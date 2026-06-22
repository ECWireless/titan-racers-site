"use client";

import { track } from "@vercel/analytics";
import { useEffect, useRef, useState, type FormEvent } from "react";

type FormStatus = "idle" | "submitting" | "success" | "error";

const genericError =
  "Signal lost. Please check the address and try again in a moment.";

export function NewsletterSignupForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const formRef = useRef<HTMLFormElement | null>(null);
  const hasTrackedViewRef = useRef(false);

  useEffect(() => {
    const form = formRef.current;

    if (!form || hasTrackedViewRef.current) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      hasTrackedViewRef.current = true;
      track("newsletter_form_view", { location: "updates_section" });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasTrackedViewRef.current) {
          hasTrackedViewRef.current = true;
          track("newsletter_form_view", { location: "updates_section" });
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(form);

    return () => observer.disconnect();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage("");
    track("newsletter_submit", { location: "updates_section" });

    try {
      const response = await fetch("/api/subscribe", {
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      const body = (await response.json().catch(() => null)) as {
        error?: unknown;
      } | null;

      if (!response.ok) {
        const error =
          typeof body?.error === "string" && body.error ? body.error : genericError;

        setStatus("error");
        setMessage(error);
        track("newsletter_error", {
          location: "updates_section",
          status: response.status,
        });
        return;
      }

      setStatus("success");
      setMessage(
        "Check your inbox for the confirmation link. Once confirmed, you are on the Titan Racers signal.",
      );
      setEmail("");
      track("newsletter_success", { location: "updates_section" });
    } catch {
      setStatus("error");
      setMessage(genericError);
      track("newsletter_error", {
        location: "updates_section",
        status: "network",
      });
    }
  }

  return (
    <form className="mt-8 max-w-2xl" onSubmit={handleSubmit} ref={formRef}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          className="min-h-14 flex-1 border border-titan-black/20 bg-transparent px-4 font-mono text-sm uppercase tracking-[0.1em] text-titan-black outline-none transition placeholder:text-titan-black/42 focus:border-titan-rust"
          disabled={status === "submitting"}
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          placeholder="pilot@example.com"
          required
          type="email"
          value={email}
        />
        <button
          className="inline-flex min-h-14 items-center justify-center border border-titan-orange bg-titan-orange px-6 font-mono text-sm font-bold uppercase tracking-[0.16em] text-titan-black transition hover:bg-titan-hazard disabled:cursor-not-allowed disabled:border-titan-black/18 disabled:bg-titan-black/12 disabled:text-titan-black/42"
          disabled={status === "submitting"}
          type="submit"
        >
          {status === "submitting" ? "Sending" : "Get Demo Updates"}
        </button>
      </div>
      <p
        aria-live="polite"
        className={`mt-4 min-h-7 text-base leading-7 ${
          status === "error" ? "text-titan-rust" : "text-titan-black/68"
        }`}
      >
        {message}
      </p>
    </form>
  );
}
