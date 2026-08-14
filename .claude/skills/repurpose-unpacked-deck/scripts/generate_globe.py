"""
Generate the faint orange wireframe-globe radial graphic used in the top-right
corner of every body slide.

Run from project root:  python3 scripts/generate_globe.py
Output:                  assets/globe.png
"""
import os, math
import numpy as np
from PIL import Image, ImageDraw

OUT = "assets/globe.png"
os.makedirs("assets", exist_ok=True)

S      = 2000                  # canvas (square)
cx = cy = S // 2
R      = 900                   # globe radius in px
tilt   = math.radians(23)      # viewing tilt

ink = np.zeros((S, S), dtype=np.float32)

def project(lat, lon):
    x = math.cos(lat) * math.sin(lon)
    y = math.sin(lat)
    z = math.cos(lat) * math.cos(lon)
    y2 = y * math.cos(tilt) - z * math.sin(tilt)
    return cx + x * R, cy - y2 * R

def add_line(pts, stroke, w=3):
    tmp = Image.new("L", (S, S), 0)
    ImageDraw.Draw(tmp).line(pts, fill=255, width=w, joint="curve")
    ink_local = np.asarray(tmp, dtype=np.float32) / 255.0
    np.add(ink, ink_local * stroke, out=ink)

# latitude rings (every 10°)
for latd in range(-80, 81, 10):
    lat = math.radians(latd)
    pts = [project(lat, math.radians(d)) for d in range(0, 361, 4)]
    add_line(pts, 0.085)

# longitude meridians (every 10°)
for lond in range(0, 180, 10):
    pts = [project(math.radians(d), math.radians(lond)) for d in range(-90, 91, 3)]
    add_line(pts, 0.085)

# faint silhouette circle
sil = Image.new("L", (S, S), 0)
ImageDraw.Draw(sil).ellipse([cx - R, cy - R, cx + R, cy + R], outline=255, width=3)
ink += np.asarray(sil, dtype=np.float32) / 255.0 * 0.10

# soften the outermost edge so the silhouette isn't a hard ring
yy, xx = np.mgrid[0:S, 0:S]
dist = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / R
edge = np.clip(1.0 - np.clip((dist - 0.99) / 0.05, 0, 1), 0, 1)
ink *= edge
ink = np.clip(ink, 0, 1)

# compose RGBA: light-orange lines, alpha from accumulated ink
ORANGE = (244, 132, 58)
MAXA = 158
alpha = np.clip(ink * 255.0 * 1.5, 0, MAXA).astype(np.uint8)
rgba = np.zeros((S, S, 4), dtype=np.uint8)
rgba[..., 0] = ORANGE[0]
rgba[..., 1] = ORANGE[1]
rgba[..., 2] = ORANGE[2]
rgba[..., 3] = alpha
Image.fromarray(rgba, "RGBA").save(OUT)
print(f"✔ globe.png saved -> {OUT}  (max alpha {int(alpha.max())})")
