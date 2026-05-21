/**
 * pages/icebergs.js
 *
 * ICESat-2 Iceberg Tracking Pipeline page.
 * Showcases Kalman filter drift forecasting with mock data.
 *
 * getStaticProps reads mock data from public/data/icebergs/ at build time.
 * IcebergMap is dynamically imported with ssr:false (MapLibre requires window).
 * MapLibre CSS is injected via <link> in <Head> to avoid Next.js global-CSS restriction.
 */

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import path from 'path'
import fs from 'fs'
import styles from '../styles/icebergs.module.css'
import TimeScrubber from '../components/icebergs/TimeScrubber'
import IcebergPanel from '../components/icebergs/IcebergPanel'
import HemisphereBridge from '../components/icebergs/HemisphereBridge'
import Footer from '../components/Footer'

// Loading placeholder uses styles.mapWrap so mobile breakpoint height matches
// the fully-loaded map (avoids layout shift on narrow viewports).
function MapLoadingPlaceholder() {
  return (
    <div className={styles.mapWrap}>
      <div className={styles.mapPlaceholder}>
        <div className={styles.mapPlaceholderSpinner} />
        Loading map&hellip;
      </div>
    </div>
  )
}

// Dynamic import — MapLibre references window/document and cannot run server-side
const IcebergMap = dynamic(
  () => import('../components/icebergs/IcebergMap'),
  {
    ssr: false,
    loading: () => <MapLoadingPlaceholder />,
  }
)

// ---------------------------------------------------------
// Count-up hook for hero stats
// ---------------------------------------------------------
function useCountUp(target, duration = 1400) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    startRef.current = null

    function step(ts) {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }

    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return value
}

// ---------------------------------------------------------
// getStaticProps — reads mock data at build time
// ---------------------------------------------------------
export async function getStaticProps() {
  const dataDir = path.join(process.cwd(), 'public', 'data', 'icebergs')

  const summary = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'summary.json'), 'utf8')
  )
  const tracks = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'tracks.geojson'), 'utf8')
  )
  const forecasts = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'forecasts.json'), 'utf8')
  )
  const pageConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'icebergs', 'page.json'), 'utf8')
  )

  return {
    props: { summary, tracks, forecasts, pageConfig },
  }
}

// ---------------------------------------------------------
// Page component
// ---------------------------------------------------------
export default function Icebergs({ summary, tracks, forecasts, pageConfig }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [selectedTrackId, setSelectedTrackId] = useState(null)

  // Count-up animations for stats
  const km2Count = useCountUp(summary.total_km2_tracked, 1600)
  const trackCount = useCountUp(summary.active_tracks, 900)

  function handleTrackClick(trackId) {
    setSelectedTrackId(trackId)
  }

  function handleEllipseClick(trackId) {
    setSelectedTrackId(trackId)
  }

  function handlePanelClose() {
    setSelectedTrackId(null)
  }

  const lastRefreshed = new Date(summary.last_refreshed).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className={styles.page}>
      <Head>
        <title>{pageConfig.hero.pageTitle}</title>
        <meta
          name="description"
          content={pageConfig.hero.metaDescription}
        />
        <link rel="icon" href="/favicon.ico" />
        {/* MapLibre CSS injected here to avoid Next.js global-CSS-from-non-_app restriction */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/maplibre-gl@5.24.0/dist/maplibre-gl.css"
        />
      </Head>

      {/* Back navigation */}
      <a href="/" className={styles.backLink}>
        &larr; Home
      </a>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroEyebrow}>{pageConfig.hero.eyebrow}</div>
        <h1 className={styles.heroTitle}>{pageConfig.hero.title}</h1>
        <p className={styles.heroSub}>{pageConfig.hero.sub}</p>

        {/* Stat strip */}
        <div className={styles.statStrip}>
          <div className={styles.statCard}>
            <div className={`${styles.statValue} ${styles.statValueAccent}`}>
              {km2Count.toLocaleString()}
            </div>
            <div className={styles.statLabel}>{pageConfig.hero.statLabels.km2Tracked}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{trackCount}</div>
            <div className={styles.statLabel}>{pageConfig.hero.statLabels.activeTracks}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{summary.mean_drift_speed_km_day}</div>
            <div className={styles.statLabel}>{pageConfig.hero.statLabels.meanDrift}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ fontSize: '1.1rem', paddingTop: '0.3rem' }}>
              {lastRefreshed}
            </div>
            <div className={styles.statLabel}>{pageConfig.hero.statLabels.lastRefreshed}</div>
          </div>
        </div>
      </section>

      {/* Map legend */}
      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div className={styles.legendLine} />
          <span>ICESat-2 track</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendEllipse1} />
          <span>+1d forecast</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendEllipse7} />
          <span>+7d forecast</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendEllipse14} />
          <span>+14d forecast</span>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendEllipse30} />
          <span>+30d forecast</span>
        </div>
      </div>

      {/* Main content: map + panel */}
      <div className={styles.contentRow}>
        <div className={styles.mapCol}>
          <IcebergMap
            tracks={tracks}
            forecasts={forecasts}
            onTrackClick={handleTrackClick}
            onEllipseClick={handleEllipseClick}
            mapConfig={pageConfig?.map}
          />

          <div className={styles.scrubberWrap}>
            <TimeScrubber value={selectedDate} onChange={setSelectedDate} />
          </div>
        </div>

        <IcebergPanel
          trackId={selectedTrackId}
          tracks={tracks}
          forecasts={forecasts}
          onClose={handlePanelClose}
        />
      </div>

      {/* Hemisphere bridge footer */}
      <HemisphereBridge currentSlug="icebergs" />

      <Footer />
    </div>
  )
}
