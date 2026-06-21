# Titan Racers Site Agent Guide

This repo contains the public Titan Racers website for `titanracers.com`.

## Source Material

Use these source files as project canon before writing public copy or changing the site narrative:

- the Titan Racers game concept document supplied by the user
- the Titan Racers crowdfunding deck supplied by the user
- any PDF export of the same deck, when available

The deck is a narrative and visual source, not a section-by-section website blueprint. Do not copy the deck exactly.

## Positioning

Titan Racers is a creator-first sci-fi RC kart racing game set inside humanity's last Titan colony.

Primary homepage promise:

```text
Build the kart. Race the habitat. Earn the surface.
```

Supporting line:

```text
A sci-fi RC kart racing game set inside humanity's last Titan colony, where every machine has a builder, every race builds reputation, and the best designs can become real-world kits.
```

The site should be public-facing, player/community oriented, and clearly in development. It should drive newsletter signups for demo drops, build notes, and early racer updates.

## Narrative Rules

Use a compressed version of the deck flow:

1. Hero: Titan Racers, tagline, email CTA, cinematic racing/habitat energy.
2. What it is: creator-first sci-fi RC kart racing in a Titan habitat.
3. The loop: build, race, earn, improve.
4. Player paths: racer, assembler, engineer, or all three.
5. The world: the whole colony is the track; Titan's surface gives races stakes.
6. Machines with history: designs, components, reputation, licensing, royalties, physical kit experiments.
7. Roadmap and signup.

Keep lore lean. Explain only what makes the racing matter:

- humanity's last Titan colony lives in an orbital habitat,
- young racers run unauthorized courses through hidden spaces,
- driving and machine-building are how they prove themselves for surface crews.

Include the contrast between official trials and unofficial races through maintenance corridors, farms, training facilities, and gravity simulators.

## Copy Constraints

- Do not include crowdfunding copy or funding asks.
- Do not lead with web3, crypto, on-chain, Base, wallets, tokens, or Farcaster language.
- The word `royalties` is allowed when it describes creator/game economics.
- The physical-kit angle is a strong secondary hook, not the headline.
- Present the game as in development, not already fully playable.
- Use quarter-level roadmap timing, not exact launch dates:
  - Q3 2026: First Playable Demo
  - Q4 2026: Creator Loop MVP
  - Early 2027: Expanded World & Kit Experiments

## Brand And Visual Direction

Titan Racers should be the first-viewport brand. Include a small `A RaidGuild Forge project` attribution in navigation or footer.

The visual language should bias toward sci-fi racing fans first, then reveal maker/creator depth:

- cinematic industrial orange-black racing energy,
- bright O'Neill cylinder habitat contrast,
- tactile RC hardware and workbench imagery,
- catalogue/game UI flavor where it supports the concept.

Do not make the site feel like a generic SaaS landing page or a crowdfunding page.

## Subscribe Flow

The Titan Racers site should collect only an email address.

Visible promise:

```text
Get demo drops, build notes, and early racer updates from inside the habitat.
```

CTA label:

```text
Get Demo Updates
```

Shared Forge subscription contract:

- Use the same subscriber database as the RaidGuild Forge site.
- Titan signups must be Titan-specific, not generic `games: true` signups.
- Submit project interest `titan-racers` through the shared subscribe flow.
- Broad Forge preferences should be false or omitted in a way that the shared API treats as Titan-only.
- Titan should have its own confirmation page and confirmation copy.

## Analytics

Use Vercel Analytics. Do not track email addresses, names, wallet addresses, or freeform personal text.

Approved custom events:

- `hero_cta_click`
- `newsletter_form_view`
- `newsletter_submit`
- `newsletter_success`
- `newsletter_error`
- `confirmation_success`
- `confirmation_error`
- `roadmap_section_view`

Do not add `external_link_click` unless explicitly requested later.

## Working Agreement

- Track PR-sized chunks in `IMPLEMENTATION_PLAN.md`.
- Implement PRs one-by-one.
- Before starting implementation for each PR, run a full debrief/sync with the user so both sides agree on scope, copy/content, data model changes, analytics events, validation, and definition of done.
- Keep changes scoped to the current PR slice.
- Before substantial implementation, confirm the open product/design question with the user.
- Use `docs/pr-review-workflow.md` when asked to address GitHub PR review feedback.
- Verify responsive behavior on desktop, tablet, and mobile before considering visual work done.
- Preserve the shared subscription contract with the Forge repo.
