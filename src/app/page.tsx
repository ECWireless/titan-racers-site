import Image from "next/image";
import Link from "next/link";

import { TrackClick, TrackSectionView } from "@/components/analytics-events";
import { RevealOnScroll } from "@/components/reveal-on-scroll";

const demoUrl = "https://play.titanracers.com";

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
    out: true,
  },
  {
    date: "Q4 2026",
    title: "Creator Loop MVP",
    text: "Kart assembly, component performance differences, player catalogues, licensing, royalties, and creator profiles.",
    out: false,
  },
  {
    date: "Early 2027",
    title: "Expanded World & Kit Experiments",
    text: "Richer courses, deeper physics, advanced components, and first experiments with real-world electronics kits.",
    out: false,
  },
];

const siteUrl = "https://titanracers.com";
const siteDescription =
  "Build the kart. Race the habitat. Earn your place in a sci-fi RC racing game set inside humanity's last Titan colony.";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Titan Racers",
      url: siteUrl,
      description: siteDescription,
      inLanguage: "en-US",
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
    },
  ],
};

// Floodlit: true black divided by thin rules and heavy uppercase headlines,
// with the site's orange and amber accents.
const EYEBROW =
  "font-mono text-sm uppercase tracking-[0.24em] text-titan-orange";
const HEADLINE =
  "font-bold uppercase leading-[0.95] tracking-[-0.01em] text-balance";
const SECTION = "border-t border-titan-ice/12 px-5 py-20 sm:px-8 lg:px-12 lg:py-28";
const PLAY_BUTTON =
  "inline-flex min-h-12 items-center justify-center border border-titan-orange bg-titan-orange px-6 font-mono text-sm font-bold uppercase tracking-[0.16em] text-titan-black transition hover:border-titan-hazard hover:bg-titan-hazard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-titan-hazard";

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
      <PlayDemo />
    </main>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[94svh] overflow-hidden">
      <Image
        priority
        src="/images/falls-view-park-habitat.webp"
        alt="Falls View Park at dusk, seen from above: a floodlit kart track in the foreground, with the habitat's latticed walls curving up on both sides toward a bright window overhead."
        fill
        sizes="100vw"
        className="hero-drift object-cover object-[64%_50%]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,7,6,0.96)_0%,rgba(7,7,6,0.8)_34%,rgba(7,7,6,0.1)_74%),linear-gradient(0deg,rgba(7,7,6,1)_0%,rgba(7,7,6,0)_40%)]" />
      {/* Narrow screens put the text over the bright window and haze. */}
      <div className="absolute inset-0 bg-titan-black/60 lg:hidden" />
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
        </header>

        <div className="flex flex-1 items-center py-16">
          <div className="max-w-6xl">
            <p className="motion-rise motion-delay-1 mb-5 font-mono text-sm uppercase tracking-[0.24em] text-titan-hazard">
              The first demo is out
            </p>
            <h1
              className={`max-w-6xl text-4xl sm:text-6xl lg:text-7xl xl:text-8xl ${HEADLINE}`}
            >
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
                className={PLAY_BUTTON}
                eventName="play_demo_click"
                href={demoUrl}
                properties={{ location: "hero" }}
              >
                Play the demo
              </TrackClick>
              <a
                className="inline-flex min-h-12 items-center justify-center border border-titan-ice/50 px-6 font-mono text-sm uppercase tracking-[0.16em] text-titan-ice transition hover:border-titan-hazard hover:text-titan-hazard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-titan-hazard"
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
    // The hero's strip already ends in a rule.
    <section className={SECTION.replace("border-t border-titan-ice/12 ", "")}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="scroll-reveal" data-reveal>
          <p className={EYEBROW}>What Titan Racers is</p>
          <h2
            className={`mt-5 max-w-4xl text-4xl sm:text-5xl xl:text-6xl ${HEADLINE}`}
          >
            <span className="block">Small machines.</span>
            <span className="block">Giant habitat.</span>
            <span className="block">Winning designs.</span>
          </h2>
        </div>
        <div
          className="scroll-reveal space-y-5 text-lg leading-8 text-titan-ice/72"
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
    <section className={SECTION}>
      <div className="mx-auto max-w-7xl">
        <div className="scroll-reveal max-w-3xl" data-reveal>
          <p className={EYEBROW}>How the game works</p>
          <h2 className={`mt-5 text-4xl sm:text-6xl ${HEADLINE}`}>
            Build, race, earn, improve.
          </h2>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-10 md:grid-cols-4">
          {steps.map(([title, text], index) => (
            <article
              key={title}
              className="lift-row scroll-reveal border-t border-titan-ice/24 pt-6"
              data-reveal
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-titan-hazard">
                0{index + 1}
              </p>
              <h3 className="mt-6 text-2xl font-bold uppercase">{title}</h3>
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
    <section className={SECTION}>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div
          className="media-frame scroll-reveal relative aspect-[16/9] overflow-hidden border border-titan-ice/12 bg-titan-black"
          data-reveal
        >
          <Image
            src="/images/kart-editor.webp"
            alt="The kart editor: the Balanced Kart's chassis, suspension, and electronics in 3D, with its parts list and derived handling stats beside it."
            fill
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="media-drift object-cover"
          />
        </div>

        <div className="scroll-reveal" data-reveal>
          <p className={EYEBROW}>Player paths</p>
          <h2 className={`mt-5 text-4xl sm:text-6xl ${HEADLINE}`}>
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
    <section id="world" className={SECTION}>
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="scroll-reveal" data-reveal>
            <p className={EYEBROW}>The whole colony is the track</p>
            <h2 className={`mt-5 text-4xl sm:text-6xl ${HEADLINE}`}>
              Unauthorized races inside humanity&apos;s last Titan colony.
            </h2>
            <p className="mt-6 text-lg leading-8 text-titan-ice/72">
              Between official trials, young racers cut courses through
              maintenance corridors, farms, training facilities, storage bays,
              and gravity simulators. Each race is practice for something much
              bigger: earning a place near the surface crews that keep the
              colony alive.
            </p>
          </div>
          <div
            className="media-frame scroll-reveal relative aspect-[16/9] overflow-hidden border border-titan-ice/12 bg-titan-black"
            data-reveal
          >
            <Image
              src="/images/island-three.webp"
              alt="Island Three, the colony's rotating habitat, in orbit with Saturn beyond."
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
    <section className={SECTION}>
      <div className="mx-auto grid max-w-7xl gap-10">
        <div
          className="media-frame scroll-reveal relative aspect-[3000/680] overflow-hidden border border-titan-ice/12 bg-titan-black"
          data-reveal
        >
          <Image
            src="/images/official-karts.webp"
            alt="The three official karts side by side: Speed in red, Balanced in blue, and Handling in green."
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="media-drift object-cover"
          />
        </div>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="scroll-reveal" data-reveal>
            <p className={EYEBROW}>Machines with history</p>
            <h2 className={`mt-5 text-4xl sm:text-6xl ${HEADLINE}`}>
              Every kart has a builder. Every win has a history.
            </h2>
          </div>
          <div className="scroll-reveal lg:pt-10" data-reveal>
            <p className="text-lg leading-8 text-titan-ice/72">
              Designs become valuable when they are proven. Assemblers can list
              competitive builds, racers can license the right machine for the
              course, and engineers can earn royalties when their components
              become part of successful designs.
            </p>
            <p className="mt-5 text-lg leading-8 text-titan-ice/72">
              Because the karts are imagined around accessible, buildable
              components, the most famous machines can eventually move beyond
              the screen as real-world electronics kit experiments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  return (
    <section className={`relative ${SECTION}`}>
      <TrackSectionView
        eventName="roadmap_section_view"
        properties={{ section: "roadmap" }}
      />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="scroll-reveal max-w-3xl" data-reveal>
          <h2 className={`text-4xl sm:text-6xl ${HEADLINE}`}>Roadmap.</h2>
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
                <p className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-titan-hazard">
                  {item.date}
                  {item.out ? (
                    <span className="border border-titan-hazard/60 px-1.5 py-0.5 text-[0.62rem] font-bold tracking-[0.14em] text-titan-hazard">
                      Out now
                    </span>
                  ) : null}
                </p>
                <h3 className="mt-5 text-2xl font-bold uppercase">
                  {item.title}
                </h3>
                <p className="mt-4 max-w-md leading-7 text-titan-ice/70">
                  {item.text}
                </p>
                <p className="mt-8 hidden font-mono text-xs uppercase tracking-[0.18em] text-titan-ice/50 lg:block">
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

function PlayDemo() {
  return (
    <section id="play" className={SECTION}>
      <div className="scroll-reveal mx-auto max-w-7xl" data-reveal>
        <div className="max-w-3xl">
          <p className={EYEBROW}>Falls View Park is open</p>
          <h2 className={`mt-4 text-4xl sm:text-6xl ${HEADLINE}`}>
            Race the first course in your browser.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-titan-ice/72">
            No download. Pick an official kart, race the clock and the ghosts
            on the leaderboard, or open a private room for up to four.
          </p>
          <TrackClick
            className={`mt-10 ${PLAY_BUTTON}`}
            eventName="play_demo_click"
            href={demoUrl}
            properties={{ location: "closing" }}
          >
            Play the demo
          </TrackClick>
        </div>
      </div>
    </section>
  );
}
