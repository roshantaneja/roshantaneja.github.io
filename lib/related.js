/**
 * Return up to `count` related posts for a given slug.
 * Scoring: +2 for same category, +1 for each shared tag.
 * Ties broken by recency.
 */
export function getRelated(currentSlug, allPosts, count = 3) {
  const current = allPosts.find((p) => p.slug === currentSlug)
  if (!current) return []

  return allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((p) => {
      let score = 0
      if (p.category && p.category === current.category) score += 2
      if (Array.isArray(p.tags) && Array.isArray(current.tags)) {
        for (const tag of p.tags) {
          if (current.tags.includes(tag)) score += 1
        }
      }
      return { ...p, _score: score }
    })
    .sort(
      (a, b) =>
        b._score - a._score || new Date(b.date || 0) - new Date(a.date || 0)
    )
    .slice(0, count)
    .map(({ _score, ...p }) => p)
}
