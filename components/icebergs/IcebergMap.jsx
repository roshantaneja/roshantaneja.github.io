/**
 * IcebergMap.jsx
 *
 * MapLibre GL JS map showing:
 *  - ICESat-2 iceberg track lines
 *  - Kalman covariance ellipses per forecast horizon (day 1, 7, 14, 30)
 *
 * Dynamically imported with ssr:false from pages/icebergs.js.
 * MapLibre CSS is injected via <link> in the page <Head>, not imported here,
 * to avoid the Next.js Pages Router global-CSS-from-non-_app restriction.
 */

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import { forecastToGeoJSON } from './KalmanCone'
import styles from '../../styles/icebergs.module.css'

// Fallback opacity constants (used if mapConfig props are undefined)
const _DEFAULT_DAY_OPACITY = {
  1: 0.35,
  7: 0.22,
  14: 0.14,
  30: 0.08,
}

const _DEFAULT_DAY_STROKE_OPACITY = {
  1: 0.55,
  7: 0.40,
  14: 0.28,
  30: 0.18,
}

export default function IcebergMap({
  tracks,
  forecasts,
  onTrackClick,
  onEllipseClick,
  mapConfig,
}) {
  // Resolve config from props or fallback defaults
  const resolvedStyle = mapConfig?.style ?? 'https://demotiles.maplibre.org/style.json'
  const resolvedCenter = mapConfig?.initialView?.center ?? [-50, 57]
  const resolvedZoom = mapConfig?.initialView?.zoom ?? 4
  const resolvedTrackColor = mapConfig?.trackColor ?? '#4da6ff'
  const resolvedTrackWidth = mapConfig?.trackWidth ?? 2.5
  const resolvedTrackOpacity = mapConfig?.trackOpacity ?? 0.9
  const resolvedDayOpacity = mapConfig?.dayOpacity ?? _DEFAULT_DAY_OPACITY
  const resolvedDayStrokeOpacity = mapConfig?.dayStrokeOpacity ?? _DEFAULT_DAY_STROKE_OPACITY
  const containerRef = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: resolvedStyle,
      center: resolvedCenter,
      zoom: resolvedZoom,
      attributionControl: true,
    })

    mapRef.current = map

    map.addControl(new maplibregl.NavigationControl(), 'top-right')

    map.on('load', () => {
      // -------------------------------------------------------
      // 1. Track lines layer
      // -------------------------------------------------------
      map.addSource('iceberg-tracks', {
        type: 'geojson',
        data: tracks,
      })

      map.addLayer({
        id: 'iceberg-tracks-line',
        type: 'line',
        source: 'iceberg-tracks',
        paint: {
          'line-color': resolvedTrackColor,
          'line-width': resolvedTrackWidth,
          'line-opacity': resolvedTrackOpacity,
        },
      })

      // Track-line click markers
      map.on('click', 'iceberg-tracks-line', (e) => {
        if (!e.features || !e.features.length) return
        const feature = e.features[0]
        const trackId = feature.properties.track_id
        if (onTrackClick) onTrackClick(trackId)
      })

      map.on('mouseenter', 'iceberg-tracks-line', () => {
        map.getCanvas().style.cursor = 'pointer'
      })
      map.on('mouseleave', 'iceberg-tracks-line', () => {
        map.getCanvas().style.cursor = ''
      })

      // -------------------------------------------------------
      // 2. Track endpoint markers
      // -------------------------------------------------------
      if (tracks && tracks.features) {
        tracks.features.forEach((feature) => {
          const coords = feature.geometry.coordinates
          const lastCoord = coords[coords.length - 1]

          const el = document.createElement('div')
          el.style.cssText = `
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #7dd3fc;
            border: 2px solid #0b0c10;
            cursor: pointer;
          `

          new maplibregl.Marker({ element: el })
            .setLngLat(lastCoord)
            .setPopup(
              new maplibregl.Popup({ offset: 14 }).setHTML(
                `<div style="font-family:monospace;font-size:0.8rem;color:#e9edf5;background:#11141b;padding:0.4rem 0.6rem;border-radius:6px;">
                  <strong>${feature.properties.track_id}</strong><br/>
                  ${feature.properties.area_km2} km² · ${feature.properties.freeboard_m} m freeboard
                </div>`
              )
            )
            .addTo(map)

          el.addEventListener('click', () => {
            if (onTrackClick) onTrackClick(feature.properties.track_id)
          })
        })
      }

      // -------------------------------------------------------
      // 3. Kalman ellipse layers (one fill + outline per day per track)
      //    Layers are added largest-day-first so the smallest (day=1)
      //    ellipse ends up on top and remains clickable when outer
      //    ellipses spatially overlap it.
      // -------------------------------------------------------
      if (forecasts && Array.isArray(forecasts)) {
        forecasts.forEach((forecast) => {
          const geoJSON = forecastToGeoJSON(forecast)

          // Group features by day for separate layers
          const byDay = {}
          geoJSON.features.forEach((f) => {
            const d = f.properties.day
            if (!byDay[d]) byDay[d] = { type: 'FeatureCollection', features: [] }
            byDay[d].features.push(f)
          })

          // Sort descending: day 30 added first, day 1 added last → day 1 on top
          const sortedEntries = Object.entries(byDay).sort(
            ([a], [b]) => parseInt(b, 10) - parseInt(a, 10)
          )

          sortedEntries.forEach(([day, dayFC]) => {
            const dayInt = parseInt(day, 10)
            const sourceId = `ellipse-${forecast.track_id}-d${day}`
            const fillLayerId = `ellipse-fill-${forecast.track_id}-d${day}`
            const outlineLayerId = `ellipse-outline-${forecast.track_id}-d${day}`

            map.addSource(sourceId, {
              type: 'geojson',
              data: dayFC,
            })

            map.addLayer({
              id: fillLayerId,
              type: 'fill',
              source: sourceId,
              paint: {
                'fill-color': '#7dd3fc',
                'fill-opacity': resolvedDayOpacity[dayInt] ?? 0.08,
              },
            })

            map.addLayer({
              id: outlineLayerId,
              type: 'line',
              source: sourceId,
              paint: {
                'line-color': '#7dd3fc',
                'line-width': 1,
                'line-opacity': resolvedDayStrokeOpacity[dayInt] ?? 0.18,
              },
            })

            // Click handler on ellipse fill
            map.on('click', fillLayerId, (e) => {
              if (!e.features || !e.features.length) return
              const p = e.features[0].properties
              if (onEllipseClick) {
                onEllipseClick(p.track_id, p.day, p.sigma_major_km, p.sigma_minor_km, p.theta_deg)
              }
            })

            map.on('mouseenter', fillLayerId, () => {
              map.getCanvas().style.cursor = 'crosshair'
            })
            map.on('mouseleave', fillLayerId, () => {
              map.getCanvas().style.cursor = ''
            })
          })
        })
      }
    })

    return () => {
      map.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.mapWrap}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
