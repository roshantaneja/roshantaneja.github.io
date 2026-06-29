---
title: "Drawing Communities on a Map: Building a Redistricting Tool with deck.gl"
date: 06-29-2026
description: "Building drawmyca: a browser-based tool that lets ordinary residents paint census blocks to define their Communities of Interest for California redistricting."
category: Tech
tags:
  - tech
  - gis
  - data-engineering
  - web
---

Redistricting matters. Every ten years, the lines that define legislative districts get redrawn — and those lines determine whose voice carries weight in an election. California has been working to make that process more participatory, letting residents define their own Communities of Interest (COIs): groups of people who share common social, cultural, or economic interests and should be kept together when district lines are drawn.

The problem is tooling. Most redistricting software is built for GIS professionals. The interfaces are dense, the learning curve is steep, and the result is that ordinary people who actually know their neighborhoods are locked out of the process.

**drawmyca** is an attempt to fix that.

---

## What I'm Building

At its core, this is a map where you paint census blocks. You pick a tool — Pan, Box, Lasso, or Erase — and you draw your community. Blocks you select turn orange. That's it.

Under the hood, the prototype is built on deck.gl, a WebGL-based data visualization library from Uber that can render hundreds of thousands of polygons in a browser without breaking a sweat. The current dataset is all ~102,000 census blocks across Los Angeles and Ventura Counties, loaded from a single GeoJSON file built from U.S. Census Bureau TIGER shapefiles.

The stack:

- **Vite + React 19 + TypeScript** — fast iteration, strong types
- **deck.gl 9.3** — GPU-accelerated rendering of the block layer
- **MapLibre GL** — the basemap (CARTO Positron, no API key required)
- No backend. No database. No auth. Just a browser and a file.

---

## The Hard Part: Selection at Scale

The interesting engineering problem is selection. When you draw a region on screen, you need to know which of the 102,000 blocks fall inside it.

deck.gl has GPU-based picking built in, but it has a well-known limitation: sub-pixel polygons get silently dropped. Small blocks — the kind that exist in dense urban areas — simply disappear from hit testing. You'd select a neighborhood and silently miss half of it.

So I threw out GPU picking for region tools and replaced it with a precomputed spatial index of every block's centroid, bounding box, and exterior ring. At selection time, after drawing a region, the code:

1. Unprojects the screen gesture from CSS pixels into longitude/latitude
2. Runs a point-in-polygon test on each block's centroid
3. For blocks near the boundary, also tests every vertex of the block exterior
4. Uses the precomputed bounding boxes as a coarse filter to skip blocks that clearly can't overlap

This is synchronous and completes in well under a second even across 102k features, and gives correct results at every zoom level.

The precomputed data lives in a compact binary file (`centroids.bin`) generated at build time by a Node.js script that runs the same `computeCentroid` function the browser would use — so the precomputed values are guaranteed to match what live computation would produce.

---

## Why Blocks, Not Precincts?

Census blocks are the finest geographic unit the Census Bureau publishes. They're the atomic unit of redistricting: you can combine blocks into any district, but you can't split them further. Starting at block level makes the tool maximally flexible — a COI drawn here can be exported and analyzed at any coarser resolution.

The tradeoff is data volume. 102,000 polygons is a lot to push through a renderer. deck.gl handles it, but each selection update triggers a full color-accessor pass over every feature. A future path is GeoArrow or columnar geometry for incremental updates, but for an R&D prototype the current approach is fast enough to validate the concept.

---

## What's Next

This is explicitly a spike — a focused experiment to answer the question: *can you build a usable redistricting COI tool in a browser?* The answer so far is yes.

Phase B is real geometry: replacing the synthetic test data with statewide block data, validating that selection performance holds at California scale, and building the export layer so a drawn COI can produce something submissible to the California Citizens Redistricting Commission.

Further out: demographic overlays so residents can see who they're drawing alongside (currently the build strips everything except GEOID20), a submission workflow that connects a drawn community to the actual public comment process, and tighter UX so someone who has never used a GIS tool can pick it up in under a minute.

The goal is simple. A tool an organizer can hand to a resident, explain in thirty seconds, and trust that the resident will draw something that accurately represents their neighborhood.

---

*Stack: Vite · React 19 · TypeScript · deck.gl 9.3 · MapLibre GL · TIGER/Line shapefiles*
