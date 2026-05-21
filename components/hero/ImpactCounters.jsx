import { useEffect, useRef, useState } from 'react';
import styles from '../../styles/mission-control.module.css';
import impactData from '../../data/impact.json';

function formatValue(format, val) {
  if (format === 'usd-compact') {
    return '$' + (val >= 1000 ? Math.round(val / 1000) + 'K' : val.toLocaleString());
  }
  // format === 'int'
  if (val >= 1000) {
    return val.toLocaleString();
  }
  return String(val);
}

function useCountUp(target, active) {
  const [value, setValue] = useState(target);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const duration = 1200;
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, active]);

  return value;
}

function Counter({ format, target, label, active }) {
  const value = useCountUp(target, active);
  const displayVal = formatValue(format, value);

  return (
    <div className={styles.counterRow}>
      <span className={styles.counterValue}>{displayVal}</span>
      <span className={styles.counterDesc}>{label}</span>
    </div>
  );
}

export default function ImpactCounters() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={impactData.href}
      className={styles.tile}
      ref={ref}
      aria-label="Humanitarian impact — Faces of Rainwater Harvesting"
    >
      <p className={styles.tileLabel}>Humanitarian Impact</p>
      <div className={styles.tileBody}>
        <div className={styles.countersGrid}>
          {impactData.counters.map(({ key, label, format }) => (
            <Counter
              key={key}
              format={format}
              target={impactData[key]}
              label={label}
              active={visible}
            />
          ))}
        </div>
      </div>
    </a>
  );
}
