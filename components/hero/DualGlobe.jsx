import styles from '../../styles/mission-control.module.css';
import LAND_PATHS from '../../data/land-paths.json';
import footprints from '../../data/research-footprints.json';

// "A", "A and B", "A, B, and C" — keeps the aria-label readable as sites are added.
const siteList = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
}).format(footprints.map((fp) => fp.label));

export default function DualGlobe() {
  const viewBox = "0 0 360 180";

  return (
    <div className={styles.tile}>
      <p className={styles.tileLabel}>Research Footprint</p>
      <div className={styles.tileBody}>
        <div className={styles.globeWrap}>
          <svg
            viewBox={viewBox}
            className={styles.globeSvg}
            aria-label={`World map showing research sites in ${siteList}`}
            role="img"
          >
            {/* Ocean background */}
            <rect width="360" height="180" fill="var(--bg-2)" rx="4" />

            {/* Graticule lines (subtle) */}
            {[-60, -30, 0, 30, 60].map((lat) => {
              const y = ((90 - lat) / 180) * 180;
              return (
                <line
                  key={lat}
                  x1="0" y1={y} x2="360" y2={y}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                />
              );
            })}
            {[-120, -60, 0, 60, 120].map((lng) => {
              const x = ((lng + 180) / 360) * 360;
              return (
                <line
                  key={lng}
                  x1={x} y1="0" x2={x} y2="180"
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth="0.5"
                />
              );
            })}

            {/* Land masses */}
            {LAND_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="var(--bg-1)"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />
            ))}

            {/* Research site dots */}
            {footprints.map((fp) => {
              const x = fp.lng + 180;
              const y = 90 - fp.lat;
              const ringClass = fp.pulseDelay ? styles.pulseRingDelayed : styles.pulseRing;
              return (
                <g key={fp.slug}>
                  <circle cx={x} cy={y} r="4" fill={fp.color} />
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="none"
                    stroke={fp.color}
                    strokeWidth="1.5"
                    className={ringClass}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className={styles.dotLinks}>
          {footprints.map((fp) => (
            <a key={fp.slug} href={fp.href} className={styles.dotLabel}>
              <span style={{ color: fp.color }}>&#9679;</span> {fp.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
