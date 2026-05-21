/**
 * IcebergPanel.jsx
 *
 * Right-rail detail drawer showing selected iceberg track info:
 *   - Track ID (large monospace)
 *   - Area km², freeboard m, confidence bar
 *   - Current position
 *   - Forecast table: +7, +14, +30 days with uncertainty
 *   - Kalman eigenvalue info box
 *   - Close button
 *
 * Props:
 *   trackId   {string|null}   - selected track ID, or null for empty state
 *   tracks    {object}        - GeoJSON FeatureCollection (tracks)
 *   forecasts {object[]}      - forecasts array
 *   onClose   {()=>void}
 */

import styles from '../../styles/icebergs.module.css'

function formatCoord(val, pos) {
  const abs = Math.abs(val).toFixed(3)
  const dir = pos === 'lng' ? (val >= 0 ? 'E' : 'W') : val >= 0 ? 'N' : 'S'
  return `${abs}° ${dir}`
}

export default function IcebergPanel({ trackId, tracks, forecasts, onClose }) {
  if (!trackId) {
    return (
      <div className={styles.panel}>
        <div className={styles.panelEmpty}>
          <div className={styles.panelEmptyIcon}>&#9112;</div>
          <div className={styles.panelEmptyText}>
            Click a track or ellipse on the map to inspect it
          </div>
        </div>
      </div>
    )
  }

  // Find matching track feature
  const trackFeature = tracks?.features?.find(
    (f) => f.properties.track_id === trackId
  )
  const forecast = forecasts?.find((f) => f.track_id === trackId)

  if (!trackFeature || !forecast) {
    return (
      <div className={styles.panel}>
        <button className={styles.panelClose} onClick={onClose} aria-label="Close panel">
          ESC
        </button>
        <div className={styles.panelEmpty}>
          <div className={styles.panelEmptyText}>No data found for {trackId}</div>
        </div>
      </div>
    )
  }

  const props = trackFeature.properties
  const coords = trackFeature.geometry.coordinates
  const lastPos = coords[coords.length - 1]

  // Forecast rows for +7, +14, +30
  const forecastDays = [7, 14, 30]
  const forecastRows = forecastDays.map((d) => {
    const h = forecast.horizon.find((hh) => hh.day === d)
    return h ? { day: d, ...h } : null
  }).filter(Boolean)

  // Last horizon entry for eigenvalue display
  const lastH = forecast.horizon[forecast.horizon.length - 1]

  return (
    <div className={styles.panel}>
      <button
        className={styles.panelClose}
        onClick={onClose}
        aria-label="Close panel"
      >
        ESC
      </button>

      <div className={styles.panelTrackId}>{trackId}</div>

      {/* Metadata grid */}
      <div className={styles.panelMeta}>
        <div className={styles.panelMetaItem}>
          <div className={styles.panelMetaLabel}>Area</div>
          <div className={styles.panelMetaValue}>{props.area_km2} km²</div>
        </div>
        <div className={styles.panelMetaItem}>
          <div className={styles.panelMetaLabel}>Freeboard</div>
          <div className={styles.panelMetaValue}>{props.freeboard_m} m</div>
        </div>
      </div>

      {/* Confidence bar */}
      <div className={styles.confidenceWrap}>
        <div className={styles.confidenceLabel}>
          ICESat-2 Detection Confidence — {Math.round(props.confidence * 100)}%
        </div>
        <div className={styles.confidenceBar} role="meter" aria-valuenow={props.confidence * 100} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={styles.confidenceFill}
            style={{ width: `${props.confidence * 100}%` }}
          />
        </div>
      </div>

      {/* Position */}
      <div className={styles.positionRow}>
        <span>Last fix:</span>
        <span className={styles.positionCoords}>
          {formatCoord(lastPos[1], 'lat')}, {formatCoord(lastPos[0], 'lng')}
        </span>
      </div>

      {/* Forecast table */}
      <div className={styles.sectionLabel}>Kalman Drift Forecast</div>
      <table className={styles.forecastTable}>
        <thead>
          <tr>
            <th>Horizon</th>
            <th>Mean position</th>
            <th>2&#x3C3; uncertainty</th>
          </tr>
        </thead>
        <tbody>
          {forecastRows.map((row) => (
            <tr key={row.day}>
              <td>
                <span className={styles.forecastDay}>+{row.day}d</span>
              </td>
              <td>
                {formatCoord(row.mean[1], 'lat')},
                <br />
                {formatCoord(row.mean[0], 'lng')}
              </td>
              <td>
                <span className={styles.uncertaintyChip}>
                  {row.sigma_major_km} &times; {row.sigma_minor_km} km
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Eigenvalue box */}
      <div className={styles.sectionLabel}>Covariance at +{lastH.day}d</div>
      <div className={styles.eigenBox}>
        <div className={styles.eigenRow}>
          <span className={styles.eigenChip}>&#x3C3;_major: {lastH.sigma_major_km} km</span>
          <span className={styles.eigenChip}>&#x3C3;_minor: {lastH.sigma_minor_km} km</span>
          <span className={styles.eigenChip}>&#x3B8;: {lastH.theta_deg}°</span>
        </div>
        <div className={styles.eigenCaption}>
          2&#x3C3; Kalman covariance ellipse (95% CI) — orientation measured CCW from East
        </div>
      </div>
    </div>
  )
}
