import styles from '../../styles/mission-control.module.css';
import heroConfig from '../../data/hero.json';

export default function GithubActivity({ activity }) {
  // activity is null → tile is hidden (handled by parent)
  if (!activity) return null;

  const { buckets, lastPushHours } = activity;
  const max = Math.max(...buckets, 1); // avoid division by zero

  // buckets[0] = today, buckets[13] = 13 days ago
  // Render oldest-first (left = 13 days ago, right = today)
  const displayBuckets = [...buckets].reverse();

  let pushText = null;
  if (lastPushHours !== null) {
    if (lastPushHours < 1) {
      pushText = 'last push < 1h ago';
    } else if (lastPushHours < 24) {
      pushText = `last push ${lastPushHours}h ago`;
    } else {
      const days = Math.round(lastPushHours / 24);
      pushText = `last push ${days}d ago`;
    }
  }

  return (
    <div className={styles.tile}>
      <p className={styles.tileLabel}>{heroConfig.github.label}</p>
      <div className={styles.tileBody}>
        <div
          className={styles.ghChart}
          role="img"
          aria-label="GitHub activity over the last 14 days"
        >
          {displayBuckets.map((count, i) => {
            const heightPct = max > 0 ? (count / max) * 100 : 0;
            return (
              <div
                key={i}
                className={styles.ghBar}
                style={{ height: `${Math.max(heightPct, 4)}%` }}
                title={`${count} event${count !== 1 ? 's' : ''}`}
              />
            );
          })}
        </div>
        {pushText && <p className={styles.ghMeta}>{pushText}</p>}
      </div>
    </div>
  );
}
