import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What the Titan Racers site collects and how to have it removed.",
  alternates: { canonical: "/privacy" },
};

const contactEmail = "elliott@coopallc.com";

const sections = [
  {
    title: "What we collect",
    body: [
      "If you sign up for updates, we keep your email address, when you signed up, and whether you've confirmed or unsubscribed. Nothing else: no name, no account, no tracking cookies.",
      "To stop the signup form being abused, we count signup attempts against a scrambled form of your IP address that can't be turned back into the address. Old counts are cleared out as new signups arrive.",
      "Site visits are counted with Vercel Web Analytics, which records pages viewed and button clicks without cookies and without identifying you.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "Only to send you Titan Racers news: new courses, features, and kit experiments. We don't sell, share, or rent your address.",
    ],
  },
  {
    title: "Who handles it",
    body: [
      "Neon stores the list, SendGrid sends the emails, and Vercel hosts the site. Each handles your data only to provide that service.",
    ],
  },
  {
    title: "Unsubscribing and deletion",
    body: [
      "Every email has an unsubscribe link. After you unsubscribe we keep your address marked as unsubscribed, so we never email you again by mistake.",
      `To have your address deleted entirely, or to ask what we hold, write to ${contactEmail}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-titan-black px-5 py-6 text-titan-ice sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Link className="titan-wordmark" href="/" aria-label="Titan Racers home">
          <Image
            src="/titan-racers-logo.png"
            alt="Titan Racers"
            width={300}
            height={60}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>
      </div>
      <article className="mx-auto max-w-3xl py-16 sm:py-24">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-orange">
          Privacy
        </p>
        <h1 className="mt-5 text-4xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-balance sm:text-6xl">
          Your email, and nothing else.
        </h1>
        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title} className="border-t border-titan-ice/12 pt-6">
              <h2 className="font-mono text-sm uppercase tracking-[0.22em] text-titan-hazard">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-lg leading-8 text-titan-ice/72">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.16em] text-titan-ice/50">
          Last updated November 2026
        </p>
      </article>
    </main>
  );
}
