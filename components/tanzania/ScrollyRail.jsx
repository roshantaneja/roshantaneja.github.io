import { useRef, useEffect } from 'react';
import styles from '../../styles/tanzania.module.css';

/**
 * ScrollyRail
 *
 * Left-column (desktop) / top-strip (mobile) timeline rail.
 * Click an event to fly the map to that view.
 *
 * Props:
 *   events: tanzaniaTimelineEvents[]
 *   activeIndex: number | null
 *   onEventClick: (event, index) => void
 */
export default function ScrollyRail({ events, activeIndex, onEventClick }) {
  const activeRef = useRef(null);

  // Scroll active item into view when it changes
  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
    }
  }, [activeIndex]);

  return (
    <nav className={styles.scrollyRail} aria-label="Project timeline">
      <div className={styles.railHeader}>Project Timeline</div>
      <ol className={styles.railList}>
        {events.map((event, i) => {
          const isActive = activeIndex === i;
          return (
            <li
              key={i}
              ref={isActive ? activeRef : null}
              className={[
                styles.railItem,
                isActive ? styles.railItemActive : '',
              ].join(' ')}
              onClick={() => onEventClick(event, i)}
              role="button"
              tabIndex={0}
              aria-current={isActive ? 'true' : undefined}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onEventClick(event, i);
                }
              }}
            >
              <div className={styles.railItemDate}>{event.date}</div>
              <div className={styles.railItemTitle}>{event.title}</div>
              <p className={styles.railItemDesc}>{event.description}</p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
