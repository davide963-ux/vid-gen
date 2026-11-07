---
format: 1080x1920
duration: 60s
message: "Your bank deposit isn't sitting in a vault. It's working in the financial system, and most money is just digital numbers."
arc: concept-explainer (hook, myth, mechanism, tension, reassurance, reveal, landing)
audience: general TikTok viewers curious about money
mode: autonomous
music: none
---

## Video direction

- **Palette system (from `frame.md`, blue-professional):** warm cream `bg` ground on every frame; cobalt `primary` is the ONLY accent (numerals, eyebrows, strokes, fills, progress bar); headlines near-black `text`; body muted gray; cards are 4% cobalt fill + 1.5px 20% cobalt border + 10-14px radius, no shadow. Atmosphere (concentric rings / dot grid) on the hook and the closing frame only. No second accent color; `positive`/`negative` never used.
- **Type:** Space Grotesk for display / numerals / eyebrows (eyebrows uppercase 0.08em cobalt), Inter for body. Portrait: short kinetic lines, big type, 3 words or fewer per line on heroes (`h1` scale), nothing smaller than the 1.4cqw floor.
- **Motion grammar + reveal model:** smooth long-tail `power3` settles, no bounce or overshoot. Every frame is VO-paced: at t=0 only what the voice is saying enters; each further piece (a card, a node, a word) reveals when the voice names it, spread across the back half. Aliveness during a hold = subtle jitter at most. No breathing, no slow back-half push or pan.
- **Layout:** 1080x1920. Centered hero anchors near y ≈ 806. Stack vertically (no side-by-side splits). Primary content stays inside the top ~83% (above y ≈ 1590) because the caption pill owns the bottom band. Vary the framing: centered hero (1, 5, 9) · vertical stack (3, 7) · converging field (4) · split top/bottom (2, 8) · single-line statement (6).
- **Rhythm / held frames:** high energy at 1 and 4; deliberate breathers (hold still) at 5 ("That's basically what a bank run is.") and 9 (the landing). Frame 6 is the emotional turn: calmer, one move.
- **Numerals and claims:** the only figure is `$1,000`, which is in the script. No invented percentages, rates, or dates. Proportions are shown without numbers.
- **Negative list:** no purple/blue AI gradients, no bokeh, no stock-photo or real bank logos, no drop shadows, no cobalt headlines, no square content corners. Not slideshow (front-load then freeze), not screensaver (everything floating independently).

## Frame 1 — Hook: weird

- scene: Big near-black type punches in; the word "weird" gets a cobalt marker highlight under a faint concentric-ring backdrop
- voiceover: "Here's something weird about money."
- duration: 2.005s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Curiosity gap (counterintuitive "weird" framing)
- beat: intrigue
- blueprint: kinetic-type-beats (Adapt)
- focal: the three-line headline "Here's something / weird / about money."
- roles: headline = foreground subject · cobalt marker highlight on "weird" = supporting · concentric rings + cobalt eyebrow "MONEY, EXPLAINED" = background/supporting (atmosphere allowed on the hook)

Adapt: keep kinetic-type-beats' words-carry-the-shot and per-word cadence; the swap is a marker emphasis instead of a token swap.
Scene 1 (0.0-0.7s): cream ground with faint concentric rings; eyebrow pill "MONEY, EXPLAINED" in cobalt; the first line "Here's something" enters by a per-word staggered reveal, centered, on a power3 settle. Centered, ~50% of frame.
Scene 2 (0.7-1.4s): the hero word "weird" lands large on its own line as the VO says it (smooth settle, no overshoot); a cobalt marker highlight sweeps under it (`css-marker-patterns`).
Scene 3 (1.4-2.0s): "about money." resolves under it; everything holds still, at most subtle jitter on the rings. Cobalt accent-line above the headline.
narrativeRole: Opens a curiosity gap in the viewer's own language, without any jargon, and promises something counterintuitive about everyday money.
keyMessage: Something about how money works is not what you assume.

## Frame 2 — The vault myth

- scene: A "$1,000" counts up, a vault outline draws itself, and the dollar figure veers around it instead of sitting inside
- voiceover: "When you deposit $1,000 into a bank, that exact $1,000 doesn't just sit inside a vault waiting for you."
- duration: 8.128s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/02-vault-myth.html
- type: pain_point
- persuasion: Common-belief vs reality (myth busting) + concretization
- beat: surprise + recognition
- blueprint: dataviz-countup (Adapt)
- focal: the cobalt "$1,000" numeral and the line-drawn vault door it refuses to enter
- roles: "$1,000" numeral = foreground subject · vault outline (SVG self-draw) = midground · dashed bypass arrow + muted "waiting for you" label = supporting · cream ground with hairline dot grid = background (dim)

Adapt: keep the count-up as the opener (the number is the hero) and the one-hero-metric landing; replace the chart with a vault drawing and a bypass path so the number visibly does NOT go in.
Scene 1 (0.0-2.0s): top-aligned eyebrow "THE DEPOSIT"; the numeral "$1,000" enters upper-center and counts up from 0 on the VO's "deposit $1,000" (`counting-dynamic-scale`), cobalt, ~45% of the frame width. Centered hero, 3 depth layers (ground, numeral, eyebrow).
Scene 2 (2.0-4.5s): as the VO says "that exact $1,000", a muted copy of the numeral stays pinned while a small bank vault door draws itself below it, stroke by stroke (`svg-path-draw`), cobalt line on cream. Stacked vertical layout (numeral above, vault below).
Scene 3 (4.5-7.5s): on "doesn't just sit inside a vault" a dashed cobalt path peels the numeral off to the side of the vault so it bypasses it (the number moves; the vault stays empty); a muted label "waiting for you" fades in with a thin strike line through it. Hold still.
narrativeRole: Names the common belief (my money sits in a vault) and breaks it in one image.
keyMessage: Your exact dollars are not locked in a box with your name on it.

## Frame 3 — Where the money goes

- scene: The deposit chip fans out into four tinted cards: loans, assets, payments, and a deliberately small slice of liquid cash
- voiceover: "Banks use deposited money as part of their wider financial system. They make loans, buy assets, process payments, and keep only enough liquid money available to handle normal withdrawals."
- duration: 13.163s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/03-where-it-goes.html
- type: feature_showcase
- persuasion: Progressive disclosure + frame-then-fill (enumeration of four uses)
- beat: comprehension
- blueprint: grid-card-assemble (Adapt)
- focal: a vertical stack of four tinted cards fed by the deposit chip
- roles: deposit chip "$1,000" at top = anchor · four tinted cards (Loans, Assets, Payments, Liquid cash) = foreground subject · connector lines from chip to cards = supporting · cream ground = background

Adapt: keep the staggered self-assembling list and the hold-on-completion; change the grid to a single vertical stack for 9:16, and make the last card visibly smaller to carry "only enough".
Scene 1 (0.0-3.0s): the "$1,000" chip sits at the top (carried from frame 2); the line "wider financial system" enters as a cobalt eyebrow "THE WIDER SYSTEM" with a hairline connector line drawn down (`svg-path-draw`). Asymmetric vertical layout, space reserved for four cards.
Scene 2 (3.0-5.5s): on "make loans" card 1 "LOANS" assembles in (`center-outward-expansion` out of the chip), tinted card, cobalt icon (hand-drawn house/arrow stroke); a short Inter sub-line.
Scene 3 (5.5-8.0s): "buy assets" then "process payments" arrive one by one, each on its spoken cue, stacked below, 3 depth layers, same entrance so the list reads as one flow.
Scene 4 (8.0-12.5s): on "keep only enough liquid money" the fourth card "LIQUID CASH" arrives noticeably SMALLER with a thin cobalt bar-fill showing a small slice (`stat-bars-and-fills`, no number); "normal withdrawals" lands as a muted caption under it. Hold still, subtle jitter only.
narrativeRole: Shows the mechanism: the deposit is working capital, and the cash kept on hand is a small piece.
keyMessage: Banks put your deposit to work and keep just enough on hand for ordinary withdrawals.

## Frame 4 — Everyone at once

- scene: A crowd of cobalt dots surges toward a small cash meter that drains as they all arrive together
- voiceover: "So technically, if every customer walked into the bank tomorrow and asked for all their money at the exact same time... the bank probably couldn't hand everyone physical cash immediately."
- duration: 11.861s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/04-everyone-at-once.html
- type: social_proof
- persuasion: Thought experiment (imagine / scenario) + causal chain
- beat: tension
- blueprint: compose
- focal: a field of customer dots converging on a small "cash on hand" meter that runs dry
- roles: customer dots (deterministic grid of ~40 circles) = foreground subject · cash meter (tinted card with cobalt fill bar) = anchor at the center-bottom of the content area · "tomorrow" / "same time" labels = supporting · cream ground = background

Compose: no blueprint fits a crowd-vs-meter; built from the motion vocabulary (`center-outward-expansion` reversed into convergence + `stat-bars-and-fills`).
Scene 1 (0.0-3.5s): at "every customer walked into the bank tomorrow" a calm grid of cobalt dots (each a customer) enters row by row at the top (staggered reveal, capped at ~0.5s), a tinted bank card with a small cobalt meter "CASH ON HAND" sits below. Vertical stack, 3 depth layers.
Scene 2 (3.5-7.5s): on "asked for all their money at the exact same time..." ALL dots drift down together toward the card in lockstep (`center-outward-expansion` run inward), then a tick of stillness on the ellipsis; the meter bar starts to drain smoothly as the dots reach it.
Scene 3 (7.5-11.5s): on "couldn't hand everyone physical cash immediately" the meter empties to a thin sliver and the remaining dots stack up unserved above it; a muted label "NOT ENOUGH CASH, ALL AT ONCE" holds. Hold still.
narrativeRole: Turns the abstract liquidity gap into a picture: demand arriving at once against a small cash pile.
keyMessage: A bank can't give every depositor physical cash at the same instant.

## Frame 5 — Bank run

- scene: A calm title card names the concept: "BANK RUN"
- voiceover: "That's basically what a bank run is."
- duration: 2.133s
- transition_in: cut
- status: animated
- src: compositions/frames/05-bank-run.html
- type: product_intro
- persuasion: Concept announcement (coined term)
- beat: clarity
- blueprint: titlecard-reveal (Reproduce)
- focal: the two-word term "Bank run" in near-black display type
- roles: "Bank run" = foreground subject · cobalt eyebrow "DEFINITION" + 60x4 accent line = supporting · cream ground = background

Scene 1 (0.0-1.0s): cream, empty but for the cobalt accent line and eyebrow "DEFINITION" fading in at the top third. Centered.
Scene 2 (1.0-3.5s): on "a bank run" the term "Bank run" slides up and crossfades in (ONE restrained move), large near-black type, centered at y ≈ 806; then a still hold. A breather: low motion IS the point here.
narrativeRole: Names the thing the previous frame just showed so the viewer can reuse the term.
keyMessage: This situation has a name: a bank run.

## Frame 6 — Not stealing

- scene: One calm line with "stealing" struck out in cobalt marker, answered by a quiet reassurance
- voiceover: "But this doesn't mean banks are secretly stealing your money."
- duration: 3.221s
- transition_in: crossfade
- status: animated
- src: compositions/frames/06-not-stealing.html
- type: benefit_highlight
- persuasion: Common-belief vs reality (preempt the wrong conclusion)
- beat: reassurance
- blueprint: kinetic-type-beats (Adapt)
- focal: the line "banks aren't secretly stealing your money" with the key word crossed out
- roles: two-line headline = foreground subject · cobalt marker strike-through on "stealing" = supporting · small cobalt check-circle (SVG self-draw) = supporting · cream ground = background

Adapt: keep the statement-built-in-beats shape; the beat is a strike-through reveal rather than a word swap.
Scene 1 (0.0-1.8s): "But this doesn't mean" enters per word, calm, upper-center; no atmosphere. Single-line statement layout.
Scene 2 (1.8-3.6s): "secretly stealing" lands as the VO says it; a cobalt marker line scribbles through it (`css-marker-patterns`, scribble/strike), muted to light gray.
Scene 3 (3.6-4.5s): "your money." resolves below in near-black; a small cobalt check-circle draws itself (`svg-path-draw`). Hold still.
narrativeRole: The emotional turn: prevents the viewer from reading the previous beats as a scandal.
keyMessage: Banks aren't stealing from you; this is how the system is designed.

## Frame 7 — The safeguards

- scene: A cobalt shield draws itself over the deposit while four safeguard cards stack beneath it
- voiceover: "Modern banks operate with liquidity requirements, capital rules, central-bank access, and deposit protection systems designed to prevent exactly that situation."
- duration: 11.52s
- transition_in: push-slide UP
- status: animated
- src: compositions/frames/07-safeguards.html
- type: feature_showcase
- persuasion: Rule of four + progressive disclosure (numbered enumeration)
- beat: confidence
- blueprint: grid-card-assemble (Adapt)
- focal: a line-drawn shield over four stacked safeguard cards
- roles: shield (SVG self-draw) = foreground subject at the top · four tinted cards (Liquidity requirements, Capital rules, Central-bank access, Deposit protection) = foreground list · cream ground with faint rings = background

Adapt: keep the self-assembling list that holds; add the shield as the one drawn hero so the set reads as "protection", stacked vertically for portrait.
Scene 1 (0.0-2.0s): on "Modern banks operate with" the shield outline draws itself upper-center (`svg-path-draw`), cobalt stroke on cream, ~40% of the frame; eyebrow "THE SAFEGUARDS". Centered hero at the top, space below for four cards.
Scene 2 (2.0-8.0s): on each spoken term a card assembles under the shield, one per cue: "LIQUIDITY REQUIREMENTS", "CAPITAL RULES", "CENTRAL-BANK ACCESS", "DEPOSIT PROTECTION"; each a tinted card with a short Inter sub-line, same entrance (power3), staggered strictly on the VO. The shield picks up a soft cobalt fill (accent-light) as the fourth card lands (`ambient-glow-bloom`, low peak).
Scene 3 (8.0-9.5s): "exactly that situation" holds as a muted caption under the stack; everything still.
narrativeRole: Answers the fear the last two beats raised: four named protections stand between a bank run and your money.
keyMessage: Rules and backstops exist to stop that scenario from happening.

## Frame 8 — Mostly digital

- scene: A banknote outline dissolves into a column of balance digits inside an account card
- voiceover: "The interesting part? Most of the money you see in your bank account isn't physical cash at all. It's numbers inside a financial system."
- duration: 8.832s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-mostly-digital.html
- type: feature_showcase
- persuasion: Concretization (physical to digital) + reveal-in-order
- beat: aha
- blueprint: compose
- focal: a banknote outline that decodes into digits in an account card
- roles: banknote outline (SVG self-draw) = foreground subject, top half · account-balance card with ledger digits = foreground subject, bottom half · "NOT PHYSICAL CASH" / "NUMBERS" labels = supporting · cream ground = background

Compose: no blueprint matches a physical-to-digital transformation; built from `svg-path-draw` + `hacker-flip-3d` (decode) + `counting-dynamic-scale`.
Scene 1 (0.0-3.0s): on "The interesting part?" a plain cobalt eyebrow "THE INTERESTING PART"; on "most of the money you see in your bank account" a tinted account card enters low-center showing the account balance line "Balance", and a banknote outline draws itself above it (`svg-path-draw`). Top/bottom stack.
Scene 2 (3.0-6.5s): on "isn't physical cash at all" a thin strike line crosses the banknote outline and it fades to light gray (the note is NOT what's inside the account). Muted label "NOT PHYSICAL CASH".
Scene 3 (6.5-10.0s): on "It's numbers inside a financial system" the card's digits decode in from scrambled glyphs to clean cobalt figures (`hacker-flip-3d`, finite, deterministic) with ledger rows ticking; label "NUMBERS". Hold still. (Digits are decorative placeholders, not claimed amounts.)
narrativeRole: The reveal: what's in the account is a ledger entry, not a pile of notes.
keyMessage: Most money is digital numbers in a system, not physical cash.

## Frame 9 — Landing

- scene: A closing line over concentric rings, "digital" emphasized in cobalt
- voiceover: "Money is much more digital than most people realize."
- duration: 3.477s
- transition_in: crossfade
- status: animated
- src: compositions/frames/09-landing.html
- type: branding
- persuasion: Distillation (one-line takeaway) + callback to the hook
- beat: satisfaction
- blueprint: titlecard-reveal (Adapt)
- focal: the takeaway line "Money is much more digital than most people realize."
- roles: takeaway headline = foreground subject · cobalt marker emphasis on "digital" = supporting · concentric closing rings + cobalt accent-line = background/supporting · closing exit allowed (final frame)

Adapt: keep the calm single-move reveal and still hold; add the closing rings atmosphere the preset reserves for the last frame.
Scene 1 (0.0-1.5s): concentric rings fade in around center; "Money is much more" settles in near-black, centered at y ≈ 806 (per-word reveal, calm).
Scene 2 (1.5-3.0s): on "digital" the word lands large in cobalt weight with a soft marker underline (`css-marker-patterns`); "than most people realize." resolves beneath. Held read.
Scene 3 (3.0-4.5s): hold still; the whole frame fades down to cream in the last 0.4s (the only real exit in the video).
narrativeRole: Lands the one-line takeaway and echoes the hook's calm "weird about money".
keyMessage: Money is much more digital than most people realize.
