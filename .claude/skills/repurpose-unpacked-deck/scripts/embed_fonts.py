#!/usr/bin/env python3
"""
Embed the Arimo font family into the built .pptx so titles and body render as
true Arimo on any machine (no PowerPoint substitution).

Run from project root:   python3 scripts/embed_fonts.py
Reads:                    assets/fonts/Arimo-*.ttf
                          output/Washington_Simplified_Reporting.pptx
Writes (in place):        output/Washington_Simplified_Reporting.pptx
"""
import os, sys, re, shutil, zipfile

PPTX = "output/Washington_Simplified_Reporting.pptx"
FONT_DIR = "assets/fonts"
WORK = "output/.embed_work"

FONTS = [  # (OOXML <p:...> element, source ttf filename, archive name inside pptx)
    ("regular",    "Arimo-Regular.ttf",    "font1.fntdata"),
    ("bold",       "Arimo-Bold.ttf",       "font2.fntdata"),
    ("italic",     "Arimo-Italic.ttf",     "font3.fntdata"),
    ("boldItalic", "Arimo-BoldItalic.ttf", "font4.fntdata"),
]

if not os.path.exists(PPTX):
    sys.exit(f"ERROR: {PPTX} not found. Run build_deck.js first.")
for _, ttf, _ in FONTS:
    if not os.path.exists(os.path.join(FONT_DIR, ttf)):
        sys.exit(f"ERROR: missing {ttf} in {FONT_DIR}/")

if os.path.exists(WORK):
    shutil.rmtree(WORK)
os.makedirs(WORK)
with zipfile.ZipFile(PPTX) as z:
    z.extractall(WORK)

# 1. copy fonts into ppt/fonts/
os.makedirs(os.path.join(WORK, "ppt", "fonts"), exist_ok=True)
for _, ttf, arc in FONTS:
    shutil.copy(os.path.join(FONT_DIR, ttf), os.path.join(WORK, "ppt", "fonts", arc))

# 2. [Content_Types].xml — add Default for fntdata
ct_path = os.path.join(WORK, "[Content_Types].xml")
ct = open(ct_path, encoding="utf-8").read()
if "fntdata" not in ct:
    ct = ct.replace(
        "</Types>",
        '<Default Extension="fntdata" ContentType="application/x-fontdata"/></Types>')
    open(ct_path, "w", encoding="utf-8").write(ct)

# 3. presentation.xml.rels — add a font relationship for each style
rels_path = os.path.join(WORK, "ppt", "_rels", "presentation.xml.rels")
rels = open(rels_path, encoding="utf-8").read()
existing_ids = re.findall(r'Id="(rId\d+)"', rels)
maxid = max((int(i[3:]) for i in existing_ids), default=0)
FONT_REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/font"
rel_ids = {}
new_rels = ""
for i, (style, _, arc) in enumerate(FONTS):
    rid = f"rId{maxid + 1 + i}"
    rel_ids[style] = rid
    new_rels += f'<Relationship Id="{rid}" Type="{FONT_REL}" Target="fonts/{arc}"/>'
rels = rels.replace("</Relationships>", new_rels + "</Relationships>")
open(rels_path, "w", encoding="utf-8").write(rels)

# 4. presentation.xml — set embedTrueTypeFonts="1" + insert <p:embeddedFontLst>
pres_path = os.path.join(WORK, "ppt", "presentation.xml")
pres = open(pres_path, encoding="utf-8").read()

m = re.search(r"<p:presentation\b[^>]*>", pres)
root = m.group(0)
if "embedTrueTypeFonts" not in root:
    pres = pres.replace(root, root[:-1] + ' embedTrueTypeFonts="1">', 1)

font_block = '<p:embeddedFontLst><p:embeddedFont><p:font typeface="Arimo"/>'
for style in ("regular", "bold", "italic", "boldItalic"):
    font_block += f'<p:{style} r:id="{rel_ids[style]}"/>'
font_block += "</p:embeddedFont></p:embeddedFontLst>"

# Per CT_Presentation schema order, embeddedFontLst must come AFTER notesSz
# and BEFORE defaultTextStyle. Insert directly after </p:notesSz>.
inserted = False
for anchor in ("</p:notesSz>", "<p:notesSz/>"):
    if anchor in pres:
        pres = pres.replace(anchor, anchor + font_block, 1)
        inserted = True
        break
if not inserted:
    pres = pres.replace("<p:defaultTextStyle>", font_block + "<p:defaultTextStyle>", 1)
    if "<p:defaultTextStyle>" not in pres:
        sys.exit("ERROR: could not place embeddedFontLst")
open(pres_path, "w", encoding="utf-8").write(pres)

# 5. repack
if os.path.exists(PPTX):
    os.remove(PPTX)
with zipfile.ZipFile(PPTX, "w", zipfile.ZIP_DEFLATED) as z:
    z.write(ct_path, "[Content_Types].xml")
    for root_dir, _, files in os.walk(WORK):
        for f in files:
            full = os.path.join(root_dir, f)
            arc = os.path.relpath(full, WORK)
            if arc == "[Content_Types].xml":
                continue
            z.write(full, arc)

shutil.rmtree(WORK)
print(f"✔ Arimo embedded -> {PPTX}")
