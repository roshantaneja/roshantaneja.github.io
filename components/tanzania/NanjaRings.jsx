import { useEffect } from 'react';
import circle from '@turf/circle';
import styles from '../../styles/tanzania.module.css';

/**
 * NanjaRings
 *
 * Adds concentric distance rings around Nanja Dam to a MapLibre map.
 * Rings are drawn as GeoJSON circle features using @turf/circle.
 *
 * Props:
 *   map: maplibregl.Map | null  — the live map instance
 *   visible: boolean            — controlled by the "Nanja Rings" chip
 *   nanjaCenter: [number, number] — [lng, lat] of Nanja Dam for GeoJSON/Turf
 *   ringRadiiKm: number[]       — ring distances in km
 *   ringColors: string[]        — color per ring
 */

// Fallback constants (used if props are undefined)
const _DEFAULT_NANJA_CENTER = [36.2832, -3.3815]; // [lng, lat] for GeoJSON/Turf
const _DEFAULT_RING_RADII_KM = [1, 2, 5, 10, 20];
// Color ramp from cool to warm as radius increases
const _DEFAULT_RING_COLORS = ['#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0070f3'];

const SOURCE_ID = 'nanja-rings';
const LAYER_ID = 'nanja-rings-line';
const LABEL_LAYER_BASE = 'nanja-ring-label';

export default function NanjaRings({ map, visible, nanjaCenter, ringRadiiKm, ringColors }) {
  // Resolve config from props or fallback defaults
  const resolvedNanjaCenter = nanjaCenter ?? _DEFAULT_NANJA_CENTER;
  const resolvedRingRadiiKm = ringRadiiKm ?? _DEFAULT_RING_RADII_KM;
  const resolvedRingColors = ringColors ?? _DEFAULT_RING_COLORS;
  useEffect(() => {
    if (!map) return;

    const addRings = () => {
      if (map.getSource(SOURCE_ID)) return; // already added

      // Build a FeatureCollection of ring polygons
      const features = resolvedRingRadiiKm.map((r, i) => {
        const feat = circle(resolvedNanjaCenter, r, { units: 'kilometers', steps: 64 });
        feat.properties = { radius: r, label: `${r}km`, colorIndex: i };
        return feat;
      });

      map.addSource(SOURCE_ID, {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features,
        },
      });

      // Line layer for the ring outlines
      map.addLayer({
        id: LAYER_ID,
        type: 'line',
        source: SOURCE_ID,
        layout: {
          visibility: 'visible',
        },
        paint: {
          'line-color': [
            'match',
            ['get', 'radius'],
            ...resolvedRingRadiiKm.flatMap((r, i) => [r, resolvedRingColors[i] ?? '#7dd3fc']),
            resolvedRingColors[0] ?? '#7dd3fc',
          ],
          'line-width': 1.5,
          'line-opacity': 0.7,
          'line-dasharray': [4, 3],
        },
      });
    };

    if (map.isStyleLoaded()) {
      addRings();
    } else {
      map.once('load', addRings);
    }

    // Cleanup: remove source/layer when component unmounts
    return () => {
      if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
      if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // Toggle visibility when `visible` changes
  useEffect(() => {
    if (!map) return;
    if (!map.getLayer(LAYER_ID)) return;

    map.setLayoutProperty(LAYER_ID, 'visibility', visible ? 'visible' : 'none');
  }, [map, visible]);

  // Render a small legend overlay when rings are visible
  if (!visible) return null;

  return (
    <div className={styles.ringsLegend} aria-label="Nanja Dam distance rings legend">
      <div className={styles.ringsLegendTitle}>Nanja Dam</div>
      {resolvedRingRadiiKm.map((r, i) => (
        <div key={r} className={styles.ringsLegendRow}>
          <div
            className={styles.ringsLegendSwatch}
            style={{ backgroundColor: resolvedRingColors[i] }}
            aria-hidden="true"
          />
          <span>{r} km</span>
        </div>
      ))}
    </div>
  );
}
