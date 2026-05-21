/**
 * TimeScrubber.jsx
 *
 * Horizontal date range slider spanning the last 180 days.
 * Below it: a small sparkline (mock constant at 3 active tracks).
 *
 * Props:
 *   value    {Date}       - currently selected date
 *   onChange {(Date)=>void}
 */

import styles from '../../styles/icebergs.module.css'

const TOTAL_DAYS = 180
const SPARKLINE_BARS = 60  // number of bars to render

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function TimeScrubber({ value, onChange }) {
  // Range: [today - 180 days, today]
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const minDate = new Date(now)
  minDate.setDate(minDate.getDate() - TOTAL_DAYS)

  // Convert Date to slider integer (days since minDate)
  const currentDayOffset = Math.round((value - minDate) / (1000 * 60 * 60 * 24))
  const clampedOffset = Math.max(0, Math.min(TOTAL_DAYS, currentDayOffset))

  function handleChange(e) {
    const dayOffset = parseInt(e.target.value, 10)
    const newDate = new Date(minDate)
    newDate.setDate(newDate.getDate() + dayOffset)
    onChange(newDate)
  }

  // Sparkline: mock data — constant 3 tracks, tiny random noise for realism
  const sparkData = Array.from({ length: SPARKLINE_BARS }, (_, i) => {
    // Slight variation: 2–3 tracks, with a single dip at bar 12 and 45
    if (i === 12 || i === 45) return 2
    if (i === 13 || i === 46) return 2
    return 3
  })

  const maxSpark = Math.max(...sparkData)
  const currentBarIndex = Math.round((clampedOffset / TOTAL_DAYS) * (SPARKLINE_BARS - 1))

  return (
    <div className={styles.scrubber}>
      <div className={styles.scrubberHeader}>
        <span className={styles.scrubberTitle}>Observation window</span>
        <span className={styles.scrubberDate}>{formatDate(value)}</span>
      </div>

      <input
        type="range"
        className={styles.scrubberInput}
        min={0}
        max={TOTAL_DAYS}
        value={clampedOffset}
        onChange={handleChange}
        aria-label="Select observation date"
        aria-valuetext={formatDate(value)}
      />

      <div className={styles.sparkline} aria-hidden="true" title="Active track count over time">
        {sparkData.map((count, i) => {
          const heightPct = (count / maxSpark) * 100
          let barClass = styles.sparkBar
          if (i === currentBarIndex) barClass = `${styles.sparkBar} ${styles.sparkBarCurrent}`
          else if (i < currentBarIndex) barClass = `${styles.sparkBar} ${styles.sparkBarActive}`

          return (
            <div
              key={i}
              className={barClass}
              style={{ height: `${heightPct}%` }}
            />
          )
        })}
      </div>
    </div>
  )
}
