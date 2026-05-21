/**
 * Backfill script: adds tags, category, series, seriesLabel to blog post frontmatter.
 *
 * - NEVER overwrites fields that already exist.
 * - Idempotent: re-running is a no-op.
 * - Uses the exact same heuristics that were in lib/posts-meta.js.
 *
 * Run: node scripts/backfill-frontmatter.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const blogDir = path.join(__dirname, '..', 'public', 'blog')

// ---- Heuristics (copied verbatim from lib/posts-meta.js) ----

const POETRY_PATTERNS = /sonnet|villanelle|limerick|haiku|ballad|ode|poem|verse/i
const TECH_PATTERNS = /water|vision|faces|dagster|timeline|react|map|harvesting/i
const FICTION_PATTERNS = /misanthrope|nightmare|dissolution|mold|mason|maywood|envelopes|self_in/i

function deriveCategory(slug, fmCategory) {
  if (fmCategory) {
    const c = fmCategory.toLowerCase()
    if (c === 'poetry' || c === 'poem') return 'Poetry'
    if (c === 'tech' || c === 'technology') return 'Tech'
    if (c === 'fiction') return 'Fiction'
    if (c === 'essay') return 'Essay'
  }
  if (POETRY_PATTERNS.test(slug)) return 'Poetry'
  if (TECH_PATTERNS.test(slug)) return 'Tech'
  if (FICTION_PATTERNS.test(slug)) return 'Fiction'
  return 'Essay'
}

function deriveTags(slug, title, category) {
  const tags = [category.toLowerCase()]
  const text = `${slug} ${title || ''}`.toLowerCase()

  if (/water|harvest|maasai|tanzania|boma/.test(text)) tags.push('water-vision')
  if (/dagster|pipeline|sensor|data/.test(text)) tags.push('data-engineering')
  if (/covid|pandemic|lockdown|isolation|zoom|shelter/.test(text)) tags.push('pandemic')
  if (/gatsby|fitzgerald|novel|film|luhrmann/.test(text)) tags.push('literature')
  if (/immigration|vietnamese|refugee/.test(text)) tags.push('history')
  if (/college|application|school|shis/.test(text)) tags.push('education')
  if (/timeline|tutorial/.test(text)) tags.push('tutorial')
  if (/map|satellite|geospatial/.test(text)) tags.push('geospatial')
  if (/nature|mold|walk|outdoor/.test(text)) tags.push('nature')
  if (/america|society|culture/.test(text)) tags.push('culture')

  return [...new Set(tags)]
}

function deriveSeries(slug) {
  if (/water.vision|faces.of.rainwater/.test(slug)) return 'water-vision'
  if (/sonnet|villanelle|limerick|haiku|ballad|ode/.test(slug)) return 'poetry-collection'
  return null
}

const SERIES_LABELS = {
  'water-vision': 'WaTER Vision Series',
  'poetry-collection': 'Poetry Collection',
}

// ---- Main ----

const files = fs.readdirSync(blogDir).filter((f) => f.endsWith('.md'))

for (const filename of files) {
  const filePath = path.join(blogDir, filename)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const parsed = matter(raw)
  const data = parsed.data

  const slug = filename.replace('.md', '')
  const added = []

  // Derive values (used only if field is missing)
  const derivedCategory = deriveCategory(slug, data.category)
  const derivedTags = deriveTags(slug, data.title || '', derivedCategory)
  const derivedSeries = deriveSeries(slug)

  // category
  if (data.category === undefined || data.category === null || data.category === '') {
    data.category = derivedCategory
    added.push(`category=${derivedCategory}`)
  }

  // tags — only set if missing
  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    // Re-derive using the (possibly just-set) category
    const categoryToUse = data.category
    const tagsToSet = deriveTags(slug, data.title || '', categoryToUse)
    data.tags = tagsToSet
    added.push(`tags=[${tagsToSet.join(', ')}]`)
  }

  // series
  if (data.series === undefined || data.series === null || data.series === '') {
    if (derivedSeries !== null) {
      data.series = derivedSeries
      added.push(`series=${derivedSeries}`)
    }
    // If no series, don't add the field at all — leave it absent
  }

  // seriesLabel — only set if series is set and label is missing
  if (data.series && (data.seriesLabel === undefined || data.seriesLabel === null || data.seriesLabel === '')) {
    const label = SERIES_LABELS[data.series] ?? data.series
    data.seriesLabel = label
    added.push(`seriesLabel=${label}`)
  }

  if (added.length > 0) {
    // Stringify back — lineWidth: -1 prevents wrapping long lines
    const newContent = matter.stringify(parsed.content, data, { lineWidth: -1 })
    fs.writeFileSync(filePath, newContent, 'utf-8')
    console.log(`[backfill] ${filename}: added ${added.join(', ')}`)
  } else {
    console.log(`[backfill] ${filename}: no changes (already complete)`)
  }
}

console.log(`\nDone. Processed ${files.length} files.`)
