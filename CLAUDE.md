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

This is a **Next.js 14 personal portfolio** site deployed on Vercel at `roshan.codes`. It is mostly statically generated (`getStaticProps`), with three server-side exceptions:

- `pages/feed.xml.js` — uses `getServerSideProps` to stream an Atom feed (20 newest posts) directly
- `pages/sitemap.xml.js` — same streaming pattern; emits 51 URLs (10 static routes + every post, tag, and series page) derived from `lib/posts-index` at request time, so new content needs no code change
- `pages/api/view/[slug].js` — edge-runtime Upstash Redis view counter

The `output: 'export'` option was intentionally removed from `next.config.js` to keep API routes and ISR alive on Vercel. All images are local assets under `public/` — blog media renders as plain `<img>`/`<video>` from relative paths, and profile/figure assets are static files in `public/`. `next/image` is not imported anywhere, so the `images` block in `next.config.js` (imgix `remotePatterns` + `unoptimized: true`) is currently inert.

### Content is data-driven — edit JSON, not JSX

Almost all site content lives in `data/`. For a quick-reference on adding content, see `data/ADDING_CONTENT.md`. The mapping:

| File | Drives |
|---|---|
| `data/site.json` | Owner name, resume URL, GitHub/LinkedIn, nav routes, footer links, ⌘K palette, console easter egg |
| `data/hero.json` | All 6 hero tile labels, Berkeley timezone config, sprint prefix, blog URL prefix |
| `data/research-footprints.json` | Globe dots on hero map; HemisphereBridge cards on research pages (only entries that declare `bridgeLabel`/`bridgeTitle`/`bridgeSub`) |
| `data/person.json` | schema.org `Person` JSON-LD emitted by `components/PersonSchema.jsx` on `/` and `/about` |
| `data/land-paths.json` | Landmass paths drawn on the hero globe (`DualGlobe`) |
| `data/featured-projects.json` | Homepage Featured Projects grid |
| `data/projects.json` | `/projects` page grid (`pages/projects.js`) |
| `data/publications.json` | Homepage Publications grid + Research Ledger hero tile |
| `data/impact.json` | Impact counter values, labels, and number formats |
| `data/tanzania/page.json` | Tanzania map style URL, initial view, layer defs, Nanja Dam coords/rings — **currently unread**; the map is unmounted from `/tanzania` |
| `data/tanzania/timelineEvents.js` | The 18 entries on `/tanzania`. `icon` and `mapView` fields are retained but unused (no `react-icons` dependency; no map to fly) |
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

`DualGlobe` renders a dot for each entry in `data/research-footprints.json` — adding a new research site means adding one JSON entry, with no component edits. It is a flat equirectangular SVG (`x = lng + 180`, `y = 90 - lat`), not two globes. Three sites are currently plotted: Tanzania (`--accent-warm`), Labrador Sea (`--accent-cool`), and Berkeley (`#4ade80`, the Statewide Database work, linking to `/projects`).

The same footprints file drives `HemisphereBridge` on the research pages, but that component **only renders entries that declare `bridgeTitle`** — a footprint meant just for the hero globe (no dedicated page) is skipped instead of rendering an empty card. `styles.bridge` is a fixed `1fr auto 1fr` grid built around exactly two cards flanking the divider, so promoting a third footprint to a bridge card requires a CSS change as well.

### Research Pages (Tanzania & Icebergs)

`/icebergs` uses **MapLibre GL** with `dynamic(() => import(...), { ssr: false })` — MapLibre requires `window` and cannot run server-side. Always keep map components in the SSR-disabled dynamic import boundary. It reads `data/icebergs/page.json` via `getStaticProps` and passes config slices as props to the map components.

#### `/tanzania` is a timeline only — the map is unmounted

As of the July 2026 rewrite, `pages/tanzania.js` renders a centered, single-column narrative timeline and nothing else. It is a plain static page: **no `getStaticProps`, no MapLibre, no map state.** `components/tanzania/Timeline.jsx` groups `data/tanzania/timelineEvents.js` under year headings and reveals entries on scroll via `IntersectionObserver`. The reveal is progressive enhancement — items are visible by default and only become animatable once the effect sets `data-reveal="ready"`, so the page still renders without JS or with `prefers-reduced-motion`.

The end of the timeline hands off to `https://map.roshan.codes` (hardcoded as `MAP_URL` in `pages/tanzania.js`).

> ⚠️ **Unresolved:** `map.roshan.codes` is a Vercel-dashboard alias that historically pointed at `/tanzania`. Until it is repointed at something that actually serves a map, that CTA loops back to this timeline. `pages/faq.js` still says the subdomain redirects to `/tanzania`.

**The map subsystem is retained but orphaned** — no page imports it. These files still work and are kept so the map can be restored or hosted separately; do not treat them as dead code to sweep:

| File | Status |
|---|---|
| `components/tanzania/TanzaniaMap.jsx` | orphaned (imports LayerChips + NanjaRings) |
| `components/tanzania/ScrollyRail.jsx` | orphaned — superseded by `Timeline.jsx` |
| `components/tanzania/UnitDrawer.jsx` | orphaned |
| `components/tanzania/LayerChips.jsx`, `NanjaRings.jsx` | used only by the orphaned `TanzaniaMap` |
| `data/tanzania/page.json` | orphaned (map style, layers, Nanja rings) |
| `@turf/circle` dependency | reachable only via `NanjaRings` |
| map/rail/drawer classes in `styles/tanzania.module.css` | retained above the `TIMELINE PAGE` section |

`maplibre-gl` is still a live dependency — `/icebergs` uses it.

Tanzania unit markers are no longer generated at build time. `public/tanzania/units.geojson` (75 units) and the 75 photos under `public/tanzania/photos/` are committed to git; run `node scripts/build-tanzania-data.mjs` to regenerate the geojson from photo filenames (`lat,lng[,unitId].jpg`).

The icebergs page displays Kalman-filter drift forecasts as covariance ellipses (`KalmanCone`). Data is currently mock JSON; `fetch-icespy.mjs` has commented-out real-pipeline fetch logic for when `ICESPY_RELEASE_URL` is set.

`HemisphereBridge` (used on both research pages) accepts a `currentSlug` prop and renders cards for all research footprints except the current page. Adding a third research site auto-populates the bridge on existing pages.

### Global Features (`pages/_app.js`)

- **⌘K command palette** — route list sourced from `data/site.json` routes array. When adding a new page, add it to `data/site.json`, not to `_app.js`.
- **Console manifest easter egg** — content sourced from `data/site.json` console fields.
- Vercel `<Analytics>` and `<SpeedInsights>` are injected in `_app.js` and individually on some pages (duplication is harmless).

### Machine discoverability (crawlers, LLMs, retrieval agents)

Four pieces, two hand-maintained and two generated:

| Path | Kind | Notes |
|---|---|---|
| `public/llms.txt` | **hand-written** | [llmstxt.org](https://llmstxt.org) format — H1, summary blockquote, prose bio, then link sections (`Research`, `Projects`, `Writing`, `Site`, `Optional`). **Drifts as content is added — update it when adding posts, projects, or publications.** |
| `public/robots.txt` | **hand-written** | Allows all crawlers, disallows `/api/`, names the major AI crawlers explicitly, and points at `/sitemap.xml`. Hardcodes the production domain. |
| `pages/sitemap.xml.js` | generated | Derived from `lib/posts-index` — self-maintaining. |
| `components/PersonSchema.jsx` | generated | schema.org `Person` JSON-LD from `data/person.json` + `data/site.json`, rendered on `/` and `/about`. `sameAs` must hold identity profiles only (not the source repo). |

`/` and `/about` also carry `rel="canonical"`, and `/` advertises the Atom feed via `rel="alternate"`. No Open Graph or Twitter Card tags exist anywhere yet.

Known data inconsistencies worth fixing when touching these: `data/site.json` `owner.linkedin` is `"roshantaneja"` but the real profile URL used in `footerLinks` (and in `person.json`) is `linkedin.com/in/roshan-taneja/`; and unit counts read 550 in `data/impact.json` + `data/featured-projects.json` but 500 in the `about.js` / `faq.js` prose.

### Styling

`styles/tokens.css` defines all CSS custom properties (dark-only palette). All pages use CSS Modules. The design system is dark-first with variables like `--bg-0`, `--fg-0`, `--accent`, `--motion-base`.

### Prose pages

`pages/about.js`, `pages/faq.js`, `pages/bench.js`, `pages/tty.js`, `pages/privacy.js`, and `pages/404.js` contain inline prose that changes rarely. They are intentionally left as JSX rather than data-driven.
