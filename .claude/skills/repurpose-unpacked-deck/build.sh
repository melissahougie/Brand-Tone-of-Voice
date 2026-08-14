#!/usr/bin/env bash
# Full build pipeline for the rePurpose unPacked deck.
# Run from anywhere — this script cd's into its own directory first.
set -e
cd "$(dirname "$0")"

echo "▶ Generating globe radial..."
python3 scripts/generate_globe.py

echo "▶ Generating icons..."
node scripts/generate_icons.js

echo "▶ Building deck..."
node scripts/build_deck.js

echo "▶ Embedding Arimo fonts..."
python3 scripts/embed_fonts.py

echo ""
echo "✔ Done."
echo "  Output: output/Washington_Simplified_Reporting.pptx"
