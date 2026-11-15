# Titan Racers Site

Public website for `titanracers.com`. Its calls to action send players to the
demo at `https://play.titanracers.com`.

## Updates list

The signup form stores addresses in Postgres and sends confirmation emails
through SendGrid. Copy `.env.example` to `.env`. Locally, `DATABASE_URL` can
point at a database in the game's Postgres container:

```bash
docker exec titan-racers-postgres-1 psql -U postgres -c "create database titan_racers_site"
pnpm db:migrate
```

Without `SENDGRID_API_KEY`, development prints the confirm and unsubscribe
links to the server console instead of emailing them.

In production, Vercel runs `pnpm db:migrate && pnpm build`. Migrations apply
once each (tracked in `schema_migrations`) and are skipped on preview builds.
Production needs `DATABASE_URL` (and `DATABASE_URL_UNPOOLED` for
migrations, which Neon's Vercel integration adds), `SENDGRID_API_KEY`,
`SENDGRID_FROM_EMAIL`, `SENDGRID_FROM_NAME`, `SITE_URL`, `IP_HASH_SECRET`, and
optionally `ADMIN_NOTIFY_EMAIL`. Scope the database and SendGrid variables to
Production only, so preview deployments never write to the real list or send
real email; signup on a preview then answers "Something went wrong".

The DB-backed checks in `tests/updates-list.spec.ts` run only when
`DATABASE_URL` points at a local database:

```bash
set -a && . ./.env && set +a && pnpm qa:smoke
```

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
