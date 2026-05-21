/**
 * Client-side utilities for the view counter.
 * The actual counting happens in pages/api/view/[slug].js.
 */

/**
 * Increment the view count for a slug (POST).
 * Resolves to { views: number | null }.
 * Silently fails if the API is unavailable.
 */
export async function incrementViews(slug) {
  try {
    const res = await fetch(`/api/view/${slug}`, { method: 'POST' })
    if (!res.ok) return { views: null }
    return res.json()
  } catch {
    return { views: null }
  }
}

/**
 * Fetch the current view count for a slug (GET).
 * Resolves to { views: number | null }.
 */
export async function fetchViews(slug) {
  try {
    const res = await fetch(`/api/view/${slug}`)
    if (!res.ok) return { views: null }
    return res.json()
  } catch {
    return { views: null }
  }
}
