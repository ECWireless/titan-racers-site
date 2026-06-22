import Image from "next/image";
import Link from "next/link";

import { TrackClick, TrackSectionView } from "@/components/analytics-events";
import { NewsletterSignupForm } from "@/components/newsletter-signup-form";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

const playerPaths = [
  {
    title: "Racers",
    text: "Win races, learn the hidden routes, and make machines famous through results.",
  },
  {
    title: "Assemblers",
    text: "Combine components into competitive kart designs, patent the best builds, and license them to drivers.",
  },
  {
    title: "Engineers",
    text: "Create useful components that shape how machines handle, survive, and earn royalties when other players use them.",
  },
];

const roadmap = [
  {
    date: "Q3 2026",
    title: "First Playable Demo",
    text: "Small RC karts, simple handling, habitat-scale courses, and the first hint of modular builds.",
  },
  {
    date: "Q4 2026",
    title: "Creator Loop MVP",
    text: "Kart assembly, component performance differences, player catalogues, licensing, royalties, and creator profiles.",
  },
  {
    date: "Early 2027",
    title: "Expanded World & Kit Experiments",
    text: "Richer courses, deeper physics, advanced components, and first experiments with real-world electronics kits.",
  },
];

const siteUrl = "https://titanracers.com";
const siteDescription =
  "Build the kart. Race the habitat. Earn your place in a sci-fi RC racing game set inside humanity's last Titan colony.";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "RaidGuild Forge",
      url: "https://forge.raidguild.org",
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Titan Racers",
      url: siteUrl,
      description: siteDescription,
      inLanguage: "en-US",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "VideoGame",
      "@id": `${siteUrl}/#game`,
      name: "Titan Racers",
      url: siteUrl,
      image: `${siteUrl}/opengraph-image`,
      description: siteDescription,
      applicationCategory: "Game",
      gamePlatform: "Web browser",
      genre: ["Racing", "Science fiction", "Kart racing"],
      inLanguage: "en-US",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-titan-black text-titan-ice">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <RevealOnScroll />
      <Hero />
      <WhatItIs />
      <CoreLoop />
      <PlayerPaths />
      <World />
      <Machines />
      <Roadmap />
      <Signup />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[94svh] overflow-hidden">
      <Image
        priority
        src="/images/titan-racers-training-bay.png"
        alt="An RC kart on a polished training bay floor inside a vast orbital habitat facility."
        fill
        sizes="100vw"
        className="hero-drift object-cover object-[62%_50%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,6,0.94)_0%,rgba(7,7,6,0.76)_37%,rgba(7,7,6,0.1)_78%),linear-gradient(0deg,rgba(7,7,6,0.95)_0%,rgba(7,7,6,0)_42%)]" />
      <div className="relative z-10 mx-auto flex min-h-[94svh] w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-12">
        <header className="motion-rise flex items-center justify-between gap-6">
          <Link
            className="titan-wordmark"
            href="/"
            aria-label="Titan Racers home"
          >
            <Image
              src="/titan-racers-logo.png"
              alt="Titan Racers"
              width={300}
              height={60}
              priority
              className="h-12 w-auto sm:h-14"
            />
          </Link>
          <a
            className="max-w-36 text-right font-mono text-[0.63rem] uppercase leading-4 tracking-[0.16em] text-titan-ice/66 transition hover:text-titan-ice sm:max-w-none sm:text-xs sm:tracking-[0.18em]"
            href="https://forge.raidguild.org"
            rel="noreferrer"
            target="_blank"
          >
            A RaidGuild Forge project
          </a>
        </header>

        <div className="flex flex-1 items-center py-16">
          <div className="max-w-6xl">
            <p className="motion-rise motion-delay-1 mb-5 font-mono text-sm uppercase tracking-[0.24em] text-titan-hazard">
              First playable demo in development
            </p>
            <h1 className="max-w-6xl text-4xl font-black uppercase leading-[1.04] text-balance sm:text-5xl lg:text-6xl xl:text-7xl">
              <span className="motion-rise motion-delay-2 block">
                Build the kart.
              </span>
              <span className="motion-rise motion-delay-3 block">
                Race the habitat.
              </span>
              <span className="motion-rise motion-delay-4 block">
                Earn your place.
              </span>
            </h1>
            <p className="motion-rise motion-delay-5 mt-8 max-w-2xl text-lg leading-8 text-titan-ice/82 sm:text-xl">
              A sci-fi RC kart racing game set inside humanity&apos;s last Titan
              colony, where every machine has a builder, every race builds
              reputation, and the best designs can become real-world kits.
            </p>
            <div className="motion-rise motion-delay-6 mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <TrackClick
                className="inline-flex min-h-12 items-center justify-center border border-titan-orange bg-titan-orange px-6 font-mono text-sm font-bold uppercase tracking-[0.16em] text-titan-black transition hover:bg-titan-hazard"
                eventName="hero_cta_click"
                href="#updates"
                properties={{ location: "hero" }}
              >
                Get Demo Updates
              </TrackClick>
              <a
                className="inline-flex min-h-12 items-center justify-center border border-titan-ice/24 px-6 font-mono text-sm uppercase tracking-[0.16em] text-titan-ice/78 transition hover:border-titan-ice/54 hover:text-titan-ice"
                href="#world"
              >
                Enter the Habitat
              </a>
            </div>
          </div>
        </div>

        <div className="motion-rise motion-delay-6 grid gap-3 border-y border-titan-ice/14 py-5 sm:grid-cols-3">
          {["Race", "Assemble", "Engineer"].map((path) => (
            <div key={path} className="flex items-center gap-3">
              <span className="h-2 w-8 bg-titan-orange" />
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-titan-ice/74">
                {path}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatItIs() {
  return (
    <section className="bg-titan-ice px-5 py-20 text-titan-black sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="scroll-reveal" data-reveal>
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-rust">
            What Titan Racers is
          </p>
          <h2 className="mt-5 max-w-4xl text-4xl font-black uppercase leading-none sm:text-5xl xl:text-6xl">
            <span className="block">Small machines.</span>
            <span className="block">Giant habitat.</span>
            <span className="block">Winning designs.</span>
          </h2>
        </div>
        <div
          className="scroll-reveal space-y-5 text-lg leading-8 text-titan-black/72"
          data-reveal
        >
          <p>
            Players assemble small remotely controlled karts from modular
            components, then race them through unauthorized courses inside the
            colony&apos;s orbital habitat.
          </p>
          <p>
            The game is not only about who drives fastest. It is about who built
            the winning machine, what parts made it possible, and why other
            racers want access to that design.
          </p>
        </div>
      </div>
    </section>
  );
}

function CoreLoop() {
  const steps = [
    ["Build", "Choose components, tune the kart, and make tradeoffs."],
    ["Race", "Thread tight courses through farms, corridors, and simulators."],
    ["Earn", "Collect money, reputation, licensing demand, and access."],
    ["Improve", "Upgrade the machine, refine the design, and prove it again."],
  ];

  return (
    <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="scroll-reveal max-w-3xl" data-reveal>
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-orange">
            How the game works
          </p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-none text-balance sm:text-6xl">
            Build, race, earn, improve.
          </h2>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {steps.map(([title, text], index) => (
            <article
              key={title}
              className="lift-card scroll-reveal border border-titan-ice/14 bg-titan-panel p-6"
              data-reveal
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-titan-hazard">
                0{index + 1}
              </p>
              <h3 className="mt-8 text-2xl font-black uppercase">{title}</h3>
              <p className="mt-4 leading-7 text-titan-ice/68">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PlayerPaths() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div
          className="media-frame scroll-reveal relative aspect-[4/3] min-h-80 overflow-hidden border border-titan-ice/12 bg-titan-panel"
          data-reveal
        >
          <Image
            src="/images/titan-racers-kart-workbench.png"
            alt="An RC racing kart assembled from exposed electronics, suspension, batteries, and hardware."
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="media-drift object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(7,7,6,0.54),transparent_58%)]" />
        </div>

        <div className="scroll-reveal" data-reveal>
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-orange">
            Player paths
          </p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-none text-balance sm:text-6xl">
            Race, assemble, engineer, or do all three.
          </h2>
          <div className="mt-10 space-y-5">
            {playerPaths.map((path) => (
              <article
                key={path.title}
                className="lift-row border-t border-titan-ice/14 pt-5"
              >
                <h3 className="font-mono text-sm uppercase tracking-[0.22em] text-titan-hazard">
                  {path.title}
                </h3>
                <p className="mt-2 text-lg leading-8 text-titan-ice/72">
                  {path.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function World() {
  return (
    <section
      id="world"
      className="bg-titan-ice px-5 py-20 text-titan-black sm:px-8 lg:px-12 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="scroll-reveal" data-reveal>
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-rust">
              The whole colony is the track
            </p>
            <h2 className="mt-5 text-4xl font-black uppercase leading-none text-balance sm:text-6xl">
              Unauthorized races inside humanity&apos;s last Titan colony.
            </h2>
            <p className="mt-6 text-lg leading-8 text-titan-black/72">
              Between official trials, young racers cut courses through
              maintenance corridors, farms, training facilities, storage bays,
              and gravity simulators. Each race is practice for something much
              bigger: earning a place near the surface crews that keep the
              colony alive.
            </p>
          </div>
          <div
            className="media-frame scroll-reveal relative aspect-[16/9] overflow-hidden border border-titan-black/12 bg-titan-black"
            data-reveal
          >
            <Image
              src="/images/titan-racers-habitat.png"
              alt="A vast green O'Neill cylinder habitat where RC karts race through agricultural terrain."
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="media-drift object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Machines() {
  return (
    <section className="px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div
          className="media-frame scroll-reveal relative aspect-[16/9] overflow-hidden border border-titan-ice/12 bg-titan-panel"
          data-reveal
        >
          <Image
            src="/images/titan-racers-catalogue.png"
            alt="A sci-fi catalogue interface listing racing karts with license prices and royalty splits."
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="media-drift object-cover"
          />
        </div>
        <div className="scroll-reveal" data-reveal>
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-orange">
            Machines with history
          </p>
          <h2 className="mt-5 text-4xl font-black uppercase leading-none text-balance sm:text-6xl">
            Every kart has a builder. Every win has a history.
          </h2>
          <p className="mt-6 text-lg leading-8 text-titan-ice/72">
            Designs become valuable when they are proven. Assemblers can list
            competitive builds, racers can license the right machine for the
            course, and engineers can earn royalties when their components
            become part of successful designs.
          </p>
          <p className="mt-5 text-lg leading-8 text-titan-ice/72">
            Because the karts are imagined around accessible, buildable
            components, the most famous machines can eventually move beyond the
            screen as real-world electronics kit experiments.
          </p>
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section className="relative px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <TrackSectionView
        eventName="roadmap_section_view"
        properties={{ section: "roadmap" }}
      />
      <div className="absolute inset-0">
        <Image
          src="/images/titan-racers-training-bay.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,6,0.96),rgba(7,7,6,0.84)),linear-gradient(0deg,rgba(7,7,6,0.96),rgba(7,7,6,0.45),rgba(7,7,6,0.96))]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="scroll-reveal max-w-3xl" data-reveal>
          <h2 className="text-4xl font-black uppercase leading-none text-balance sm:text-6xl">
            Roadmap.
          </h2>
        </div>

        <div className="roadmap-track relative mt-12" data-reveal>
          <div className="roadmap-connector absolute left-[15px] top-4 bottom-4 w-px bg-titan-ice/18 lg:left-0 lg:right-0 lg:top-[15px] lg:bottom-auto lg:h-px lg:w-auto" />
          <div className="grid gap-10 lg:grid-cols-3 lg:gap-6">
            {roadmap.map((item, index) => (
              <article
                key={item.date}
                className="scroll-reveal relative pl-14 lg:pl-0 lg:pt-14"
                data-reveal
              >
                <div className="roadmap-node absolute left-0 top-1 flex h-8 w-8 items-center justify-center border border-titan-orange bg-titan-black lg:top-0">
                  <span className="h-2.5 w-2.5 bg-titan-orange" />
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-titan-hazard">
                  {item.date}
                </p>
                <h3 className="mt-5 text-2xl font-black uppercase">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-md leading-7 text-titan-ice/70">
                  {item.text}
                </p>
                <p className="mt-8 hidden font-mono text-xs uppercase tracking-[0.18em] text-titan-ice/32 lg:block">
                  Milestone 0{index + 1}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Signup() {
  return (
    <section
      id="updates"
      className="bg-titan-ice px-5 py-20 text-titan-black sm:px-8 lg:px-12 lg:py-24"
    >
      <div
        className="scroll-reveal mx-auto max-w-7xl border-y border-titan-black/14 py-12"
        data-reveal
      >
        <div className="max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-rust">
            Join the early signal
          </p>
          <h2 className="mt-4 text-4xl font-black uppercase leading-none text-balance sm:text-5xl">
            Get demo drops, build notes, and early racer updates from inside the
            habitat.
          </h2>
          <NewsletterSignupForm />
        </div>
      </div>
    </section>
  );
}
