"""
Extract the rePurpose logo lockup (icon + 'rePurpose' wordmark) from page 5 of
the brand guidelines PDF. The bundled assets/repurpose_logo.png was generated
by this script — re-run it if your brand guidelines update.

Manual setup (one-time):
  1. The brand guidelines file in reference/ is actually a zip of page-image
     JPEGs (not a true PDF). Unzip it into a working folder first:

       mkdir -p /tmp/brand
       unzip reference/rePurpose_Brand_Guidelines_Public.pdf -d /tmp/brand

  2. Then run from project root:
       python3 scripts/extract_logo.py

Output: assets/repurpose_logo.png
"""
import os
from PIL import Image, ImageChops

SRC = "/tmp/brand/5.jpeg"   # page 5 of the brand guidelines (Logo / Default lockup)
OUT = "assets/repurpose_logo.png"
os.makedirs("assets", exist_ok=True)

if not os.path.exists(SRC):
    raise SystemExit(
        f"{SRC} not found. Unzip reference/rePurpose_Brand_Guidelines_Public.pdf "
        "into /tmp/brand/ first — see the docstring at the top of this script."
    )

im = Image.open(SRC).convert("RGB")
# crop the right-hand 'Logo / Default' lockup
box = (770, 500, 1360, 720)
crop = im.crop(box)

# auto-trim near-white margins
bg = Image.new("RGB", crop.size, (255, 255, 255))
diff = ImageChops.difference(crop, bg)
gray = diff.convert("L").point(lambda p: 255 if p > 16 else 0)
bbox = gray.getbbox()
if bbox:
    pad = 8
    bbox = (
        max(bbox[0] - pad, 0), max(bbox[1] - pad, 0),
        min(bbox[2] + pad, crop.size[0]), min(bbox[3] + pad, crop.size[1]),
    )
    crop = crop.crop(bbox)

# 2x upscale for crisp placement in the deck
crop = crop.resize((crop.size[0] * 2, crop.size[1] * 2), Image.LANCZOS)
canvas = Image.new("RGB", crop.size, (255, 255, 255))
canvas.paste(crop, (0, 0))
canvas.save(OUT)
print(f"✔ logo extracted -> {OUT}  ({canvas.size[0]}x{canvas.size[1]})")
