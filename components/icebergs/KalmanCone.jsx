/**
 * KalmanCone.jsx
 *
 * Utility component + helper for converting Kalman forecast horizons
 * into GeoJSON FeatureCollection of covariance ellipse polygons.
 *
 * The main export is the `forecastToGeoJSON` helper function.
 * IcebergMap calls this to generate its ellipse layers.
 */

const VERTICES = 32

/**
 * Build a 32-vertex ellipse polygon in [lng, lat] space.
 *
 * @param {[number, number]} center  - [lng, lat] in degrees
 * @param {number} sigmaMajorKm      - semi-major axis in km (2σ)
 * @param {number} sigmaMinorKm      - semi-minor axis in km (2σ)
 * @param {number} thetaDeg          - rotation angle of major axis, degrees CCW from East
 * @returns {number[][]}             - ring of [lng, lat] pairs (closed)
 */
export function buildEllipse(center, sigmaMajorKm, sigmaMinorKm, thetaDeg) {
  const [lng, lat] = center
  const thetaRad = (thetaDeg * Math.PI) / 180

  // Degree conversions
  const kmPerDegreeLat = 111.0
  const kmPerDegreeLng = 111.0 * Math.cos((lat * Math.PI) / 180)

  const aLat = sigmaMajorKm / kmPerDegreeLat
  const bLat = sigmaMinorKm / kmPerDegreeLat
  const aLng = sigmaMajorKm / kmPerDegreeLng
  const bLng = sigmaMinorKm / kmPerDegreeLng

  const ring = []
  for (let i = 0; i <= VERTICES; i++) {
    const angle = (2 * Math.PI * i) / VERTICES

    // Rotated ellipse parametric equations
    const dx =
      aLng * Math.cos(thetaRad) * Math.cos(angle) -
      bLng * Math.sin(thetaRad) * Math.sin(angle)
    const dy =
      aLat * Math.sin(thetaRad) * Math.cos(angle) +
      bLat * Math.cos(thetaRad) * Math.sin(angle)

    ring.push([lng + dx, lat + dy])
  }

  return ring
}

/**
 * Convert a single forecast object (from forecasts.json) into a GeoJSON
 * FeatureCollection of ellipse polygons, one per horizon day.
 *
 * Each feature carries properties:
 *   track_id, day, sigma_major_km, sigma_minor_km, theta_deg
 *
 * @param {object} forecast - single entry from forecasts.json
 * @returns {object}        - GeoJSON FeatureCollection
 */
export function forecastToGeoJSON(forecast) {
  const features = forecast.horizon.map((h) => {
    const ring = buildEllipse(h.mean, h.sigma_major_km, h.sigma_minor_km, h.theta_deg)
    return {
      type: 'Feature',
      properties: {
        track_id: forecast.track_id,
        day: h.day,
        sigma_major_km: h.sigma_major_km,
        sigma_minor_km: h.sigma_minor_km,
        theta_deg: h.theta_deg,
        mean_lng: h.mean[0],
        mean_lat: h.mean[1],
      },
      geometry: {
        type: 'Polygon',
        coordinates: [ring],
      },
    }
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}

/**
 * KalmanCone — React component wrapper.
 * Accepts a forecast prop and renders nothing itself; its value is as
 * a named export of forecastToGeoJSON for IcebergMap to call imperatively.
 */
export default function KalmanCone() {
  return null
}
