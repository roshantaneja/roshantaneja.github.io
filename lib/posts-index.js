/**
 * Centralised post-reading utilities.
 * Single source for getAllPosts — replaces duplicated fs logic in page files.
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { readingTime } from './reading-time'

/**
 * Full metadata for a single post (slug + raw frontmatter).
 * Falls back to safe defaults when a field is absent from frontmatter.
 */
export function enrichPost(post) {
  return {
    ...post,
    category: post.category ?? 'Essay',
    recite: post.recite ?? (post.category === 'Poetry'),
    tags: post.tags ?? [],
    series: post.series ?? null,
    seriesLabel: post.seriesLabel ?? null,
  }
}

const blogDirectory = path.join(process.cwd(), 'public', 'blog')

/**
 * Read every .md file in public/blog/, enrich, and return sorted newest-first.
 */
export function getAllPosts() {
  const entries = fs.readdirSync(blogDirectory, { withFileTypes: true })
  const files = entries.filter((e) => e.isFile() && e.name.endsWith('.md'))

  const posts = files.map((f) => {
    const { data, content } = matter(
      fs.readFileSync(path.join(blogDirectory, f.name), 'utf-8')
    )
    return enrichPost({
      slug: f.name.replace('.md', ''),
      title: data.title ?? null,
      date: data.date ? String(data.date) : null,
      description: data.description ?? null,
      category: data.category ?? null,
      recite: data.recite ?? undefined,
      tags: Array.isArray(data.tags) ? data.tags : undefined,
      series: data.series ?? undefined,
      seriesLabel: data.seriesLabel ?? undefined,
      readingTime: readingTime(content),
    })
  })

  posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  return posts
}

/**
 * Collect all unique tag strings from all posts, sorted alphabetically.
 * @returns {string[]}
 */
export function getTagUniverse() {
  const posts = getAllPosts()
  const tagSet = new Set()
  for (const post of posts) {
    if (Array.isArray(post.tags)) {
      for (const t of post.tags) tagSet.add(t)
    }
  }
  return Array.from(tagSet).sort()
}

/**
 * Collect all unique series from all posts.
 * @returns {Array<{slug: string, label: string}>}
 */
export function getSeriesUniverse() {
  const posts = getAllPosts()
  const seen = new Map() // slug -> label
  for (const post of posts) {
    if (post.series && !seen.has(post.series)) {
      // Prefer seriesLabel from post; fall back to kebab-to-title-case
      const label =
        post.seriesLabel ??
        post.series
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')
      seen.set(post.series, label)
    }
  }
  return Array.from(seen.entries()).map(([slug, label]) => ({ slug, label }))
}

/**
 * Collect all unique category strings from all posts, sorted alphabetically.
 * @returns {string[]}
 */
export function getCategoryUniverse() {
  const posts = getAllPosts()
  const catSet = new Set()
  for (const post of posts) {
    if (post.category) catSet.add(post.category)
  }
  return Array.from(catSet).sort()
}
