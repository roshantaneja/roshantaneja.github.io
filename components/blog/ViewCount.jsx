import { useEffect, useState } from 'react'
import { incrementViews } from '../../lib/views'

/**
 * Increments and displays the view count for a blog post.
 * Fires a POST to /api/view/[slug] on mount (server dedupes by IP+day).
 * Gracefully renders nothing if the API returns null.
 *
 * @param {object} props
 * @param {string} props.slug  Post slug
 */
export default function ViewCount({ slug }) {
  const [views, setViews] = useState(null)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    incrementViews(slug).then(({ views: v }) => {
      if (!cancelled) setViews(v)
    })
    return () => {
      cancelled = true
    }
  }, [slug])

  if (views === null) return null

  return (
    <span aria-label={`${views} views`}>
      {views.toLocaleString()} {views === 1 ? 'view' : 'views'}
    </span>
  )
}
