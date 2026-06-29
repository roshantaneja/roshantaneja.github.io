# roshan.codes

[![CI](https://github.com/roshantaneja/roshantaneja.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/roshantaneja/roshantaneja.github.io/actions/workflows/ci.yml)

Personal portfolio — a Next.js 14 site deployed on Vercel at [roshan.codes](https://roshan.codes).

## Getting started

```bash
npm install
npm run dev      # dev server at localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint (next/core-web-vitals); passes clean, not enforced at build time
```

For the view counter, set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in `.env.local`. The site works fully without them — the counter just returns `null`.

## Architecture

Mostly statically generated. Almost all content is data-driven: edit JSON in `data/` and Markdown in `public/blog/` rather than JSX. See `data/ADDING_CONTENT.md` for the quick reference on adding content, and `CLAUDE.md` for the full architecture map (content table, blog system, hero deck, MapLibre research pages, global features).

## Maintenance

After any substantive change (adding/removing/renaming a page, component, dependency, data file, script, or feature), follow the post-change maintenance protocol: keep `CLAUDE.md`, `README.md`, and `data/ADDING_CONTENT.md` in sync with reality, sweep out whatever the change deprecated, and finish with a passing `npm run build`. The protocol — and the `claudemd-maintainer`, `docs-syncer`, and `rot-sweeper` subagents that carry it out — is documented in `CLAUDE.md` and `.claude/agents/`.
