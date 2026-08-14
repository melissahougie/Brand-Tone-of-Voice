---
name: repurpose-unpacked-deck
description: Build rePurpose "unPacked" webinar decks — the branded slide format rePurpose uses for its EPR/packaging-compliance webinar series (e.g. "Base Camp to Summit," "Source Reduction," state-specific reporting deep-dives). Use this skill whenever the user asks to create, draft, or update an unPacked deck, an EPR webinar deck, a rePurpose webinar presentation, or any .pptx for rePurpose that should follow the established brand look (Arimo font, dark-teal/orange/peach palette, orange subtitle band, corner globe graphic, climbing metaphor). Also use it if the user references "the unPacked format," asks to match a previous rePurpose webinar deck, or uploads/mentions a past unPacked deck and wants something similar. This skill is specific to rePurpose branded webinar decks — do not use it for the internal All Hands deck or generic, non-rePurpose presentations.
---

# rePurpose unPacked Deck Builder

Everything needed to write and build a new unPacked webinar deck that looks and
sounds like it came from the same team that made "Base Camp to Summit," the
Washington Simplified Reporting deck, and the June 2026 "Source Reduction
Bootcamp" deep-dive on California SB 54: the voice, the brand system, the
exact slide layout specs, and a working build pipeline that renders real
.pptx files with embedded fonts.

## Before doing anything else

Read, in this order:

1. **`references/voice_and_writing.md`** — how rePurpose talks. This governs
   every word you write for the deck (titles, subtitle bands, bullets, footer
   takeaways, speaker notes).
2. **`references/brand_reference.md`** — colors, positioning, approved claims,
   audience, and the climbing metaphor vocabulary. This governs what you're
   allowed to claim and how you name things.
3. **`references/slide_design.md`** — the actual layout specs (typography
   sizes, color usage per slide, the reusable layout patterns, what not
   to do). This governs how the deck looks.

Do not start writing slide copy or building slides until you've internalized
these three. They are short and the whole point of this skill is that the
deck should feel like it was made by the same team, not just visually similar.

## Workflow

### 1. Scope the deck with the user

Before writing anything, know:

- **Topic and audience angle.** Is this a state-specific reporting deep-dive
  (like Washington), a broader seasonal push (like "Base Camp to Summit"), or
  a product/strategy topic (like Source Reduction)? The topic determines
  whether the climbing metaphor is worth using at all — see
  `voice_and_writing.md`, "use it when it adds, skip it when it would feel
  forced."
- **Presenters and date.** Needed for the title slide. Title-slide convention
  confirmed from a real deck: `unPacked: <Topic Name> — <Act/Regulation short
  name>` as the title, plain event date underneath (e.g. "unPacked: Source
  Reduction Bootcamp — SB 54" / "June 24, 2026") — presenter names are
  optional on the title slide itself.
- **Key dates/deadlines/numbers.** unPacked decks are dense with real,
  specific facts (deadlines, category counts, dollar figures). Don't invent
  these — ask the user for source material (regulatory text, internal briefs,
  a previous deck to extend) if they aren't already in the conversation.
- **Roughly how many slides / what sections.** Deck length varies a lot by
  purpose: a quick update or single-state briefing runs ~10-20 slides, while
  a full topic "bootcamp" deep-dive (like Source Reduction) can run 50+
  slides once it covers mechanics, math, open questions, and a workshop
  recap. Either way the shape is the same: title → disclaimer(s) (a straight
  legal one, optionally followed by a dry-humor one — see
  `voice_and_writing.md`) → agenda/what-we're-covering → core content
  sections (each with its own sub-slides — overview, mechanics, worked
  examples, what's still uncertain, if applicable) → common mistakes /
  shortcuts or a "before you build your plan" checklist → what's coming next
  / roadmap → optional customer/workshop recap → closing sequence (see
  `slide_design.md`, "Closing sequence," for its 5-slide shape).

If any of this is missing or ambiguous, ask — don't guess at real regulatory
facts or dates.

### 2. Draft the slide-by-slide copy first, as text

Before touching the build script, write out each slide's:
- **Title** (one line, sentence case, matches an existing slide's phrasing
  style — e.g. "Chasing supplier data," "Simplified reporting states: WA, MN,
  MD")
- **Orange subtitle band** (the one-line takeaway — this is often the line
  you'd otherwise bury at the end)
- **Body content** (bullets, table rows, timeline nodes, or numbered steps —
  pick the layout pattern from `slide_design.md` that fits)
- **Footer takeaway**, if the slide warrants one

Run this draft against `voice_and_writing.md` before moving on: no
"it's-not-X-it's-Y" constructions, no parallel antithesis, no filler verbs
(discover/unlock/simply), no fear-mongering, bold the lead words of bullets,
real numbers not vague quantities.

Confirm the draft with the user before generating the file — copy is much
cheaper to fix as text than after it's baked into a .pptx.

### 3. Build the .pptx

The bundled pipeline in `scripts/` generates a real, editable PowerPoint file
using `pptxgenjs`, with the brand system already encoded (colors, font,
globe graphic, logo placement, band conventions). Don't hand-build slides
with the generic `pptx` skill's approach from scratch — this pipeline exists
specifically so unPacked decks stay pixel-consistent with past ones.

**Setup (first run in a fresh environment):**
```bash
cd <skill_folder>
npm install pptxgenjs react-icons react react-dom sharp --prefix .
pip install Pillow numpy --break-system-packages
```

**Edit content:** Open `scripts/build_deck.js`. Each slide is a block between
`/* === SLIDE N === */` comments. Content lives in data arrays at the top of
each block (e.g. `tl[]` for timeline nodes, `cards[]` for scope cards,
`s2rows[]`, `s3rows[]` for numbered steps/rows) — edit these arrays rather
than rewriting layout code. To add a new slide, copy the pattern of an
existing block that matches the layout you need (see "Layout patterns" in
`slide_design.md` for which block to copy), rename the slide variable
(`const s4 = pres.addSlide();`), and edit its content arrays. Every slide
should call the shared `base(slide, title, band)` helper first — it applies
the white background, globe graphic, title, orange band, and logo, so
slide-specific code only needs to add the body content on top.

Update `pres.title` and the output filename references at the top of the
script and in `build.sh` to match the new deck's topic.

**Run the full pipeline:**
```bash
bash build.sh
```
This runs, in order: `generate_globe.py` (builds the corner globe graphic —
skip if `assets/globe.png` already exists and hasn't changed),
`generate_icons.js` (builds the white icon set — skip/edit the `ICONS` map
only if new icons are needed), `build_deck.js` (writes the .pptx), and
`embed_fonts.py` (embeds Arimo into the file so it renders correctly on any
machine — **do not skip this step**, or the deck will fall back to a
substitute font on machines without Arimo installed).

Output lands at `output/<Deck_Name>.pptx`. Copy it to
`/mnt/user-data/outputs/` and present it to the user.

### 4. QA pass before presenting

- Re-read every slide's copy against `voice_and_writing.md` one more time.
- Check every claim against the "approved claims" / "claims to avoid" lists
  in `brand_reference.md`.
- Confirm every date, dollar figure, and regulatory detail traces back to
  something the user gave you or a verifiable source — flag (don't silently
  invent) anything you're not sure of, the way the original Washington deck's
  build guide flagged its own unverified facts. If you're extending or
  adapting content from a previous deck, don't assume old numbers are still
  current.
- Confirm the deck follows the standard shape: title slide → disclaimer(s) →
  agenda → content → common mistakes/shortcuts (if applicable) → what's
  coming next → closing sequence (CTA framing → visual break → how-it-works →
  proof-point card grid + CTA → thank-you/contact). See `slide_design.md`,
  "Closing sequence," for the confirmed 5-slide version of this.
- If a regulatory table or fee schedule is reproduced from a regulator or
  third party, confirm it carries a source citation line (see
  `slide_design.md`, "Sourced data table") — never let a number that isn't
  rePurpose's own appear as if it were.

## Assets available

- `assets/repurpose_logo.png` — logo lockup, placed bottom-left on every
  slide (already wired into `base()`).
- `assets/globe.png` — the faint orange wireframe-globe corner graphic used
  on every slide (already wired into `base()`). Regenerate via
  `scripts/generate_globe.py` if you need a variant (e.g. the large
  bottom-rising radial used on title-only slides — see note in
  `references/slide_design.md` and the example title-slide screenshot).
- `assets/icons/*.png` — six white icons (flag, portal, report, layers,
  house, oil) for timeline/card layouts. Add more via
  `scripts/generate_icons.js` (pulls from `react-icons/fa6`).
- `assets/fonts/Arimo-*.ttf` — the only approved font. Never substitute.
- `assets/EPR_Office_Hours_title_slide_example.png` and
  `assets/EPR_Office_Hours_body_slide_example.png` — annotated reference
  screenshots showing the title-slide and body-slide patterns in finished
  form.

## Quick reference: brand palette

| Color | Hex | Use for |
|---|---|---|
| Dark Teal | `#064F52` | Titles, structural elements, primary text |
| Orange | `#F9680A` | One accent moment per slide — subtitle bands, CTAs, numbered circles |
| Light Peach | `#FBE6D8` | Card/callout backgrounds, "recommended" treatment |
| Light Teal | `#D0E6E8` | Secondary backgrounds |
| Cream | `#FDF8F2` | Alternating rows when peach is too strong |
| Gray (dark) | `#666666` | Body text |
| White | `#FFFFFF` | Default background |

Full detail, including the climbing-metaphor vocabulary, sign-offs by use
case, and approved/flagged claims, is in `references/brand_reference.md` —
consult it, don't rely on this table alone.

## Common mistake to avoid

Treating this as "make a nice-looking slide deck about EPR." The unPacked
format is specific: it's built for a named audience (EPR compliance
professionals, two named psychographic profiles), in a specific voice (calm,
peer-to-peer, no alarm bells), with a locked palette and typographic system,
and it often — not always — runs on the climbing metaphor. Skipping the
reference docs and improvising the brand from memory is the most likely way
this goes wrong.
