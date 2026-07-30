/**
 * XML sitemap — served at /sitemap.xml
 *
 * Mirrors the pages/feed.xml.js pattern: getServerSideProps streams XML
 * directly, so no React component is ever rendered.
 *
 * URLs are derived at request time from lib/posts-index, which means new blog
 * posts, tags, and series appear here with no code change — same guarantee the
 * /tags/[tag] and /series/[series] routes give.
 *
 * Referenced by public/robots.txt.
 */
import siteData from '../data/site.json'
import {
  getAllPosts,
  getTagUniverse,
  getSeriesUniverse,
} from '../lib/posts-index'

const SITE_URL = siteData.urls.site

/** Routes with no data-derived lastmod. Excludes /404, /api/*, and the XML routes themselves. */
const STATIC_ROUTES = [
  '/',
  '/about',
  '/blog',
  '/projects',
  '/tanzania',
  '/icebergs',
  '/bench',
  '/faq',
  '/tty',
  '/privacy',
]

function xmlEscape(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Frontmatter dates are M-D-YYYY strings; return YYYY-MM-DD or null if unparseable. */
function isoDay(raw) {
  if (!raw) return null
  const d = new Date(raw)
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10)
}

/** Encode each path segment so future tags/series with odd characters stay valid. */
function urlFor(pathname) {
  const encoded = pathname
    .split('/')
    .map((seg) => encodeURIComponent(seg))
    .join('/')
  return `${SITE_URL}${encoded}`
}

function urlEntry(loc, lastmod) {
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function getServerSideProps({ res }) {
  const posts = getAllPosts()

  // Newest post date doubles as lastmod for the blog index.
  const newestPostDay = posts.map((p) => isoDay(p.date)).find(Boolean) ?? null

  const entries = [
    // Static pages
    ...STATIC_ROUTES.map((route) =>
      urlEntry(urlFor(route), route === '/blog' ? newestPostDay : null)
    ),

    // One entry per blog post, lastmod from frontmatter
    ...posts.map((p) => urlEntry(urlFor(`/blog/${p.slug}`), isoDay(p.date))),

    // Tag pages — lastmod is the newest post carrying that tag
    ...getTagUniverse().map((tag) => {
      const newest = posts
        .filter((p) => Array.isArray(p.tags) && p.tags.includes(tag))
        .map((p) => isoDay(p.date))
        .find(Boolean)
      return urlEntry(urlFor(`/tags/${tag}`), newest ?? null)
    }),

    // Series pages — lastmod is the newest post in that series
    ...getSeriesUniverse().map(({ slug }) => {
      const newest = posts
        .filter((p) => p.series === slug)
        .map((p) => isoDay(p.date))
        .find(Boolean)
      return urlEntry(urlFor(`/series/${slug}`), newest ?? null)
    }),
  ]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

// Next.js requires a default export even for server-only routes
export default function Sitemap() {
  return null
}
