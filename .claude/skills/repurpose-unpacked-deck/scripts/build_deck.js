/**
 * Build the rePurpose unPacked webinar deck on Washington's Simplified Reporting.
 *
 * Run from the project root:   node scripts/build_deck.js
 * Output:                       output/Washington_Simplified_Reporting.pptx
 *
 * After this runs, also run:    python3 scripts/embed_fonts.py
 * (embeds Arimo into the .pptx so it renders correctly on any machine)
 */

const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

// brand palette
const TEAL     = "064F52";
const ORANGE   = "F9680A";
const PEACH    = "FBE6D8";
const CREAM    = "FDF8F2";
const GRAY     = "666666";
const WHITE    = "FFFFFF";
const NEARBLACK = "1A1A1A"; // slide titles — confirmed from real decks, NOT teal
const FONT     = "Arimo";

// paths — resolve from project root (process.cwd() when invoked via build.sh)
const ASSETS = "assets";
const OUTDIR = "output";
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE";          // 13.333 x 7.5 inches
pres.author = "rePurpose";
pres.title  = "unPacked Webinar — Washington Simplified Reporting";

/* ----- shared base layout (background, globe radial, title, orange band, logo) ----- */
function base(slide, title, band) {
  slide.background = { color: WHITE };
  // faint orange wireframe-globe radial, top-right corner, behind all content
  slide.addImage({ path: `${ASSETS}/globe.png`, x: 8.75, y: -5.54, w: 10.49, h: 10.49 });
  slide.addText(title, {
    x: 0.55, y: 0.40, w: 12.2, h: 0.74,
    fontFace: FONT, fontSize: 28, bold: true, color: NEARBLACK,
    align: "left", valign: "middle", margin: 0,
  });
  // orange subtitle band — the slide's one-line takeaway
  slide.addShape(pres.shapes.RECTANGLE, {
    x: 0.55, y: 1.26, w: 12.23, h: 0.52, fill: { color: ORANGE }, line: { type: "none" },
  });
  slide.addText(band, {
    x: 0.73, y: 1.26, w: 11.9, h: 0.52,
    fontFace: FONT, fontSize: 15, bold: true, color: WHITE,
    align: "left", valign: "middle", margin: 0,
  });
  // logo bottom-left
  slide.addImage({ path: `${ASSETS}/repurpose_logo.png`, x: 0.55, y: 6.95, w: 1.14, h: 0.36 });
}

function richBody(lead, rest) {
  return [
    { text: lead + "  ", options: { fontFace: FONT, bold: true,  color: TEAL } },
    { text: rest,        options: { fontFace: FONT, bold: false, color: GRAY } },
  ];
}

/* ===========================================================================
 * SLIDE 1 — Washington Joins the CAA Program  (timeline + scope cards)
 * =========================================================================== */
const s1 = pres.addSlide();
base(s1, "Washington Joins the CAA Program",
        "No broad small-producer exemption yet — most producers are in scope for 2026.");

// --- timeline ribbon ---
const tl = [
  { date: "MARCH 4",  icon: `${ASSETS}/icons/flag.png`,   title: "Confirmed as a CAA state",
    desc: "Ecology named Circular Action Alliance as Washington's PRO." },
  { date: "APRIL 23", icon: `${ASSETS}/icons/portal.png`, title: "Producer portal opens",
    desc: "Washington registration and reporting run through the CAA portal." },
  { date: "MAY 31",   icon: `${ASSETS}/icons/report.png`, title: "First report due",
    desc: "The Simplified Supply Report (2025 data) — file it once the WA state addendum is signed." },
];
const nodeX = [2.62, 6.667, 10.71];
const lineY = 2.74, D = 0.64;
s1.addShape(pres.shapes.LINE, {
  x: nodeX[0], y: lineY, w: nodeX[2] - nodeX[0], h: 0,
  line: { color: TEAL, width: 1.25, dashType: "dash" },
});
tl.forEach((n, i) => {
  const cx = nodeX[i];
  const pw = 1.52, ph = 0.34;
  s1.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x: cx - pw / 2, y: lineY - D / 2 - 0.14 - ph, w: pw, h: ph,
    rectRadius: 0.17, fill: { color: TEAL }, line: { type: "none" },
  });
  s1.addText(n.date, {
    x: cx - pw / 2, y: lineY - D / 2 - 0.14 - ph, w: pw, h: ph,
    fontFace: FONT, fontSize: 11, bold: true, color: WHITE, align: "center", valign: "middle", margin: 0,
  });
  s1.addShape(pres.shapes.OVAL, {
    x: cx - D / 2, y: lineY - D / 2, w: D, h: D, fill: { color: ORANGE }, line: { type: "none" },
  });
  s1.addImage({ path: n.icon, x: cx - 0.17, y: lineY - 0.17, w: 0.34, h: 0.34 });
  const bw = 3.7;
  s1.addText(n.title, {
    x: cx - bw / 2, y: lineY + D / 2 + 0.13, w: bw, h: 0.30,
    fontFace: FONT, fontSize: 13, bold: true, color: TEAL, align: "center", valign: "top", margin: 0,
  });
  s1.addText(n.desc, {
    x: cx - bw / 2, y: lineY + D / 2 + 0.45, w: bw, h: 0.62,
    fontFace: FONT, fontSize: 10.5, color: GRAY, align: "center", valign: "top", margin: 0,
    lineSpacingMultiple: 1.05,
  });
});

// --- scope cards ---
s1.addText("SCOPE AT A GLANCE", {
  x: 0.58, y: 4.30, w: 7, h: 0.28,
  fontFace: FONT, fontSize: 11, bold: true, color: ORANGE, charSpacing: 2,
  align: "left", valign: "middle", margin: 0,
});
const cards = [
  { icon: `${ASSETS}/icons/layers.png`, title: "Eight simplified categories",
    desc: "Simplified reporting — a lighter structure than the full material-category detail California, Oregon, and Colorado require." },
  { icon: `${ASSETS}/icons/house.png`,  title: "Residential packaging only",
    desc: "Covered materials are packaging for personal, non-commercial use. B2B packaging is permanently out of scope." },
  { icon: `${ASSETS}/icons/oil.png`,    title: "Petroleum & lubricants carve-out",
    desc: "An approved alternative collection program (LPMA / Interchange 360) — relevant only to that industry's producers." },
];
{
  const cy = 4.66, ch = 2.06, cw = 3.877, cgap = 0.30, cx0 = 0.55;
  const ic = 0.58, iconPx = 0.30;
  cards.forEach((c, i) => {
    const cx = cx0 + i * (cw + cgap);
    s1.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: cx, y: cy, w: cw, h: ch, rectRadius: 0.09, fill: { color: PEACH }, line: { type: "none" },
    });
    s1.addShape(pres.shapes.OVAL, {
      x: cx + 0.30, y: cy + 0.27, w: ic, h: ic, fill: { color: ORANGE }, line: { type: "none" },
    });
    s1.addImage({
      path: c.icon,
      x: cx + 0.30 + (ic - iconPx) / 2, y: cy + 0.27 + (ic - iconPx) / 2,
      w: iconPx, h: iconPx,
    });
    s1.addText(c.title, {
      x: cx + 0.30, y: cy + 0.96, w: cw - 0.60, h: 0.44,
      fontFace: FONT, fontSize: 13, bold: true, color: TEAL, align: "left", valign: "top", margin: 0,
    });
    s1.addText(c.desc, {
      x: cx + 0.30, y: cy + 1.42, w: cw - 0.60, h: 0.58,
      fontFace: FONT, fontSize: 10.5, color: GRAY, align: "left", valign: "top", margin: 0,
      lineSpacingMultiple: 1.05,
    });
  });
}
s1.addNotes(
  "Slide 1 is the lay of the land — walk the timeline left to right. March 4: Ecology formally named Circular Action Alliance as Washington's PRO, which is what makes this a CAA state. April 23: the producer portal opened for Washington; registration and reporting both run through it. May 31: the first reporting deadline — the Simplified Supply Report covering 2025 data — and flag that producers must sign the Washington state addendum before they can submit. Then the three scope cards: Washington uses simplified reporting with eight material categories, lighter than the full detail California, Oregon, and Colorado require; covered materials are residential packaging only, so B2B packaging is out of scope, and that is a permanent exclusion, not a one-year phase-in; and there is an approved alternative collection program for the petroleum and lubricants industry, which only matters to producers in that space. The headline to land — the orange bar — is that Washington has no broad small-producer exemption during startup, so most producers selling covered packaging into the state should assume they are obligated for 2026."
);

/* ===========================================================================
 * SLIDE 2 — What Comes After May 31  (date-pill timeline rows)
 * =========================================================================== */
const s2 = pres.addSlide();
base(s2, "What Comes After May 31",
        "The interim report filed in May is what Washington uses to set early fees for January 2027.");

const s2rows = [
  ["MAY 27",   "First rulemaking meeting.",      "Washington holds the first of five rulemaking meetings. The rules that govern the program get written across this series — worth following closely."],
  ["OCT 1",    "Statewide collection lists due.","Building these lists is one of the program's two big priorities for 2026, confirmed at the April 29 advisory board meeting."],
  ["DEC 31",   "Preliminary needs assessment due.","The program's second major 2026 deliverable. It shapes what the collection and recycling system will be built to handle."],
  ["JAN 2027", "Early fees expected.",            "Washington is expected to set early fees, calculated from the interim supply reports submitted this May."],
];
{
  const top = 2.04, rowH = 1.165;
  s2rows.forEach((r, i) => {
    const y = top + i * rowH;
    if (i % 2 === 0) {
      s2.addShape(pres.shapes.RECTANGLE, {
        x: 0.55, y: y, w: 12.23, h: rowH, fill: { color: CREAM }, line: { type: "none" },
      });
    }
    s2.addShape(pres.shapes.ROUNDED_RECTANGLE, {
      x: 0.80, y: y + rowH / 2 - 0.225, w: 1.46, h: 0.45,
      rectRadius: 0.22, fill: { color: ORANGE }, line: { type: "none" },
    });
    s2.addText(r[0], {
      x: 0.80, y: y + rowH / 2 - 0.225, w: 1.46, h: 0.45,
      fontFace: FONT, fontSize: 12, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s2.addText(richBody(r[1], r[2]), {
      x: 2.52, y: y, w: 10.05, h: rowH,
      fontFace: FONT, fontSize: 14.5, align: "left", valign: "middle", margin: 0,
      lineSpacingMultiple: 1.05,
    });
  });
}
s2.addNotes(
  "This is the slide that reframes May 31. The simplified report is interim — it is not the finish line, and it feeds something specific. Walk the timeline top to bottom. Rulemaking kicks off May 27, the first of five meetings, and that is where the real rules get written, so it is worth tracking. October 1, the statewide collection lists are due. December 31, the preliminary needs assessment. Those two were named at the April 29 advisory board meeting as the program's big priorities for the year. Then the punchline: January 2027, early fees — and those fees are calculated from the report producers file in May. So the data submitted in two weeks becomes the basis for that first invoice. That is why accuracy matters, which sets up the next slide."
);

/* ===========================================================================
 * SLIDE 3 — What Producers Need to Do Now  (numbered steps + peach callout)
 * =========================================================================== */
const s3 = pres.addSlide();
base(s3, "What Producers Need to Do Now",
        "Four steps to handle before the May 31 deadline.");

const s3rows = [
  ["Sign the state addendum.", "Watch for the Washington addendum on the CAA portal and sign it as soon as it appears. Reports can't be submitted until it's done."],
  ["Confirm what's in scope.", "Map your packaging to the eight simplified categories. B2B is excluded this year, so only personal, non-commercial-use packaging counts."],
  ["File the Simplified Supply Report by May 31.", "It covers your 2025 calendar-year supply data and is required under your CAA agreement. Simplified reporting is still mandatory reporting."],
  ["Treat the figures as real numbers.", "This interim report is the basis for Washington's early fees in January 2027. Accurate data now keeps that first invoice predictable."],
];
{
  const top = 2.00, rowH = 0.838;
  s3rows.forEach((r, i) => {
    const y = top + i * rowH;
    s3.addShape(pres.shapes.OVAL, {
      x: 0.62, y: y + rowH / 2 - 0.21, w: 0.42, h: 0.42, fill: { color: ORANGE }, line: { type: "none" },
    });
    s3.addText(String(i + 1), {
      x: 0.62, y: y + rowH / 2 - 0.21, w: 0.42, h: 0.42,
      fontFace: FONT, fontSize: 17, bold: true, color: WHITE,
      align: "center", valign: "middle", margin: 0,
    });
    s3.addText(richBody(r[0], r[1]), {
      x: 1.30, y: y, w: 11.45, h: rowH,
      fontFace: FONT, fontSize: 14.5, align: "left", valign: "middle", margin: 0,
      lineSpacingMultiple: 1.05,
    });
  });
}
s3.addShape(pres.shapes.ROUNDED_RECTANGLE, {
  x: 0.55, y: 5.42, w: 12.23, h: 1.36, rectRadius: 0.10,
  fill: { color: PEACH }, line: { type: "none" },
});
s3.addText([
  { text: "HOW REPURPOSE HELPS",
    options: { fontFace: FONT, fontSize: 10.5, bold: true, color: ORANGE, charSpacing: 2, breakLine: true, paraSpaceAfter: 5 } },
  { text: "Send us your packaging data and we handle the rest — signing the addendum, filing the report, and tracking every Washington deadline that follows May 31.",
    options: { fontFace: FONT, fontSize: 13.5, color: TEAL, breakLine: true, paraSpaceAfter: 5 } },
  { text: "Heavy pack? We've got it.",
    options: { fontFace: FONT, fontSize: 14.5, bold: true, color: ORANGE } },
], {
  x: 0.95, y: 5.42, w: 11.45, h: 1.36,
  fontFace: FONT, align: "left", valign: "middle", margin: 0, lineSpacingMultiple: 1.05,
});
s3.addNotes(
  "Close the section with the to-do list — keep it practical, no alarm bells. Four things. One, sign the addendum the moment it shows up on the portal; it is the gate to everything else. Two, confirm scope — eight simplified categories, B2B excluded this year. Three, file the Simplified Supply Report by May 31; remind folks that simplified still means mandatory. Four, and this ties straight back to the previous slide, treat the numbers as real because they set the January early fees. Then land the rePurpose point softly: this is exactly the kind of work we take off your plate. You send the data, we handle the addendum, the filing, and everything Washington rolls out after May 31. Do not oversell it — just make sure the audience knows the option is there. End on the line: heavy pack, we've got it."
);

const OUT = path.join(OUTDIR, "Washington_Simplified_Reporting.pptx");
pres.writeFile({ fileName: OUT }).then(() => console.log("✔ deck written ->", OUT));
