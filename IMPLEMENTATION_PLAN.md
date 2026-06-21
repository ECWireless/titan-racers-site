# Titan Racers Implementation Plan

This plan tracks PR-sized work for the Titan Racers public website at `titanracers.com`.

Maintenance note: Delete this file once all planned PRs are complete. It is a temporary coordination artifact, not permanent product documentation.

Working sequence:
- Implement Titan Racers PRs 1-3 first.
- Implement Forge PR 1 after Titan's scaffold, homepage, and Titan-owned subscribe flow are in place.
- Return to Titan Racers PR 4 for final QA and launch prep after the shared Forge subscription foundation is complete.

Debrief gate: Before starting implementation on any PR below, run a full debrief/sync with the user covering scope, copy/content, data model changes, analytics events, validation, and definition of done. Do not begin implementation for a PR until that sync is complete.

Review workflow: Use `docs/pr-review-workflow.md` when handling GitHub PR review feedback.


## PR 1: Site Scaffold + Agent Docs

Status: implemented locally

Scope:
- Scaffold the Titan Racers site in this repo.
- Add project-specific `AGENTS.md` guidance.
- Add Vercel Analytics plumbing.
- Establish base metadata, app shell, global styles, and responsive layout foundation.
- Keep the first implementation minimal enough to review as a foundation PR.

Definition of done:
- Local app runs.
- Base route renders.
- Vercel Analytics is included.
- `AGENTS.md` captures project canon, copy constraints, subscribe contract, and analytics events.
- Lint/type/build checks pass for the scaffold.

## PR 2: Homepage Narrative And Visual System

Status: implemented locally

Scope:
- Build the compressed homepage flow from the concept doc and deck.
- Use Titan Racers as the first-viewport brand with a small RaidGuild Forge attribution.
- Include hero, what-it-is, loop, player paths, world, machines-with-history, roadmap, and signup sections.
- Do not include crowdfunding copy.

Core copy decisions:
- Tagline: `Build the kart. Race the habitat. Earn the surface.`
- Supporting line: `A sci-fi RC kart racing game set inside humanity's last Titan colony, where every machine has a builder, every race builds reputation, and the best designs can become real-world kits.`
- Newsletter promise: `Get demo drops, build notes, and early racer updates from inside the habitat.`
- CTA: `Get Demo Updates`

Definition of done:
- Homepage is responsive on desktop, tablet, and mobile.
- The site feels game-first, not crowdfunding-first.
- Visual cadence is inspired by the deck without copying it exactly.
- `hero_cta_click` and `roadmap_section_view` are implemented where appropriate.

## PR 3: Titan-Specific Subscribe Flow

Status: implemented locally

Scope:
- Add email-only newsletter form.
- Add Titan-owned subscribe API and confirmation routes/copy using the shared subscription contract.
- Code against the planned shared Forge subscription contract, with final live database integration verified after Forge PR 1 lands.
- Build Titan-owned confirmation and result pages/copy.
- Track subscribe and confirmation events with Vercel Analytics.

Subscription contract:
- Project interest: `titan-racers`
- Broad Forge preferences: not visibly exposed on Titan; do not opt users into broad categories by default.
- Source: use a Titan-specific value such as `titan-racers-site` or `titanracers.com`.

Analytics events:
- `newsletter_form_view`
- `newsletter_submit`
- `newsletter_success`
- `newsletter_error`
- `confirmation_success`
- `confirmation_error`

Definition of done:
- Email submission is wired to the agreed shared contract through the deployed Forge subscribe API.
- Invalid email and failed states are clear and non-leaky.
- Confirmation links land on Titan Racers and confirm through the shared Forge token API without a second button click.
- No email or personal data is sent to analytics.

## PR 4: QA + Launch Prep

Status: planned

Scope:
- Add launch metadata, sitemap, robots, icons, and social preview data.
- Add Playwright browser QA as a dev dependency and install the managed Chromium browser through `pnpm exec playwright install chromium`.
- Verify browser rendering and responsiveness.
- Verify analytics event firing without personal data.
- Document required Vercel environment variables and shared database expectations.

Definition of done:
- Production build passes.
- Playwright smoke/visual checks run against the local site.
- Desktop/tablet/mobile QA notes are captured.
- Signup path is smoke-tested against the intended environment or a safe local equivalent.
- Launch checklist is complete.
