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

# 1) the main HTML, renamed so / serves the funnel
cp "$SRC/prototype.html" "$OUT/index.html"

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
missing = [r for r in sorted(refs) if not (ROOT / urllib.parse.unquote(r)).is_file()]
if missing:
    print(f"✗ {len(missing)} unresolved assets:", *missing, sep="\n  ")
    sys.exit(1)
print(f"✓ {len(refs)} assets all resolve")
PY

echo "▸ docs/ ready ($(du -sh "$OUT" | cut -f1))"
echo "  index.html:     $(wc -c < "$OUT/index.html" | tr -d ' ') bytes"
echo "  images/:        $(find "$OUT/images" -type f | wc -l | tr -d ' ') files"
echo "  flags/:         $(find "$OUT/flags"  -type f | wc -l | tr -d ' ') files"
