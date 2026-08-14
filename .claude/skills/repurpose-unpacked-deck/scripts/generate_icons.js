/**
 * Generate the six PNG icons used in slide 1's timeline and scope cards,
 * rasterised in white at 512×512 from FontAwesome 6 (via react-icons).
 *
 * Run from project root:   node scripts/generate_icons.js
 * Output:                   assets/icons/{flag,portal,report,layers,house,oil}.png
 */
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");
const fs = require("fs");
const path = require("path");

const OUTDIR = "assets/icons";
fs.mkdirSync(OUTDIR, { recursive: true });

// Edit this map to swap or add icons.
// Names from "react-icons/fa6" — see https://react-icons.github.io/react-icons/icons?name=fa6
const ICONS = {
  flag:   fa.FaFlag,        // slide 1, timeline node 1: "Confirmed as a CAA state"
  portal: fa.FaLaptop,      // slide 1, timeline node 2: "Producer portal opens"
  report: fa.FaFileLines,   // slide 1, timeline node 3: "First report due"
  layers: fa.FaLayerGroup,  // slide 1, card 1: "Eight simplified categories"
  house:  fa.FaHouseUser,   // slide 1, card 2: "Residential packaging only"
  oil:    fa.FaOilCan,      // slide 1, card 3: "Petroleum & lubricants carve-out"
};

async function gen(name, Comp) {
  if (!Comp) { console.error("MISSING icon component:", name); return; }
  // react-icons paints with fill="currentColor"; replace it with explicit white
  // so the SVG rasterises correctly regardless of the renderer.
  let svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(Comp, { size: "512" })
  );
  svg = svg.replace(/currentColor/g, "#FFFFFF");
  const png = await sharp(Buffer.from(svg))
    .resize(512, 512, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(OUTDIR, `${name}.png`), png);
  console.log("  ✔", `${name}.png`);
}

(async () => {
  console.log("Generating icons:");
  for (const [n, c] of Object.entries(ICONS)) await gen(n, c);
  console.log("done.");
})();
