/**
 * Atom feed — served at /feed.xml
 *
 * Uses getServerSideProps to stream XML directly (no React component rendered).
 * Works in standard Next.js deployments (not static export).
 */
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import siteData from '../data/site.json'
import { getAllPosts } from '../lib/posts-index'

const SITE_URL = siteData.urls.site
const AUTHOR_NAME = siteData.owner.name

function safeDate(raw) {
  if (!raw) return new Date().toISOString()
  const d = new Date(raw)
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function xmlEscape(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function getServerSideProps({ res }) {
  const dir = path.join(process.cwd(), 'public', 'blog')
  const allPosts = getAllPosts().slice(0, 20)

  // Build content excerpt for each post (not available from getAllPosts — read content here)
  const posts = allPosts.map((p) => {
    try {
      const { content } = matter(
        fs.readFileSync(path.join(dir, `${p.slug}.md`), 'utf-8')
      )
      return {
        ...p,
        excerpt: content.replace(/^#.*\n/gm, '').trim().slice(0, 300),
      }
    } catch {
      return { ...p, excerpt: '' }
    }
  })

  const now = new Date().toISOString()

  const entries = posts
    .map((p) => {
      const categoryTags = Array.isArray(p.tags)
        ? p.tags.map((t) => `    <category term="${xmlEscape(t)}"/>`).join('\n')
        : ''
      return `  <entry>
    <title><![CDATA[${p.title ?? p.slug}]]></title>
    <link href="${SITE_URL}/blog/${p.slug}"/>
    <id>${SITE_URL}/blog/${p.slug}</id>
    <updated>${safeDate(p.date)}</updated>
    <author><name>${xmlEscape(AUTHOR_NAME)}</name></author>
    <summary><![CDATA[${p.description ?? ''}]]></summary>
${categoryTags}
  </entry>`
    })
    .join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${xmlEscape(AUTHOR_NAME)}</title>
  <subtitle>Writing on tech, poetry, and everything in between.</subtitle>
  <link href="${SITE_URL}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${SITE_URL}" rel="alternate" type="text/html"/>
  <updated>${now}</updated>
  <id>${SITE_URL}/</id>
  <author><name>${xmlEscape(AUTHOR_NAME)}</name></author>
${entries}
</feed>`

  res.setHeader('Content-Type', 'application/atom+xml; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  res.write(feed)
  res.end()

  return { props: {} }
}

// Next.js requires a default export even for server-only routes
export default function Feed() {
  return null
}
