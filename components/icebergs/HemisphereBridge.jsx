/**
 * HemisphereBridge.jsx
 *
 * Full-width footer linking research site pages to each other.
 * Renders a card for every entry in data/research-footprints.json that declares
 * bridge copy, except the one matching currentSlug (the page the user is already on).
 *
 * Props:
 *   currentSlug {string} — slug of the current research page (e.g. "tanzania" or "icebergs")
 *
 * Adding a new entry to data/research-footprints.json with bridgeLabel, bridgeTitle,
 * and bridgeSub will automatically produce a new card here. Entries without that copy
 * (e.g. footprints that only mark a dot on the hero globe and have no dedicated page)
 * are skipped rather than rendering an empty card.
 *
 * NOTE: styles.bridge is a fixed `1fr auto 1fr` grid built around exactly two cards
 * flanking the divider. Adding a third bridge entry needs a CSS change too.
 */

import footprints from '../../data/research-footprints.json'
import styles from '../../styles/icebergs.module.css'

export default function HemisphereBridge({ currentSlug }) {
  const cards = footprints.filter(
    (fp) => fp.slug !== currentSlug && fp.bridgeTitle
  )

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
