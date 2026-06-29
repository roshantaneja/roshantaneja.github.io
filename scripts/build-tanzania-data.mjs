/**
 * build-tanzania-data.mjs
 *
 * Standalone script to generate public/tanzania/units.geojson from photo filenames.
 * Run with: node scripts/build-tanzania-data.mjs
 *
 * Photo filename format: `lat,lng,unitId.jpg`  (e.g. `-3.30,36.24,33.jpg`)
 * Some files have only lat,lng with no unitId.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PHOTOS_DIR = path.join(ROOT, 'public', 'tanzania', 'photos');

const OUT_DIR = path.join(ROOT, 'public', 'tanzania');
const OUT_FILE = path.join(OUT_DIR, 'units.geojson');

function parsePhotoFilenames(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.jpg'));
  const features = [];

  for (const filename of files) {
    const base = filename.replace(/\.jpg$/i, '');
    const parts = base.split(',');

    if (parts.length < 2) continue;

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    if (isNaN(lat) || isNaN(lng)) continue;

    // unitId may or may not be present
    const unitId = parts.length >= 3 ? parts[2].trim() : `${lat}_${lng}`;

    features.push({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      properties: {
        id: unitId,
        lat: lat,
        lng: lng,
        filename: filename,
      },
    });
  }

  return features;
}

// Ensure output dir exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const features = parsePhotoFilenames(PHOTOS_DIR);

const geojson = {
  type: 'FeatureCollection',
  features,
};

fs.writeFileSync(OUT_FILE, JSON.stringify(geojson, null, 2), 'utf8');

console.log(`Wrote ${features.length} features to ${OUT_FILE}`);
