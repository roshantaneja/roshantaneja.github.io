import { useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import styles from '../styles/tanzania.module.css';
import Footer from '../components/Footer';
import HemisphereBridge from '../components/icebergs/HemisphereBridge';
import ScrollyRail from '../components/tanzania/ScrollyRail';
import UnitDrawer from '../components/tanzania/UnitDrawer';
import tanzaniaTimelineEvents from '../data/tanzania/timelineEvents';
import tanzaniaPageConfig from '../data/tanzania/page.json';
import siteData from '../data/site.json';

// Dynamically import the map with SSR disabled — required for MapLibre
const TanzaniaMap = dynamic(
  () => import('../components/tanzania/TanzaniaMap'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-0)',
          color: 'var(--fg-2)',
          fontSize: '0.9rem',
        }}
      >
        Loading map...
      </div>
    ),
  }
);

export default function Tanzania({ units, pageConfig }) {
  // ── Default active layers derived from page config ──
  const DEFAULT_ACTIVE_LAYERS = new Set(
    (pageConfig ?? tanzaniaPageConfig).layers.filter((l) => l.defaultOn).map((l) => l.id)
  );

  const config = pageConfig ?? tanzaniaPageConfig;
  // Layer toggle state
  const [activeLayers, setActiveLayers] = useState(DEFAULT_ACTIVE_LAYERS);

  // Selected unit for the drawer
  const [selectedUnit, setSelectedUnit] = useState(null);

  // Active timeline index
  const [activeEventIndex, setActiveEventIndex] = useState(null);

  // flyTo function provided by TanzaniaMap on mount
  const flyToRef = useRef(null);

  const handleLayerToggle = useCallback((layerId) => {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layerId)) {
        next.delete(layerId);
      } else {
        next.add(layerId);
      }
      return next;
    });
  }, []);

  const handleUnitClick = useCallback((unit) => {
    setSelectedUnit(unit);
  }, []);

  const handleDrawerClose = useCallback(() => {
    setSelectedUnit(null);
  }, []);

  const handleMapReady = useCallback((flyToFn) => {
    flyToRef.current = flyToFn;
  }, []);

  const handleEventClick = useCallback((event, index) => {
    setActiveEventIndex(index);
    if (flyToRef.current && event.mapView) {
      flyToRef.current(event.mapView);
    }
  }, []);

  return (
    <div className={styles.page}>
      <Head>
        <title>Tanzania Rainwater Harvesting Map — {siteData.owner.name}</title>
        <meta
          name="description"
          content="Interactive map of 75+ rainwater harvesting units deployed to the Maasai community in Tanzania."
        />
        <link rel="icon" href="/chevron_left_FILL0_wght400_GRAD0_opsz48.ico" />
      </Head>

      {/* Page header */}
      <header className={styles.header}>
        <a href="/" className={styles.backLink}>&larr; Back to Home</a>
        <h1 className={styles.headerTitle}>Tanzania Rainwater Harvesting Map</h1>
        <span className={styles.headerSubtitle}>
          {units ? `${units.features.length} units` : ''}
        </span>
      </header>

      {/* Main workspace: scrolly rail + map */}
      <div className={styles.workspace}>
        <ScrollyRail
          events={tanzaniaTimelineEvents}
          activeIndex={activeEventIndex}
          onEventClick={handleEventClick}
        />

        {/* Map area + overlays */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <TanzaniaMap
            unitsGeoJSON={units}
            onUnitClick={handleUnitClick}
            onMapReady={handleMapReady}
            activeLayers={activeLayers}
            onLayerToggle={handleLayerToggle}
            layerDefs={config.layers}
            nanjaLngLat={config.nanja.center}
            nanjaCenter={config.nanja.center}
            ringRadiiKm={config.nanja.ringRadiiKm}
            ringColors={config.nanja.ringColors}
            mapStyle={config.map.style}
            initialZoom={config.map.initialView.zoom}
            initialCenter={config.map.initialView.center}
          />

          <UnitDrawer
            unit={selectedUnit}
            onClose={handleDrawerClose}
          />
        </div>
      </div>

      <HemisphereBridge currentSlug="tanzania" />
      <Footer />
    </div>
  );
}

// ── Build-time data generation ──────────────────────────────────────────────

/**
 * Parse photo filenames from the interactive map website's photos directory.
 * Filename format: `lat,lng[,unitId].jpg`
 */
function parsePhotoFilenames(photosDir) {
  let files;
  try {
    files = fs.readdirSync(photosDir).filter((f) => f.endsWith('.jpg'));
  } catch {
    console.warn('[tanzania] Photos directory not found:', photosDir);
    return [];
  }

  const features = [];

  for (const filename of files) {
    const base = filename.replace(/\.jpg$/i, '');
    const parts = base.split(',');

    if (parts.length < 2) continue;

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lng)) continue;

    // unitId may or may not be present
    const unitId = parts.length >= 3 ? parts[2].trim() : `${Math.abs(lat).toFixed(4)}_${lng.toFixed(4)}`;

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        id: unitId,
        lat,
        lng,
        filename,
      },
    });
  }

  return features;
}

export async function getStaticProps() {
  const photosDir = path.join(
    process.cwd(),
    'interactive-rainwater-harvesting-map-website',
    'public',
    'photos'
  );

  const features = parsePhotoFilenames(photosDir);

  const unitsGeoJSON = {
    type: 'FeatureCollection',
    features,
  };

  // Write to public/tanzania/units.geojson as a build-time side effect
  // so a static /tanzania/units.geojson endpoint is also available.
  try {
    const outDir = path.join(process.cwd(), 'public', 'tanzania');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const outFile = path.join(outDir, 'units.geojson');
    fs.writeFileSync(outFile, JSON.stringify(unitsGeoJSON, null, 2), 'utf8');
    console.log(`[tanzania] Wrote ${features.length} units to public/tanzania/units.geojson`);
  } catch (err) {
    console.warn('[tanzania] Could not write units.geojson:', err.message);
  }

  const pageConfig = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'data', 'tanzania', 'page.json'), 'utf8')
  );

  return {
    props: {
      units: unitsGeoJSON,
      pageConfig,
    },
  };
}
