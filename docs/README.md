# LangArena Funnel — Public Build (`/docs`)

This folder is the **deployable static build** of the LangArena subscription
funnel prototype. It's set up to be served as-is by **GitHub Pages** (Settings
→ Pages → Source: `Deploy from a branch` → Branch: `main` → Folder: `/docs`).

Once published, the funnel is reachable at:

```
https://<your-github-username>.github.io/<repo-name>/
```

## What's inside

```
docs/
├── index.html        ← the entire funnel as one self-contained HTML file
├── images/           ← all photo, vector and Lottie JSON assets used by the funnel
└── .nojekyll         ← tells GitHub Pages to skip Jekyll processing
                       (required because some asset filenames contain spaces
                       and parens, e.g. "Sora Task 01 Image 0 (22) 1.webp")
```

## How it differs from `/preview`

`/preview` is the working copy used during development — it can contain
extra scratch files (other standalone HTMLs, `.DS_Store`, etc.). `/docs` is
a clean, deploy-ready snapshot:

* the prototype is renamed `prototype.html` → `index.html` so the funnel
  opens at the site root, not at `/prototype.html`
* macOS `.DS_Store` files are removed
* nothing else lives here that isn't needed at runtime

## Refreshing the build

When `preview/prototype.html` changes, regenerate `/docs` by re-running:

```bash
cp preview/prototype.html docs/index.html
rsync -a --delete --exclude='.DS_Store' preview/images/ docs/images/
```

(or use the project's regenerate script if/when one is added).

## Notes for stakeholders

* The prototype is **front-end-only / mock data**. No backend, no real
  payments, no real authentication.
* All copy in the UI is in English. The Russian italic note under the
  Dark / Light theme toggle on the welcome screen is a developer
  annotation — that toggle will not ship to production.
* Lottie animations and SVG masks are inlined as `data:` URLs so the
  build also works when opened directly via `file://` (i.e. without
  a local web server).
