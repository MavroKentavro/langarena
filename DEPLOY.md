# Deploying the prototype to GitHub Pages

The repo is structured so the static build lives in **`/docs`** at the repo
root. GitHub Pages can serve that directory directly — no Vite build, no
GitHub Action, nothing to install.

## One-time setup (≈ 2 minutes)

1. Create a new GitHub repository (private or public, both work).
2. From the project root, push the codebase:

    ```bash
    git init
    git add .
    git commit -m "Initial commit — funnel prototype"
    git branch -M main
    git remote add origin git@github.com:<username>/<repo>.git
    git push -u origin main
    ```

3. On GitHub: open the repo → **Settings → Pages**.
4. Under **Build and deployment**:

   * **Source**: `Deploy from a branch`
   * **Branch**: `main`
   * **Folder**: `/docs`  ← preferred, serves the funnel directly
     OR
   * **Folder**: `/ (root)` ← also works; the root `index.html` is a
     redirect to `./docs/index.html` so visiting the site URL still
     opens the funnel.

5. Click **Save**. Within 30–60 seconds the prototype goes live at:

    ```
    https://<username>.github.io/<repo>/
    ```

   GitHub will print the exact URL on the same Settings → Pages page.

That URL is shareable — works on mobile, persistent, HTTPS by default.

### Either Pages source works

The repo is set up so both Pages source options route to the funnel:

* **`/docs`** — `https://<user>.github.io/<repo>/` serves
  `docs/index.html` directly. Cleaner URL (no extra hop). This is the
  preferred mode.
* **`/` (root)** — `https://<user>.github.io/<repo>/` first loads the
  root `index.html`, which is a one-line meta-refresh + JS redirect
  to `./docs/index.html`. The user lands on the funnel; the URL bar
  ends with `/docs/index.html` rather than the bare repo URL, but the
  experience is identical.

Pick `/docs` if you want the cleaner URL; pick `/` if your repo has
other stuff at root that should also be Pages-served.

## Updating the published prototype

Whenever `preview/prototype.html` changes, refresh `docs/` and push:

```bash
cp preview/prototype.html docs/index.html
rsync -a --delete --exclude='.DS_Store' preview/images/ docs/images/
git add docs
git commit -m "Refresh docs build"
git push
```

GitHub Pages picks up the change automatically.

## Why `/docs` and not the React app build?

The Vite + React skeleton in `/src` was scaffolded early in iteration 1
but isn't the source of truth for the funnel — the active prototype is the
single self-contained `preview/prototype.html`. `/docs` is just a clean
copy of that file (renamed `index.html`) plus its `images/` assets. No
build step, no toolchain, no risk of a broken bundle in front of stakeholders.

When the React app catches up (iteration 2+), we can switch the deploy
source to a Vite build output — until then, the `/docs` static copy is
the simpler and more honest target.

## Alternatives if you ever need them

* **Drag-and-drop without git** → upload the `docs/` folder to
  [Netlify Drop](https://app.netlify.com/drop). No account required for
  a one-shot share; the URL stays live for ~24 hours unless you sign in.
* **Custom domain on GitHub Pages** → add a `CNAME` file inside `/docs`
  containing your domain name, then point a DNS record at
  `<username>.github.io`.
