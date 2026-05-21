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

Appears on the homepage Research Ledger tile and the /projects page automatically.

## New featured project

Add to `data/featured-projects.json`:

```json
{ "href": "https://...", "title": "Project Name", "blurb": "One-line description.", "external": true }
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

## Change sprint label

Edit the single line in `data/sprint.md`.

## Change site metadata (name, URLs, social links, routes)

Edit `data/site.json`.

## Change homepage hero tile labels or copy

Edit `data/hero.json`.

## Change impact counter values

Edit `data/impact.json`. Fields: `units`, `countries`, `students`, `papers`.
