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
Build the kart. Race the habitat. Earn your place.
```

Supporting line:

```text
A sci-fi RC kart racing game set inside humanity's last Titan colony, where every machine has a builder, every race builds reputation, and the best designs can become real-world kits.
```

The site should be public-facing, player/community oriented, and clearly in development. Its call to action sends players to the demo at `https://play.titanracers.com`.

## Narrative Rules

Use a compressed version of the deck flow:

1. Hero: Titan Racers, tagline, Play the demo CTA, cinematic racing/habitat energy.
2. What it is: creator-first sci-fi RC kart racing in a Titan habitat.
3. The loop: build, race, earn, improve.
4. Player paths: racer, assembler, engineer, or all three.
5. The world: the whole colony is the track; Titan's surface gives races stakes.
6. Machines with history: designs, components, reputation, licensing, royalties, physical kit experiments.
7. Roadmap and Play the demo.

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
- Present the game as in development, with a first playable demo out.
- Use quarter-level roadmap timing, not exact launch dates:
  - Q3 2026: First Playable Demo
  - Q4 2026: Creator Loop MVP
  - Early 2027: Expanded World & Kit Experiments

## Brand And Visual Direction

Titan Racers should be the first-viewport brand. It carries no other project's attribution.

The site follows the game's **Floodlit** look (see the game repo's `IMPLEMENTATION_PLAN.md`, "Visual Direction"):

- pages are mostly true black, divided by thin rules rather than panels,
- real in-game renders only, fading hard into black; no AI-generated imagery,
- heavy uppercase Arial/Helvetica headlines with widely tracked Courier mono labels,
- ice text with the site's orange and amber accents (section labels, numbers, dates, roadmap markers, hover); Play the demo is the one solid orange button.

The visual language should bias toward sci-fi racing fans first, then reveal maker/creator depth:

- the habitat at dusk under its floodlights,
- bright O'Neill cylinder habitat contrast,
- RC karts and the kart editor,
- game UI flavor where it supports the concept.

Do not make the site feel like a generic SaaS landing page or a crowdfunding page.

## Play the Demo

The site's call to action is a link to the demo at `https://play.titanracers.com`, labelled:

```text
Play the demo
```

It appears in the hero and in a closing section. The site collects no email addresses or other personal details. Links from the retired newsletter's confirmation emails (`/subscribe/*`) redirect to the home page.

## Analytics

Use Vercel Analytics. Do not track email addresses, names, wallet addresses, or freeform personal text.

Approved custom events:

- `play_demo_click`, with `location` (`hero` or `closing`)
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
