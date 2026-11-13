# Titan Racers Site

Public website for `titanracers.com`. Its calls to action send players to the
demo at `https://play.titanracers.com`.

The site needs no environment variables.

## QA

Run the launch checks before opening or merging a PR:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm qa:smoke
```

The Playwright smoke test runs desktop, tablet, and mobile Chromium checks
against the local Next server on port 3000. Set `PORT` to use another port
when 3000 is taken. The test stubs the demo, so it never loads
`play.titanracers.com`.

Install the managed browser once on a new machine:

```bash
pnpm exec playwright install chromium
```
