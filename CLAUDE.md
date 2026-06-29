# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint (next/core-web-vitals via .eslintrc.json) — runs clean
```

No test suite exists. `npm run lint` works (an `.eslintrc.json` extending `next/core-web-vitals` exists) and passes clean — 0 errors, with one accepted warning suggesting `next/image` in `components/tanzania/UnitDrawer.jsx`. Builds still do not block on lint (`eslint.ignoreDuringBuilds: true` in `next.config.js`), so lint is a real, passing, non-build-blocking check.

Build-time data scripts (run manually when source data changes):
```bash
node scripts/build-tanzania-data.mjs   # Regenerate public/tanzania/units.geojson from public/tanzania/photos/ filenames
node scripts/fetch-icespy.mjs          # Validate iceberg mock data files exist in public/data/icebergs/
```

## Post-change maintenance protocol

After completing any substantive change (adding/removing/renaming a page, component, dependency, data file, script, or feature), spawn maintenance subagents to keep the repo coherent. Run **rot-sweeper first** (it changes code), then **claudemd-maintainer** and **docs-syncer** — those two own disjoint files and can run in parallel — to document the settled state:

1. **rot-sweeper** — find and remove whatever the change deprecated: now-unused dependencies, orphaned files/components/styles, dead exports, stale config/scripts. It verifies references across ALL file types (`.js`/`.jsx`/`.ts`/`.tsx`/`.css`/`.json`/`.mjs` + `package-lock`) and confirms `npm run build` passes before declaring done; it surfaces untracked/unrecoverable or load-bearing deletions for human confirmation instead of auto-deleting.
2. **claudemd-maintainer** — re-read the changed files and update `CLAUDE.md` so every claim (file inventory, the data-driven table, architecture notes, commands) matches reality.
3. **docs-syncer** — update `README.md`, `data/ADDING_CONTENT.md`, and any affected code comments/inline docs.

Invoke them via the Agent tool with `subagent_type` set to those names (definitions live in `.claude/agents/`), or carry out the same three responsibilities inline. Always finish with a successful `npm run build`.

## Environment Variables

Needed in `.env.local` for the view counter to function:
```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Without these the view counter silently returns `null` — the site works fully otherwise.

**The `.env.local` currently contains an OpenAI API key that does not appear to be used anywhere in the codebase. Audit before committing.**

## Architecture

This is a **Next.js 14 personal portfolio** site deployed on Vercel at `roshan.codes`. It is mostly statically generated (`getStaticProps`), with two server-side exceptions:

- `pages/feed.xml.js` — uses `getServerSideProps` to stream XML directly
- `pages/api/view/[slug].js` — edge-runtime Upstash Redis view counter

The `output: 'export'` option was intentionally removed from `next.config.js` to keep API routes and ISR alive on Vercel. All images are local assets under `public/` — blog media renders as plain `<img>`/`<video>` from relative paths, and profile/figure assets are static files in `public/`. `next/image` is not imported anywhere, so the `images` block in `next.config.js` (imgix `remotePatterns` + `unoptimized: true`) is currently inert.

### Content is data-driven — edit JSON, not JSX

Almost all site content lives in `data/`. For a quick-reference on adding content, see `data/ADDING_CONTENT.md`. The mapping:

| File | Drives |
|---|---|
| `data/site.json` | Owner name, resume URL, GitHub/LinkedIn, nav routes, footer links, ⌘K palette, console easter egg |
| `data/hero.json` | All 6 hero tile labels, Berkeley timezone config, sprint prefix, blog URL prefix |
| `data/research-footprints.json` | Globe dots on hero map, HemisphereBridge cards on research pages |
| `data/land-paths.json` | Landmass paths drawn on the hero globe (`DualGlobe`) |
| `data/featured-projects.json` | Homepage Featured Projects grid |
| `data/projects.json` | `/projects` page grid (`pages/projects.js`) |
| `data/publications.json` | Homepage Publications grid + Research Ledger hero tile |
| `data/impact.json` | Impact counter values, labels, and number formats |
| `data/tanzania/page.json` | Tanzania map style URL, initial view, layer defs, Nanja Dam coords/rings |
| `data/icebergs/page.json` | Icebergs map config, hero copy, stat labels, legend entries |
| `data/sprint.md` | Single-line sprint label shown in the clock tile |
| `data/footerPoems.json` | Footer poem rotation lines (shared by Footer.js and tty.js) |
| `public/blog/*.md` | All blog routes — parsed with `gray-matter` at build time |

### Blog System

Blog posts are Markdown files in `public/blog/` named with a numeric prefix (`23_dagster_drop_and_walk_away.md`). The number determines sort order.

Required frontmatter: `title`, `date`, `description`, `category` (one of: Tech, Poetry, Essay, Fiction), `tags` (YAML list). Optional: `series`, `seriesLabel`, `recite`.

**`lib/posts-index.js`** is the single source of truth for blog data at build time. It exports:
- `getAllPosts()` — reads all `.md` files, enriches, sorts newest-first
- `getTagUniverse()` — all unique tags derived from post frontmatter
- `getSeriesUniverse()` — all unique series as `{slug, label}[]`
- `getCategoryUniverse()` — all unique category strings

Tag and series pages (`/tags/[tag]`, `/series/[series]`) are generated dynamically from `getTagUniverse()` / `getSeriesUniverse()` in `getStaticPaths` — **no code change needed when adding new tags or series**. Just write the frontmatter.

`lib/related.js` scores related posts: +2 same category, +1 per shared tag, tiebroken by recency.

Blog posts render YouTube links as embedded iframes and `.mp4` image srcs as `<video>` elements (handled in the `ReactMarkdown` component overrides in `pages/blog/[slug].js`).

### Hero Section

`MissionControl` renders a 6-tile telemetry deck on the homepage. Each tile is a standalone component under `components/hero/`. Tiles collapse gracefully when data is unavailable (e.g. `GithubActivity` hides when `activity === null`).

`DualGlobe` renders a dot for each entry in `data/research-footprints.json` — adding a new research site means adding one JSON entry, with no component edits. Same footprints file drives `HemisphereBridge` on the research pages.

### Research Pages (Tanzania & Icebergs)

Both `/tanzania` and `/icebergs` use **MapLibre GL** with `dynamic(() => import(...), { ssr: false })` — MapLibre requires `window` and cannot run server-side. Always keep map components in the SSR-disabled dynamic import boundary.

Each page reads its own `page.json` via `getStaticProps` and passes config slices as props to map components. Map style URLs, initial view, colors, and layer definitions all come from these JSON files.

The Tanzania page is a click/keyboard-driven timeline experience. `ScrollyRail` is a rail of timeline events (no scroll-step `IntersectionObserver`); clicking or pressing Enter/Space on an event sets `activeEventIndex`, which flies the map to coordinates defined in `data/tanzania/timelineEvents.js` and scrolls the active rail item into view via `scrollIntoView`.

Tanzania unit markers are derived at build time: `getStaticProps` in `pages/tanzania.js` reads photo filenames (`lat,lng[,unitId].jpg`) from `public/tanzania/photos/` and writes `public/tanzania/units.geojson` (75 units) as a side effect; the photos are served at `/tanzania/photos/<filename>` by `UnitDrawer.jsx`. `scripts/build-tanzania-data.mjs` performs the same regeneration standalone.

The icebergs page displays Kalman-filter drift forecasts as covariance ellipses (`KalmanCone`). Data is currently mock JSON; `fetch-icespy.mjs` has commented-out real-pipeline fetch logic for when `ICESPY_RELEASE_URL` is set.

`HemisphereBridge` (used on both research pages) accepts a `currentSlug` prop and renders cards for all research footprints except the current page. Adding a third research site auto-populates the bridge on existing pages.

### Global Features (`pages/_app.js`)

- **⌘K command palette** — route list sourced from `data/site.json` routes array. When adding a new page, add it to `data/site.json`, not to `_app.js`.
- **Console manifest easter egg** — content sourced from `data/site.json` console fields.
- Vercel `<Analytics>` and `<SpeedInsights>` are injected in `_app.js` and individually on some pages (duplication is harmless).

### Styling

`styles/tokens.css` defines all CSS custom properties (dark-only palette). All pages use CSS Modules. The design system is dark-first with variables like `--bg-0`, `--fg-0`, `--accent`, `--motion-base`.

### Prose pages

`pages/about.js`, `pages/faq.js`, `pages/bench.js`, `pages/tty.js`, `pages/privacy.js`, and `pages/404.js` contain inline prose that changes rarely. They are intentionally left as JSX rather than data-driven.
