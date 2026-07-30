# Site content quick-reference

## New blog post

Create `public/blog/N_slug-title.md` where N is the next integer in sequence (sets sort order).

Required frontmatter:

```yaml
---
title: "Your Post Title"
date: "2026-05-21"
description: "One-sentence summary shown in blog listing."
category: "Tech"          # one of: Tech, Poetry, Essay, Fiction
tags:
  - some-tag
  - another-tag
---
```

Optional frontmatter: `series: "series-slug"`, `seriesLabel: "Human Label"`, `recite: true` (enables recite cursor for poetry). Tag and series pages are auto-generated at build time — no code changes needed.

## New publication

Add an entry to `data/publications.json`:

```json
{
  "award": "Best Paper",
  "category": "Conference",
  "href": "https://...",
  "title": "Paper Title",
  "bullets": ["Key finding one", "Key finding two"]
}
```

Appears on the homepage Publications grid and Research Ledger tile automatically.

## New featured project

Add to `data/featured-projects.json`:

```json
{ "href": "https://...", "title": "Project Name", "blurb": "One-line description.", "external": true }
```

## New /projects entry

Add to `data/projects.json` (drives the `/projects` grid):

```json
{
  "slug": "my-project",
  "name": "My Project",
  "pitch": "One-line description of what it does.",
  "role": "built solo",
  "stack": ["nextjs", "python"],
  "tags": ["web"],
  "github": "user/repo",
  "stars": null,
  "lastPush": null
}
```

## New research site

Add to `data/research-footprints.json`:

```json
{
  "slug": "my-site",
  "label": "Display Label",
  "lat": 0.0,
  "lng": 0.0,
  "color": "#hex",
  "href": "/my-site",
  "bridgeLabel": "Eyebrow Text",
  "bridgeTitle": "Card Headline",
  "bridgeSub": "Instrument · Region"
}
```

A dot appears on the homepage globe and a card appears in HemisphereBridge on all other research pages automatically. Then create `pages/my-site.js` for the actual page and pass `currentSlug="my-site"` to `<HemisphereBridge>`.

**Globe dot only (no dedicated page).** Omit the three `bridge*` fields and point `href` at an existing route. HemisphereBridge skips entries without `bridgeTitle`, so you get the dot without an empty card — this is how the Berkeley / Statewide Database footprint works:

```json
{
  "slug": "statewide-database",
  "label": "Berkeley, CA",
  "lat": 37.8724,
  "lng": -122.2595,
  "color": "#4ade80",
  "href": "/projects"
}
```

Pick a `color` distinct from the ones already in use (`#ff7849`, `#7dd3fc`, `#4ade80`). Note that `styles.bridge` is a fixed `1fr auto 1fr` grid built for exactly two cards flanking the divider, so adding a **third** full bridge entry needs a CSS change in `styles/icebergs.module.css` too.

## Update the machine-readable summary (`public/llms.txt`)

`public/llms.txt` is **hand-written** and will drift. After adding a post, project, or publication, add the matching line to the relevant section (`Research`, `Projects`, `Writing`, `Site`, or `Optional`). Rules: absolute `https://roshan.codes/...` URLs, blog slugs keep their numeric prefix (`/blog/23_dagster_drop_and_walk_away`), percent-encode spaces, and every section body must be a bullet list of links — prose only goes in the intro block below the blockquote.

`public/robots.txt` is also hand-written but rarely needs edits. `/sitemap.xml` and the `Person` JSON-LD regenerate themselves; no action needed.

## Change sprint label

Edit the single line in `data/sprint.md`.

## Change site metadata (name, URLs, social links, routes)

Edit `data/site.json`.

## Change homepage hero tile labels or copy

Edit `data/hero.json`.

## Change impact counter values

Edit `data/impact.json`. Top-level values: `units`, `people`, `raised_usd`. The `counters` array maps each value `key` to its `label` and number `format`.

## After making changes

After any substantive content or code change, keep the repo coherent: follow the **Post-change maintenance protocol** in `CLAUDE.md`. In short, spawn the maintenance subagents defined in `.claude/agents/` — `claudemd-maintainer` (sync `CLAUDE.md`), `docs-syncer` (sync `README.md`, this file, inline docs), and `rot-sweeper` (remove deprecated deps/files/exports) — or carry out the same responsibilities inline, then finish with a successful `npm run build`.
