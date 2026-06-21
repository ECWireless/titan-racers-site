export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-titan-black text-titan-ice">
      <section className="relative flex min-h-screen items-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(255,122,24,0.22),transparent_32%),linear-gradient(135deg,rgba(255,122,24,0.12),transparent_42%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-titan-black to-transparent" />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-12">
          <header className="flex items-center justify-between gap-6">
            <p className="font-mono text-sm uppercase tracking-[0.24em] text-titan-orange">
              Titan Racers
            </p>
            <p className="hidden font-mono text-xs uppercase tracking-[0.18em] text-titan-ice/60 sm:block">
              A RaidGuild Forge project
            </p>
          </header>

          <div className="max-w-4xl">
            <p className="mb-5 font-mono text-sm uppercase tracking-[0.24em] text-titan-hazard">
              First playable demo in development
            </p>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.9] text-balance sm:text-7xl lg:text-8xl">
              Build the kart. Race the habitat. Earn the surface.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-titan-ice/78 sm:text-xl">
              A sci-fi RC kart racing game set inside humanity&apos;s last Titan
              colony, where every machine has a builder, every race builds
              reputation, and the best designs can become real-world kits.
            </p>
          </div>

          <div className="grid gap-4 border-y border-titan-ice/12 py-6 sm:grid-cols-3">
            {["Race", "Assemble", "Engineer"].map((path) => (
              <div key={path} className="flex items-center gap-3">
                <span className="h-2 w-8 bg-titan-orange" />
                <span className="font-mono text-sm uppercase tracking-[0.2em] text-titan-ice/70">
                  {path}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
