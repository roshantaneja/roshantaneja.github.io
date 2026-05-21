import { useMemo } from 'react'
import { generateCoverSVG } from '../../lib/cover'

/**
 * Renders a deterministic lattice cover SVG for a post title.
 *
 * @param {object}  props
 * @param {string}  props.title     Post title used as the hash seed
 * @param {number}  [props.size]    Pixel dimensions (default: 64)
 * @param {boolean} [props.slice]   If true, use preserveAspectRatio="xMidYMid slice"
 *                                  for full-bleed banner usage
 * @param {string}  [props.className]
 */
export default function CoverGlyph({ title, size = 64, slice = false, className }) {
  const svg = useMemo(
    () =>
      generateCoverSVG(title || 'untitled', size, {
        preserveAspectRatio: slice ? 'xMidYMid slice' : 'xMidYMid meet',
      }),
    [title, size, slice]
  )
  return (
    <div
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
      aria-hidden="true"
      style={{ flexShrink: 0, lineHeight: 0 }}
    />
  )
}
