import { useEffect, useRef, useCallback, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import NanjaRings from './NanjaRings';
import LayerChips from './LayerChips';
import styles from '../../styles/tanzania.module.css';

/**
 * TanzaniaMap
 *
 * MapLibre GL JS map with:
 *   - Clustered photo markers (MapLibre built-in clustering)
 *   - Nanja Dam marker
 *   - NanjaRings concentric circles
 *   - Layer visibility chips
 *
 * IMPORTANT: This component must be imported with { ssr: false } in pages/tanzania.js
 *
 * Props:
 *   unitsGeoJSON: GeoJSON FeatureCollection of photo units
 *   onUnitClick: (unit: { id, lat, lng, filename }) => void
 *   onMapReady: (flyToFn: ({ center, zoom }) => void) => void
 *   activeLayers: Set<string>
 *   onLayerToggle: (id: string) => void
 *   layerDefs: Array<{id: string, label: string, defaultOn: boolean}> — layer definitions from config
 *   nanjaLngLat: [number, number] — [lng, lat] of Nanja Dam for MapLibre marker
 *   nanjaCenter: [number, number] — [lng, lat] of Nanja Dam for NanjaRings/Turf
 *   ringRadiiKm: number[] — ring distances in km
 *   ringColors: string[] — color per ring
 *   mapStyle: string — MapLibre style URL
 *   initialZoom: number — initial map zoom level
 *   initialCenter: [number, number] — initial map center [lng, lat]
 */

// Fallback constants (used if props are undefined)
const _DEFAULT_NANJA_LNG_LAT = [36.2832, -3.3815]; // [lng, lat] for MapLibre
const _DEFAULT_LAYER_DEFS = [
  { id: 'photos', label: 'Photos' },
  { id: 'nanja-rings', label: 'Nanja Rings' },
];

const CLUSTER_SOURCE = 'units';
const CLUSTER_CIRCLE_LAYER = 'clusters';
const CLUSTER_COUNT_LAYER = 'cluster-count';
const UNCLUSTERED_LAYER = 'unclustered-point';

export default function TanzaniaMap({
  unitsGeoJSON,
  onUnitClick,
  onMapReady,
  activeLayers,
  onLayerToggle,
  layerDefs,
  nanjaLngLat,
  nanjaCenter,
  ringRadiiKm,
  ringColors,
  mapStyle,
  initialZoom,
  initialCenter,
}) {
  // Resolve config from props or fallback defaults
  const resolvedLayerDefs = layerDefs ?? _DEFAULT_LAYER_DEFS;
  const resolvedNanjaLngLat = nanjaLngLat ?? _DEFAULT_NANJA_LNG_LAT;
  const resolvedNanjaCenter = nanjaCenter ?? _DEFAULT_NANJA_LNG_LAT;
  const resolvedMapStyle = mapStyle ?? 'https://demotiles.maplibre.org/style.json';
  const resolvedInitialZoom = initialZoom ?? 12;
  const resolvedInitialCenter = initialCenter ?? [36.20, -3.38];
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  // mapInstance is held in state so that NanjaRings re-renders when
  // the map object becomes available (useRef mutations don't trigger re-renders).
  const [mapInstance, setMapInstance] = useState(null);

  // Stable flyTo callback registered with parent
  const flyTo = useCallback(({ center, zoom }) => {
    if (!mapRef.current) return;
    mapRef.current.flyTo({
      center,
      zoom: zoom ?? 12,
      duration: 1400,
      essential: true,
    });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: resolvedMapStyle,
      center: resolvedInitialCenter,
      zoom: resolvedInitialZoom,
      attributionControl: true,
    });

    mapRef.current = map;

    // Register flyTo with parent
    if (onMapReady) onMapReady(flyTo);

    // Navigation & scale controls
    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('load', () => {
      // ── Units source (with built-in clustering) ──
      map.addSource(CLUSTER_SOURCE, {
        type: 'geojson',
        data: unitsGeoJSON,
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 60,
      });

      // Cluster circles
      map.addLayer({
        id: CLUSTER_CIRCLE_LAYER,
        type: 'circle',
        source: CLUSTER_SOURCE,
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#0070f3',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            16,  // default
            10, 22,  // >= 10 points
            30, 28,  // >= 30 points
          ],
          'circle-opacity': 0.85,
          'circle-stroke-width': 2,
          'circle-stroke-color': 'rgba(255,255,255,0.3)',
        },
      });

      // Cluster count labels — use Noto Sans which demotiles actually serves
      map.addLayer({
        id: CLUSTER_COUNT_LAYER,
        type: 'symbol',
        source: CLUSTER_SOURCE,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['Noto Sans Bold', 'Arial Unicode MS Bold'],
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // Individual (unclustered) points
      map.addLayer({
        id: UNCLUSTERED_LAYER,
        type: 'circle',
        source: CLUSTER_SOURCE,
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#ff7849',
          'circle-radius': 6,
          'circle-stroke-width': 1.5,
          'circle-stroke-color': 'rgba(255,255,255,0.5)',
        },
      });

      // ── Nanja Dam marker ──
      const nanjaEl = document.createElement('div');
      nanjaEl.style.cssText = [
        'width:16px',
        'height:16px',
        'border-radius:50%',
        'background:#4ade80',
        'border:3px solid #fff',
        'box-shadow:0 0 0 2px #4ade80',
        'cursor:pointer',
      ].join(';');
      nanjaEl.title = 'Nanja Dam';
      nanjaEl.setAttribute('aria-label', 'Nanja Dam');

      const nanjaPopup = new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(
        '<strong style="font-size:0.85rem">Nanja Dam</strong><br>' +
        '<span style="font-size:0.75rem;color:#a0a8b8">−3.3815, 36.2832</span>'
      );

      const nanjaMarker = new maplibregl.Marker({ element: nanjaEl })
        .setLngLat(resolvedNanjaLngLat)
        .setPopup(nanjaPopup)
        .addTo(map);

      markersRef.current.push(nanjaMarker);

      // ── Click: cluster → zoom in ──
      map.on('click', CLUSTER_CIRCLE_LAYER, (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: [CLUSTER_CIRCLE_LAYER] });
        if (!features.length) return;

        const clusterId = features[0].properties.cluster_id;
        map.getSource(CLUSTER_SOURCE).getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          map.easeTo({ center: features[0].geometry.coordinates, zoom });
        });
      });

      // ── Click: individual point → open drawer ──
      map.on('click', UNCLUSTERED_LAYER, (e) => {
        const feature = e.features[0];
        if (!feature) return;
        const { id, lat, lng, filename } = feature.properties;
        if (onUnitClick) {
          onUnitClick({ id, lat: parseFloat(lat), lng: parseFloat(lng), filename });
        }
      });

      // Cursor pointer on hover
      map.on('mouseenter', CLUSTER_CIRCLE_LAYER, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', CLUSTER_CIRCLE_LAYER, () => { map.getCanvas().style.cursor = ''; });
      map.on('mouseenter', UNCLUSTERED_LAYER, () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', UNCLUSTERED_LAYER, () => { map.getCanvas().style.cursor = ''; });

      // Expose map instance to React so NanjaRings (and others) re-render correctly
      setMapInstance(map);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setMapInstance(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once

  // ── Sync "Photos" layer visibility ──
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    const vis = activeLayers.has('photos') ? 'visible' : 'none';
    [CLUSTER_CIRCLE_LAYER, CLUSTER_COUNT_LAYER, UNCLUSTERED_LAYER].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, 'visibility', vis);
      }
    });
  }, [activeLayers]);

  const ringsVisible = activeLayers.has('nanja-rings');

  return (
    <div className={styles.mapArea}>
      <div ref={containerRef} className={styles.mapContainer} />

      <LayerChips
        layers={resolvedLayerDefs}
        active={activeLayers}
        onToggle={onLayerToggle}
      />

      {/* mapInstance (state) passed so NanjaRings re-renders when map is ready */}
      <NanjaRings
        map={mapInstance}
        visible={ringsVisible}
        nanjaCenter={resolvedNanjaCenter}
        ringRadiiKm={ringRadiiKm}
        ringColors={ringColors}
      />
    </div>
  );
}
