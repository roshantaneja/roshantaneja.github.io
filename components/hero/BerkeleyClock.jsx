import { useEffect, useState } from 'react';
import styles from '../../styles/mission-control.module.css';
import heroConfig from '../../data/hero.json';

function getLA() {
  const now = new Date();
  const timeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: heroConfig.clock.timezone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  const tzStr = new Intl.DateTimeFormat('en-US', {
    timeZone: heroConfig.clock.timezone,
    timeZoneName: 'short',
  })
    .formatToParts(now)
    .find((p) => p.type === 'timeZoneName')?.value ?? heroConfig.clock.tzFallback;

  return { timeStr, tzStr };
}

export default function BerkeleyClock({ sprint }) {
  // Placeholder prevents hydration mismatch — populated client-side only
  const [time, setTime] = useState({ timeStr: '--:--:--', tzStr: heroConfig.clock.tzFallback });

  useEffect(() => {
    // Initial set
    setTime(getLA());

    let interval = null;

    function startTicking() {
      interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          setTime(getLA());
        }
      }, 1000);
    }

    function handleVisibility() {
      if (document.visibilityState === 'visible') {
        setTime(getLA());
      }
    }

    startTicking();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className={styles.tile}>
      <p className={styles.tileLabel}>{heroConfig.clock.label}</p>
      <div className={styles.tileBody}>
        <div
          className={styles.clockDisplay}
          aria-label={`Current time in Berkeley: ${time.timeStr} ${time.tzStr}`}
          aria-live="off"
        >
          {time.timeStr}
        </div>
        <div className={styles.clockTz}>{time.tzStr}</div>
        {sprint && (
          <div className={styles.sprintLine}>
            {heroConfig.clock.sprintPrefix} <span>{sprint}</span>
          </div>
        )}
      </div>
    </div>
  );
}
