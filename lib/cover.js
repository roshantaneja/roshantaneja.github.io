/**
 * Deterministic lattice cover glyph generator.
 * FNV-1a hash → seeded Mulberry32 PRNG → 12×12 symmetric SVG grid.
 */

/** FNV-1a 32-bit hash of a string */
function fnv1a(str) {
  let hash = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i)
    // 32-bit FNV prime multiply (JS integers overflow naturally)
    hash = Math.imul(hash, 0x01000193)
  }
  // Convert to unsigned 32-bit integer
  return hash >>> 0
}

/** Mulberry32 PRNG — returns a function that yields floats in [0, 1) */
function mulberry32(seed) {
  let s = seed >>> 0
  return function () {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const PALETTES = [
  ['#0070f3', '#1a1f29'],
  ['#ff7849', '#1a1f29'],
  ['#7dd3fc', '#1a1f29'],
  ['#4ade80', '#1a1f29'],
  ['#fbbf24', '#1a1f29'],
  ['#f87171', '#1a1f29'],
]

/**
 * Generate a deterministic SVG string for the given title.
 *
 * @param {string}  title
 * @param {number}  [size=512]  pixel dimensions (square)
 * @param {object}  [opts]
 * @param {string}  [opts.preserveAspectRatio='xMidYMid meet']
 *   Set to 'xMidYMid slice' when using as a full-bleed background banner.
 * @returns {string}  raw SVG markup
 */
export function generateCoverSVG(title, size = 512, opts = {}) {
  const { preserveAspectRatio = 'xMidYMid meet' } = opts

  const hash = fnv1a(title || 'untitled')
  const rand = mulberry32(hash)
  const [accent, bg] = PALETTES[hash % 6]
  const N = 12
  const cellSize = size / N
  const half = N / 2 // 6 for N=12

  // Build cell grid: for each row, generate left half then mirror right
  const svgParts = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" preserveAspectRatio="${preserveAspectRatio}">`,
    `<rect width="${size}" height="${size}" fill="${bg}"/>`,
  ]

  for (let row = 0; row < N; row++) {
    const rowTypes = []
    for (let col = 0; col < half; col++) {
      const v = rand()
      rowTypes[col] = v < 0.4 ? 'empty' : v < 0.7 ? 'line' : 'filled'
    }
    // Mirror: col 5→6, 4→7, 3→8, 2→9, 1→10, 0→11
    for (let col = 0; col < half; col++) {
      rowTypes[N - 1 - col] = rowTypes[col]
    }

    for (let col = 0; col < N; col++) {
      const type = rowTypes[col]
      if (type === 'empty') continue
      const x = col * cellSize
      const y = row * cellSize
      if (type === 'filled') {
        svgParts.push(
          `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${accent}" opacity="0.8"/>`
        )
      } else if (type === 'line') {
        svgParts.push(
          `<line x1="${x}" y1="${y + cellSize}" x2="${x + cellSize}" y2="${y}" stroke="${accent}" stroke-width="1.5" opacity="0.6"/>`
        )
      }
    }
  }

  svgParts.push('</svg>')
  return svgParts.join('')
}
