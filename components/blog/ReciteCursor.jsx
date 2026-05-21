import { useEffect, useRef, useState } from 'react'

/**
 * Renders a thin 2px underline that tracks the paragraph nearest
 * to 42% of the viewport height — the "active reading line" for poetry.
 *
 * @param {object}                    props
 * @param {React.RefObject<Element>}  props.contentRef  ref to the prose container
 * @param {boolean}                   props.enabled     true only for recite posts
 */
export default function ReciteCursor({ contentRef, enabled }) {
  const [lineRect, setLineRect] = useState(null)
  const tickingRef = useRef(false)

  useEffect(() => {
    if (!enabled || !contentRef?.current) return

    const findActiveLine = () => {
      if (!contentRef.current) return
      const paras = Array.from(contentRef.current.querySelectorAll('p'))
      if (!paras.length) return

      const target = window.innerHeight * 0.42
      let closest = null
      let minDist = Infinity

      for (const p of paras) {
        const rect = p.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const dist = Math.abs(center - target)
        if (dist < minDist) {
          minDist = dist
          closest = rect
        }
      }

      if (closest) {
        setLineRect({
          left: closest.left,
          bottom: closest.bottom,
          width: closest.width,
        })
      }
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(() => {
          findActiveLine()
          tickingRef.current = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    findActiveLine()
    return () => window.removeEventListener('scroll', onScroll)
  }, [enabled, contentRef])

  if (!enabled || !lineRect) return null

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: lineRect.left,
        top: lineRect.bottom - 2,
        width: lineRect.width,
        height: '2px',
        background: 'var(--accent)',
        opacity: 0.6,
        transition:
          'top var(--motion-base) var(--ease-out), left var(--motion-base) var(--ease-out), width var(--motion-base) var(--ease-out)',
        pointerEvents: 'none',
        zIndex: 100,
        borderRadius: '1px',
      }}
    />
  )
}
