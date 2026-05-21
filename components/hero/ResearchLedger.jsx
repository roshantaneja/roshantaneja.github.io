import styles from '../../styles/mission-control.module.css';
import publications from '../../data/publications.json';
import heroConfig from '../../data/hero.json';

export default function ResearchLedger() {
  return (
    <div className={styles.tile}>
      <p className={styles.tileLabel}>{heroConfig.ledger.label}</p>
      <div className={styles.tileBody}>
        <ul className={styles.ledgerList}>
          {publications.map((pub, i) => {
            const inner = (
              <>
                <span className={styles.ledgerAward}>{pub.award}</span>
                <span className={styles.ledgerCategory}>{pub.category}</span>
              </>
            );

            return (
              <li key={i} className={styles.ledgerRow}>
                {pub.href ? (
                  <a
                    href={pub.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.ledgerLink}
                    aria-label={`${pub.award} — ${pub.category}`}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
