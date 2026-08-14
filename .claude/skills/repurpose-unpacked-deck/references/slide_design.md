# rePurpose Slide Design Guide

## Format
- **Aspect ratio:** 16:9
- **Working size:** 1920×1080 (HD)
- **Final delivery size:** 3840×2160 (4K)
- **Primary aesthetic:** Light mode (white/cream backgrounds, dark teal structure, orange accents)

## Rendering specs (technical)
Final 4K renders require a specific two-step workflow to avoid soft text:

1. Render natively at 1920×1080 in wkhtmltoimage with `--zoom 2.0`
2. Upscale 2× using PIL LANCZOS to 3840×2160

Do NOT render directly at 3840×2160. Text becomes blurry at that resolution if rendered natively. The two-step approach gives crisp typography at full resolution.

## Typography
- **Font:** Arimo throughout (Google Fonts). No substitutions. (A real exported deck's theme can carry other fonts like DM Sans/Karla/Lato as Google Slides theme leftovers — that's an artifact of the export, not a style choice. If extending an existing deck, check what font its actual body text runs are set to, not just what the theme lists.)
- **Slide title:** 26pt bold, dark teal (#064F52)
- **Subtitle / section header:** 14pt bold, often inside an orange or dark teal band
- **Body text:** 12pt for bullets and table content
- **Detail text:** 10-11pt for captions, footnotes, source citations
- **Numbered circle markers:** 14-20pt bold white, set in orange or dark teal circles

## Color usage on slides

- **Orange (#F9680A):** Reserved for emphasis. One accent moment per slide where possible. CTA pills, "you are here" markers, numbered step circles, subtitle bands, table headers. Don't let orange become wallpaper.
- **Dark Teal (#064F52):** Primary structural color. Title text, section bands, table headers, secondary numbered circles, body text on light backgrounds.
- **Light Peach (#FBE6D8):** Soft background fills for cards, callouts, the "recommended" treatment, alternating table rows.
- **Cream / very light off-white (#FDF8F2 or #FAFAFA):** Alternating row backgrounds when peach is too strong.
- **Light Teal (#D0E6E8):** Supporting backgrounds, less common.
- **White (#FFFFFF):** Default slide background.

## Layout patterns that work

### Title + content
- Title at top-left, ~0.3" margin from edge
- Below title: a thin orange subtitle band (~0.32" tall, full width minus margins) with the slide's one-line takeaway in white
- Main content fills the remaining space
- Footer band (dark teal, ~0.34" tall) at the bottom with the slide's anchor takeaway in white

### Three-card horizontal comparison
- Three rounded rectangles side by side
- One card visually elevated as "recommended" (deeper background fill in light peach, orange border or accent, "RECOMMENDED" pill badge at top)
- Each card has: numbered circle + title at top, then 2-3 labeled rows (e.g., REGISTRATION / REPORTING / BEST FOR) below
- Card backgrounds: recommended = light peach, others = cream

### Numbered step list (5 rows)
- Alternating row backgrounds (cream + light peach)
- Orange numbered circle (~0.42" diameter) on the left of each row
- Bold title + descriptive sentence in dark teal/gray
- Color-coded deadline or status pill on the right (dark teal for primary, orange for differentiated)

### Data table
- Header row in orange (#F9680A) with white text
- Body rows alternating cream and light peach (or cream and white)
- Final emphasis row in light peach if it represents the destination, summit, or goal of the table

### Two-column comparison
- Left column: current state / problem
- Right column: rePurpose approach / solution
- Headers in dark teal, supporting text in gray (#666666)
- Use light peach for the right column background to subtly weight the eye toward our side

### Icon-grid pathway cards (confirmed in "Source Reduction Bootcamp")
- Used when the content is "N approved ways to do X" (e.g. the 5 SB 54 source-reduction pathways)
- N equal-width columns, one per option, each containing: numbered circle at top, bold title, one-line plain-language definition, then a labeled "Example:" line with a real, concrete instance in italic/gray
- Every column follows the exact same internal structure — this is what makes a 4-6-column row scannable instead of cluttered
- Numbered circles run 1→N left to right; don't skip numbers or reorder

### Illustrative calculation walkthrough (confirmed in "Source Reduction Bootcamp")
- Used to make an abstract fee/reduction formula concrete with one real example
- Shows the scenario in plain language ("Company sells 100 cans into CA"), then the input numbers, then the rate/fee schedule being applied, then the arithmetic itself written out (e.g. `150 lbs × $0.02/lb + 2 lbs × $0.04/lb ...`), ending in one bold, oversized `= $result` line
- Always carries a small gray source citation line at the bottom when the rates come from an external body (see "Sourced data table" below) — never present a regulator's numbers as if rePurpose originated them

### Sourced data table (confirmed in "Source Reduction Bootcamp")
- Standard data table (see above) plus a required small (~9-10pt), gray or dark-teal italic citation line directly under the table: `Source: <Body>, <Document Name>, <Month Year>.`
- Use whenever a table reproduces a regulator's or third party's published figures (fee schedules, bonus/malus rates, illustrative examples) — never let a regulatory number appear uncited
- If a figure is provisional or CAA/regulator hasn't finalized it, say so in the surrounding text (e.g. "CAA will finalize bonus rates by October 2026") rather than presenting it as settled

### Transparency / "still uncertain" slide (confirmed in "Source Reduction Bootcamp")
- Used when a regulation has real open questions rather than forcing false certainty
- Eyebrow/title along the lines of "What's still uncertain" or "Still unknown"
- Each open item gets its own card/block: a bolded question or topic, then 1-2 sentences of honest, plain-language context on why it's unresolved
- Never fill an unknown with a guess — this slide exists specifically so the deck doesn't have to. Matches the voice rule against fear-mongering: state the uncertainty calmly, don't dramatize it

### Workshop/customer recap slide (confirmed in "Source Reduction Bootcamp")
- Used to recap a past customer-only session and give non-attendees a taste of it
- Small eyebrow label in all-caps orange or dark teal, e.g. "INSIDE THE CUSTOMER-ONLY WORKSHOP"
- Either (a) a numbered grid of short "mindset shift" cards — 2-digit number, bold short title, one supporting sentence — often closed with a single pull-quote line naming the word/feeling customers used most, or (b) a set of anonymized customer quotes, each attributed only by topic: `— anonymous customer, on <topic>` (never a real name without explicit sign-off)
- This is one of the few places longer, more narrative sentences are appropriate — it's recapping a real conversation, not compressing a regulation

### Roles & responsibilities triptych (confirmed in "Source Reduction Bootcamp")
- Three columns, one per functional grouping (e.g. Governance & Strategy / Execution / Brand & Customers)
- Each column: a bold group header, then one sub-block per role (job function in bold, 2-4 short bullet responsibilities under it)
- Use when a slide's job is to answer "who on our team needs to be involved, doing what"

### Milestone roadmap (confirmed in "Source Reduction Bootcamp")
- A short sequence (3-5) of numbered steps laid out left to right or as a simple path, each with a short bold label and a date or trigger condition
- Closes with a single synthesizing sentence below the sequence, not a repeat of each step
- Different from the date-pill timeline above: this pattern is for a small number of big, named phases ("Baseline → Plan → Commit → Execute"), not a dense list of individual deadlines

### Closing sequence (confirmed in "Source Reduction Bootcamp")
The last few slides of a real unPacked deck follow a consistent shape — don't compress it into one slide:
1. **One-line CTA framing slide** — sparse, just the pitch in a single sentence (e.g. "Let us take compliance off your plate, so you can focus on your day job.")
2. **Visual break** — a single full-bleed image/graphic, no text, as a breather before the sales content
3. **How-it-works** — a short (3-step) numbered process specific to rePurpose's own workflow (assess → compile → submit/forecast)
4. **Proof-point card grid** — 4 short cards, each a bold headline claim + one supporting sentence (results/speed, pricing model, expertise, product capability), plus a CTA line and the bare `repurpose.global` URL
5. **Thank-you/contact slide** — "Thank You!", social handles, contact email, one-sentence company description

## Reusable elements

- **Footer band:** Dark teal bar, full width, ~0.34" tall, white text 12pt, with the slide's anchor takeaway. Optional but consistent across decks.
- **Subtitle band:** Orange bar under the title, ~0.32" tall, white text 13-14pt, with the slide's one-line takeaway.
- **Numbered circle:** Orange (or dark teal) filled oval, white bold number centered. ~0.42" diameter for body content, larger for hero elements.
- **Pill badge:** Rounded rectangle (very rounded, fully pill-shaped), small (~0.32-0.42" tall), white text on orange or dark teal. Used for "RECOMMENDED" callouts, deadline tags, or status indicators.
- **rePurpose logo:** Lower-right of slide, always present. Sized so it's visible but not dominant.

## Things that don't work
- Bullets longer than two lines visually (split them, or use a different layout)
- More than two accent colors on one slide (orange plus one supporting color is the ceiling)
- Heavy drop shadows or gradients (rePurpose aesthetic is flat and editorial)
- Stock photography of people in headsets, conference rooms, or generic "business" imagery
- Translucent PNGs on light backgrounds (replace with inline SVG outlines)
- Sentence-case in places where title-case is the convention, or vice versa (be consistent within a deck)

## Slide footer convention
- **Bottom-right:** rePurpose logo (always)
- **Optional bottom-left:** Dark teal footer band with slide-specific anchor text (e.g., "Producers must register and report 2023 data by June 1, 2026")

## When designing a new slide

Before opening any tool, decide:
1. What's the one thing this slide is for? Write that sentence first.
2. Which layout pattern (above) carries that idea most cleanly?
3. Where does the orange go? (Pick exactly one accent moment.)
4. What does the footer band say? (This is often the line you should have led with.)

If the slide has more than one main idea, it's actually two slides. Split it.
