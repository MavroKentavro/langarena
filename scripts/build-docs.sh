#!/usr/bin/env bash
# Refresh docs/ from preview/ — call this whenever the prototype changes.
#
# What it does:
#   1. Copies preview/prototype.html → docs/index.html (renamed so the
#      site root URL serves the funnel directly).
#   2. Mirrors preview/images and preview/flags into docs/, dropping
#      .DS_Store and any hashed Vite copies (e.g. Bulgarian-a24f00c9.svg).
#   3. Re-creates docs/.nojekyll so GitHub Pages skips Jekyll
#      (required because some asset filenames have spaces and parens).
#
# Usage:
#   ./scripts/build-docs.sh
#
# Reproducible — safe to run repeatedly. Does NOT run any bundler;
# the prototype is already a single self-contained HTML file with
# inlined Lottie JSON and SVG masks.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/preview"
OUT="$ROOT/docs"

[ -f "$SRC/prototype.html" ] || { echo "missing $SRC/prototype.html" >&2; exit 1; }

echo "▸ refreshing $OUT/"

mkdir -p "$OUT"

# 1) the main HTML, renamed so / serves the funnel.
#    Before copying we re-inject preview/public/data.json into the
#    inline `<script type="application/json" id="static-text-data">`
#    block so the file:// fallback path always serves the latest
#    translations.  Without this, fetch() works on http (server +
#    GitHub Pages) but file:// browsers fall back to whatever was
#    last frozen into the inline tag → stale English copy.
python3 - "$SRC/prototype.html" "$SRC/public/data.json" "$OUT/index.html" <<'PY'
import json, re, sys, pathlib
src_html, src_json, out_html = (pathlib.Path(p) for p in sys.argv[1:])
html = src_html.read_text(encoding="utf-8")
data = src_json.read_text(encoding="utf-8").strip()
# Defensive escape — JSON cannot contain a literal closing script tag.
data = data.replace("</script>", "<\\/script>")
pat  = re.compile(
    r'(<script type="application/json" id="static-text-data">)\s*.*?\s*(</script>)',
    re.DOTALL,
)
if not pat.search(html):
    sys.exit("inline static-text-data block missing in prototype.html")
new = pat.sub(
    lambda m: m.group(1) + "\n" + data + "\n" + m.group(2),
    html, count=1,
)
out_html.write_text(new, encoding="utf-8")
# Mirror back into preview/prototype.html so source stays in sync too.
src_html.write_text(new, encoding="utf-8")
PY

# 1b) StaticTextProvider companion script (loaded by index.html via
#     <script src="staticTextProvider.js">). The runtime fetches the
#     JSON catalogue from public/data.json on the same origin.
[ -f "$SRC/staticTextProvider.js" ] && cp "$SRC/staticTextProvider.js" "$OUT/staticTextProvider.js"

# 1c) public/ — REST-served static content during dev (the JSON
#     catalogue with translations + localized arrays). Will be moved
#     to a CDN later; the URL hard-coded in prototype.html is the
#     only consumer to update.
if [ -d "$SRC/public" ]; then
  mkdir -p "$OUT/public"
  rsync -a --delete --exclude='.DS_Store' "$SRC/public/" "$OUT/public/"
fi

# 2) images/ — mirror, dropping .DS_Store
mkdir -p "$OUT/images"
rsync -a --delete --exclude='.DS_Store' "$SRC/images/" "$OUT/images/"

# 3) flags/ — mirror, dropping .DS_Store and hashed Vite duplicates
#    (the kept files are the clean canonical SVGs the prototype refers to)
mkdir -p "$OUT/flags"
rsync -a --delete \
  --exclude='.DS_Store' \
  --exclude='*-*.svg' \
  "$SRC/flags/" "$OUT/flags/"

# 3b) audio/ — mirror.  The Listening screen pulls listening.mp3 from
#     this folder via a real <audio> element; same-origin GitHub Pages
#     serving avoids cross-origin / CORS issues for prototype playback.
if [ -d "$SRC/audio" ]; then
  mkdir -p "$OUT/audio"
  rsync -a --delete --exclude='.DS_Store' "$SRC/audio/" "$OUT/audio/"
fi

# 4) .nojekyll so GitHub Pages serves files literally
: > "$OUT/.nojekyll"

# 5) sanity: make sure every asset referenced from index.html resolves
python3 - <<'PY'
import re, os, urllib.parse, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parents[1] if False else pathlib.Path("docs")
# Above ternary is ignored — we always run from repo root.
ROOT = pathlib.Path("docs")
html = (ROOT / "index.html").read_text(encoding="utf-8")
patterns = [r'src="([^"#?]+)"', r'href="([^"#?]+)"', r'url\(["\']?([^"\'\)]+)["\']?\)']
refs = set()
for p in patterns:
    for m in re.finditer(p, html):
        v = m.group(1).strip()
        if v.startswith(("http://","https://","data:","mailto:","#","javascript:")) or v in ("","#"):
            continue
        refs.add(v)
# Files referenced by markup that are expected but not yet shipped.
# The build still emits a warning so they don't get forgotten, but it
# does not fail — keeps the prototype open while assets are being
# prepared. Add a path here when you wire markup to a name that is
# pending an asset upload.
EXPECTED_PENDING = {
    "images/honey.webp", "images/moon.webp", "images/chicken.webp",
    "images/tea.webp",
}
missing = [r for r in sorted(refs) if not (ROOT / urllib.parse.unquote(r)).is_file()]
hard_missing = [r for r in missing if r not in EXPECTED_PENDING]
soft_missing = [r for r in missing if r in EXPECTED_PENDING]
if hard_missing:
    print(f"✗ {len(hard_missing)} unresolved assets:", *hard_missing, sep="\n  ")
    sys.exit(1)
if soft_missing:
    print(f"⚠ {len(soft_missing)} pending assets (referenced but not yet in repo):",
          *soft_missing, sep="\n  ")
print(f"✓ {len(refs) - len(soft_missing)} assets resolve "
      f"({len(soft_missing)} pending)")
PY

echo "▸ docs/ ready ($(du -sh "$OUT" | cut -f1))"
echo "  index.html:     $(wc -c < "$OUT/index.html" | tr -d ' ') bytes"
echo "  images/:        $(find "$OUT/images" -type f | wc -l | tr -d ' ') files"
echo "  flags/:         $(find "$OUT/flags"  -type f | wc -l | tr -d ' ') files"
[ -d "$OUT/audio" ] && \
  echo "  audio/:         $(find "$OUT/audio" -type f | wc -l | tr -d ' ') files"
