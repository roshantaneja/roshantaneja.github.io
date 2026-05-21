/**
 * fetch-icespy.mjs
 *
 * Build-time artifact fetcher for the icespy pipeline.
 *
 * Currently validates that mock data files are present in public/data/icebergs/.
 * When the icespy pipeline is live, set ICESPY_RELEASE_URL to the GitHub Release
 * asset base URL and uncomment the fetch block below to pull real artifacts.
 *
 * Usage: node scripts/fetch-icespy.mjs
 */

import { existsSync } from 'fs'

const mockFiles = ['summary.json', 'forecasts.json', 'tracks.geojson']
const allPresent = mockFiles.every((f) =>
  existsSync(`public/data/icebergs/${f}`)
)

if (!allPresent) {
  const missing = mockFiles.filter((f) => !existsSync(`public/data/icebergs/${f}`))
  console.error(
    `[fetch-icespy] Missing icespy artifacts: ${missing.join(', ')}\n` +
    `Run scripts/build-mock-icespy.mjs or set ICESPY_RELEASE_URL.`
  )
  process.exit(1)
}

console.log('[fetch-icespy] All icespy artifacts present.')

// ---------------------------------------------------------------------------
// TODO: When the icespy GitHub Actions pipeline is live, set ICESPY_RELEASE_URL
// and uncomment the block below to fetch real data at build time.
// ---------------------------------------------------------------------------
//
// import { writeFileSync, mkdirSync } from 'fs'
// import { join } from 'path'
//
// const releaseUrl = process.env.ICESPY_RELEASE_URL
// if (releaseUrl) {
//   const outDir = 'public/data/icebergs'
//   mkdirSync(outDir, { recursive: true })
//
//   for (const file of mockFiles) {
//     const res = await fetch(`${releaseUrl}/${file}`)
//     if (!res.ok) {
//       console.error(`[fetch-icespy] Failed to fetch ${file}: ${res.status}`)
//       process.exit(1)
//     }
//     const text = await res.text()
//     writeFileSync(join(outDir, file), text, 'utf8')
//     console.log(`[fetch-icespy] Downloaded ${file}`)
//   }
//   console.log('[fetch-icespy] Real artifacts fetched successfully.')
// }
