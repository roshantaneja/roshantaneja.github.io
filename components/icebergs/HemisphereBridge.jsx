/**
 * HemisphereBridge.jsx
 *
 * Full-width footer linking research site pages to each other.
 * Renders a card for every entry in data/research-footprints.json
 * except the one matching currentSlug (the page the user is already on).
 *
 * Props:
 *   currentSlug {string} — slug of the current research page (e.g. "tanzania" or "icebergs")
 *
 * Adding a new entry to data/research-footprints.json (with bridgeLabel, bridgeTitle,
 * bridgeSub, href, slug) will automatically produce a new card here.
 */

import footprints from '../../data/research-footprints.json'
import styles from '../../styles/icebergs.module.css'

export default function HemisphereBridge({ currentSlug }) {
  const cards = footprints.filter((fp) => fp.slug !== currentSlug)

  return (
    <div className={styles.bridge} aria-label="Related projects">
      {cards.map((fp) => (
        <a key={fp.slug} href={fp.href} className={styles.bridgeCard}>
          <div className={styles.bridgeLabel}>{fp.bridgeLabel}</div>
          <div className={styles.bridgeTitle}>{fp.bridgeTitle}</div>
          <div className={styles.bridgeSub}>{fp.bridgeSub}</div>
        </a>
      ))}

      <div className={styles.bridgeDivider} aria-hidden="true">
        Same satellite ML toolbox,<br />opposite hemispheres.
      </div>
    </div>
  )
}
