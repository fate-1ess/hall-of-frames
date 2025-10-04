# Codegrid Project Directory

This repo hosts a searchable directory for every sub-project in the `Showcase` and `Templates` folders. The homepage lets you filter by collection, search by name, pivot by technology tags (HTML, Next.js, GSAP, etc.), and preview each project in a hover-activated iframe.

## Regenerating `projects.js`

Whenever you add, remove, or rename a project folder, regenerate the catalogue so the UI stays in sync:

```powershell
node scripts/generate-projects.js
```

The script crawls both top-level folders, detects technologies using lightweight heuristics (folder names, file extensions, `package.json` dependencies), and outputs:

- `projects.js`, the ESM module consumed directly by the front-end.
- `projects.json`, a plain data snapshot used by helper tooling.
## Generating static builds for framework projects

Pure HTML projects now load straight from their source directories (`Showcase/<slug>/index.html` or `Templates/<slug>/index.html`), so no extra build step is required. Framework-driven demos (Next.js, React/Vite, etc.) still need a production export so the directory can iframe them without a dev server. Use the automated builder:

```powershell
node scripts/build-projects.js
```

This script will:

1. Install dependencies (skipped when `node_modules` exists unless you pass `--force-install`).
2. Run the appropriate production build (`next build` + `next export`, `npm run build`, etc.).
3. Copy the exported HTML into `index-assets/<project-id>/`.
4. Regenerate `projects.js` so the UI points to the static snapshot when it exists.

You can target specific projects (`--project <id>`), skip installs, or clean the output folder with `--clean`. Projects that cannot export remain without a preview and will prompt you to run their dev server instead.

## Running the directory locally

Because the site fetches local content (iframe previews), serve the root folder over HTTP. Any static server works:

```powershell
npx http-server .
```

Then open the reported URL (defaults to <http://localhost:8080>) in your browser.

## Launching framework projects quickly

Each project card exposes two buttons:

- **Open project** — Jumps to the source folder on GitHub.
- **Open website** — Loads the live preview. It points at the exported snapshot (`index-assets/...`) when available, otherwise it falls back to the in-repo HTML entry point.

When a framework build is missing, the preview button stays disabled and the sidebar explains how to run it locally. Use the helper CLI to spin up a dev server quickly:

```powershell
node scripts/run-project.js <project-id>
```

Run `node scripts/run-project.js --list` to see every framework-backed project that was discovered, along with the inferred dev command and local URL. Pass `--install` the first time to auto-install dependencies when a `node_modules` folder is missing, or `--open` to auto-launch the browser once the server is up.

## Tech stack

- Vanilla HTML/CSS/JS UI with an accessible search + filtering experience.
- Auto-generated `projects.js` data source (no manual editing required).
- Hover previews rendered in lazy-loaded iframes for quick visual scanning.
- Helper CLIs (`scripts/run-project.js`, `scripts/build-projects.js`) to streamline dev-server launches and static builds.
## Updating tags

If you spot a recurring technology that is not detected automatically, add a keyword rule in `scripts/generate-projects.js`. Rerun the generator afterward to propagate the new tag across the UI.
