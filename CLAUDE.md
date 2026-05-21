# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run lint     # ESLint (Next.js preset; errors are ignored during builds — see next.config.js)
```

No test suite exists. Lint is not enforced at build time (`eslint.ignoreDuringBuilds: true`).

Build-time data scripts (run manually when source data changes):
```bash
node scripts/build-tanzania-data.mjs   # Regenerate public/tanzania/units.geojson from photo filenames
node scripts/fetch-icespy.mjs          # Validate iceberg mock data files exist in public/data/icebergs/
```

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

The `output: 'export'` option was intentionally removed from `next.config.js` to keep API routes and ISR alive on Vercel. Images are served unoptimized from `daroshi11260.imgix.net`.

### Content is data-driven — edit JSON, not JSX

Almost all site content lives in `data/`. For a quick-reference on adding content, see `data/ADDING_CONTENT.md`. The mapping:

| File | Drives |
|---|---|
| `data/site.json` | Owner name, resume URL, GitHub/LinkedIn, nav routes, footer links, ⌘K palette, console easter egg |
| `data/hero.json` | All 6 hero tile labels, Berkeley timezone config, sprint prefix, blog URL prefix |
| `data/research-footprints.json` | Globe dots on hero map, HemisphereBridge cards on research pages |
| `data/featured-projects.json` | Homepage Featured Projects grid |
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

The Tanzania page is a scrollytelling experience using `scrollama`. `ScrollyRail` drives `activeEventIndex` which flies the map to coordinates defined in `data/tanzania/timelineEvents.js`.

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
