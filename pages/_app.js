import '../styles/globals.css'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"
import { useEffect, useState } from 'react'
import styles from '../styles/palette.module.css'
import siteData from '../data/site.json'

// Console manifest easter egg
const CONSOLE_MANIFEST = `
%c
    ▲ ${siteData.console.name}
    ──────────────────────────────────────
    ${siteData.console.role}
    geospatial ml: sentinel-2 × icesat-2
    ──────────────────────────────────────
    currently: icespy kalman tracker
    contact: github.com/${siteData.owner.github}
    ──────────────────────────────────────
    // coordinates: ${siteData.console.coords}
    // swahili: ${siteData.console.greeting}
`

const ROUTES = siteData.routes

function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  if (!open) return null

  const filtered = ROUTES.filter(r =>
    r.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <input
          className={styles.input}
          placeholder="Search pages and posts..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
        <ul className={styles.list}>
          {filtered.map(r => (
            <li key={r.href}>
              <a href={r.href} className={styles.item} onClick={onClose}>
                <span className={styles.itemLabel}>{r.label}</span>
                <span className={styles.itemGroup}>{r.group}</span>
              </a>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className={styles.empty}>No results for &ldquo;{query}&rdquo;</li>
          )}
        </ul>
        <div className={styles.footer}>
          <span>↵ open</span>
          <span>esc close</span>
          <span>⌘K toggle</span>
        </div>
      </div>
    </div>
  )
}

function MyApp({ Component, pageProps }) {
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    // Console manifest easter egg
    if (typeof window !== 'undefined' && !window.__manifestShown) {
      window.__manifestShown = true
      console.log(
        CONSOLE_MANIFEST,
        'color: #7dd3fc; font-family: monospace; font-size: 12px; line-height: 1.6'
      )
    }

    // Command palette keyboard shortcut
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen(prev => !prev)
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <>
      <Component {...pageProps} />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </>
  )
}

export default MyApp
