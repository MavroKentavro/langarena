# LangArena Funnel

Web conversion funnel for the LangArena English-learning mobile app
(TOEFL / IELTS preparation). Iteration 1 — front-end only, mocked
data, no backend.

> **Live preview:** see [`DEPLOY.md`](./DEPLOY.md) for the GitHub
> Pages URL once published from `/docs`.

## Repo layout

```
preview/prototype.html   # ⭐ source of truth — the entire funnel as one self-contained HTML file
preview/images/          #   webp / svg / Lottie JSON used by the funnel
preview/flags/           #   20 language flags (SVG)

docs/                    # 🚀 publishable build for GitHub Pages (mirror of preview, with index.html)
docs/index.html          #   = preview/prototype.html (renamed)
docs/images/             #   = preview/images/
docs/flags/              #   = preview/flags/  (no hashed duplicates)
docs/.nojekyll           #   tells GitHub Pages to skip Jekyll processing

scripts/build-docs.sh    # 🔁 one-shot rebuild of docs/ from preview/

src/                     # early React + Vite scaffold from the start of iteration 1
                         # (NOT the funnel that's published — kept for future iteration 2)
public/, package.json,
vite.config.ts, …        # Vite tooling for the React side; not used by docs/
```

The published funnel is a **single self-contained HTML file** —
inlined Lottie JSON, inlined SVG masks, relative image paths. No
build step, no bundler, no runtime fetches that can fail.

## Working on the prototype

Edit [`preview/prototype.html`](./preview/prototype.html) directly.
Open it in any browser (file:// works because all Lottie / mask data
is inlined). When ready to publish:

```bash
./scripts/build-docs.sh
```

That single command refreshes `docs/` and verifies every `<img src>`,
`<a href>` and `url(...)` reference resolves.

Then commit & push:

```bash
git add docs preview
git commit -m "Refresh prototype + docs"
git push
```

GitHub Pages picks up changes within ~30 seconds.

## Publishing to GitHub Pages

See [`DEPLOY.md`](./DEPLOY.md). Short version:

1. Push the repo to GitHub.
2. **Settings → Pages → Source:** `Deploy from a branch` →
   **Branch:** `main` → **Folder:** `/docs` → Save.
3. The funnel is live at `https://<user>.github.io/<repo>/`.

## Iteration-1 scope

- Mocked data only, local UI state, no persistence.
- Language selector is interactive but all interface copy stays in
  English regardless of selection.
- Name is kept in memory for UI personalization only — not sent
  anywhere, not persisted.
- Assessment screens (Reading / Listening / Speaking / Writing) and
  the post-Writing personalization flow record answers in local
  state only.
- Paywall is UI-only — "Get My Plan" loops back to the welcome
  screen and does not process a purchase.

## Readiness for future iterations

- **Backend / persistence** — the funnel keeps all state in a single
  `state` object inside the prototype's `<script>`; replace with an
  API client when iteration 2 lands.
- **Localization** — UI copy lives in plain HTML strings; route them
  through a translation layer once the locale switch is real.
- **Real assessment scoring** — the four test screens currently
  surface mock progress; wire them to a scoring service.
- **Payments** — the `paywallCta` button has the single click hook
  for the real purchase flow.
- **Theming** — both light and dark token sets ship; the toggle on
  the welcome screen is a temporary demo control (the Russian
  `themeSwitch__note` next to it explains this — it'll be removed
  before production).

## Known design flags (surface to design / product)

- Figma's `Background/success` token doesn't exist in the project's
  CSS variables — the green check on the comparison table uses
  `--color-text-success` (`#248a3d` light / `#30db5b` dark) as the
  closest valid green. Swap when the surface token lands.
- Comparison-table copy on the paywall has been verified against
  the screenshot Alexey provided (Apr 2026). Re-verify if Figma
  later diverges.
- The personalization flow's progress checkpoint at `qNoProgress`
  is `70 %` per spec; Figma node `6272:5896` shows `75 %` for the
  same screen — following the spec, flagged for review.
- A `cross.svg` for the `Tutor` column in the comparison table
  doesn't exist in the repo; the cross is rendered as inline SVG
  to match the design's red glyph. Drop a real `cross.svg` into
  `preview/images/` if/when it's exported and we'll wire it.
