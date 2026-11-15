import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function NoticePage({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
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
      <section className="mx-auto flex min-h-[72vh] max-w-3xl flex-col justify-center py-16">
        <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-orange">
          {eyebrow}
        </p>
        <h1 className="mt-5 text-4xl font-bold uppercase leading-[0.95] tracking-[-0.01em] text-balance sm:text-6xl">
          {title}
        </h1>
        <div className="mt-6 text-lg leading-8 text-titan-ice/72">{children}</div>
      </section>
    </main>
  );
}

export const noticeButtonClass =
  "inline-flex min-h-12 items-center justify-center border border-titan-ice/50 px-6 font-mono text-sm uppercase tracking-[0.16em] text-titan-ice transition hover:border-titan-hazard hover:text-titan-hazard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-titan-hazard";
