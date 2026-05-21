import { useEffect, useState, useRef } from 'react'

/**
 * Thin progress bar fixed at the very top of the viewport
 * that fills as the user scrolls through the article.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const tickingRef = useRef(false)

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total =
        document.documentElement.scrollHeight - window.innerHeight
      const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0
      setProgress(pct)
    }

    const onScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(() => {
          update()
          tickingRef.current = false
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      role="presentation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '3px',
        background: 'var(--accent)',
        zIndex: 200,
        transition: 'width 80ms linear',
        transformOrigin: 'left center',
        pointerEvents: 'none',
      }}
    />
  )
}
