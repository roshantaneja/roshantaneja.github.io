/**
 * Estimate reading time for a markdown content string.
 * Average reading speed: 200 words per minute.
 */
export function readingTime(content) {
  if (!content || typeof content !== 'string') return '1 min read'
  const words = content
    .replace(/[^a-zA-Z\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / 200))
  return `${minutes} min read`
}
