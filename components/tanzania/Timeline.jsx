import { useEffect, useRef } from 'react'
import styles from '../../styles/tanzania.module.css'

/**
 * Timeline
 *
 * Centered single-column project timeline — the whole of /tanzania.
 * Events are grouped under year headings so 18 entries stay scannable.
 *
 * Reveal-on-scroll is progressive enhancement: the items are visible by
 * default, and only become animatable once the effect below sets
 * data-reveal="ready" on the container. Without JS (or with reduced motion)
 * everything renders plainly instead of staying stuck at opacity 0.
 *
 * Props:
 *   events: Array<{date, title, description}> — from data/tanzania/timelineEvents
 */

/** 'Dec 2023 / Sep 2024' → '2023'. Falls back to the raw string if no year is present. */
function yearOf(date) {
  const match = String(date).match(/\b(20\d{2})\b/)
  return match ? match[1] : String(date)
}

/** Collapse the flat event list into [{ year, events: [...] }] preserving order. */
function groupByYear(events) {
  const groups = []
  for (const event of events) {
    const year = yearOf(event.date)
    const last = groups[groups.length - 1]
    if (last && last.year === year) {
      last.events.push(event)
    } else {
      groups.push({ year, events: [event] })
    }
  }
  return groups
}

export default function Timeline({ events }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced || !('IntersectionObserver' in window)) return

    // Opting in here (rather than in the markup) keeps the no-JS render visible.
    container.dataset.reveal = 'ready'

    const items = Array.from(container.querySelectorAll(`.${styles.tlEvent}`))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.dataset.visible = 'true'
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.1 }
    )

    for (const item of items) observer.observe(item)
    return () => observer.disconnect()
  }, [])

  const groups = groupByYear(events)
  let absoluteIndex = 0

  return (
    <div className={styles.timeline} ref={containerRef}>
      {groups.map(({ year, events: yearEvents }) => (
        <section key={year} className={styles.tlYearGroup}>
          <h2 className={styles.tlYear}>
            <span className={styles.tlYearNum}>{year}</span>
            <span className={styles.tlYearCount}>
              {yearEvents.length} {yearEvents.length === 1 ? 'entry' : 'entries'}
            </span>
          </h2>

          <ol className={styles.tlList}>
            {yearEvents.map((event) => {
              // Stagger within a year, capped so later items never wait too long.
              const delay = Math.min(absoluteIndex++ % 6, 5) * 60
              return (
                <li
                  key={`${event.date}-${event.title}`}
                  className={styles.tlEvent}
                  style={{ '--tl-delay': `${delay}ms` }}
                >
                  <div className={styles.tlMarker} aria-hidden="true" />
                  <div className={styles.tlBody}>
                    <p className={styles.tlDate}>{event.date}</p>
                    <h3 className={styles.tlTitle}>{event.title}</h3>
                    <p className={styles.tlDesc}>{event.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
