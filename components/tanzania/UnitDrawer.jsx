import styles from '../../styles/tanzania.module.css';

/**
 * UnitDrawer
 *
 * Right-side panel (bottom sheet on mobile) showing unit details.
 *
 * Props:
 *   unit: { id, lat, lng, filename } | null
 *   onClose: () => void
 */
export default function UnitDrawer({ unit, onClose }) {
  const isOpen = unit !== null;

  const roundCoord = (n) => (typeof n === 'number' ? n.toFixed(3) : 'n/a');

  return (
    <aside
      className={[styles.drawer, isOpen ? styles.drawerOpen : ''].join(' ')}
      aria-label="Unit details"
      aria-hidden={!isOpen}
    >
      <div className={styles.drawerHeader}>
        <span className={styles.drawerTitle}>
          {unit ? `Unit ${unit.id}` : 'Unit Details'}
        </span>
        <button
          className={styles.drawerClose}
          onClick={onClose}
          aria-label="Close unit drawer"
        >
          Close
        </button>
      </div>

      {unit && (
        <div className={styles.drawerBody}>
          {/* Photo */}
          <UnitPhoto filename={unit.filename} unitId={unit.id} />

          {/* Metadata rows */}
          <div className={styles.drawerMeta}>
            <div className={styles.drawerMetaRow}>
              <span className={styles.drawerMetaLabel}>Unit ID</span>
              <span className={styles.drawerMetaValue}>{unit.id}</span>
            </div>
            <div className={styles.drawerMetaRow}>
              <span className={styles.drawerMetaLabel}>Latitude</span>
              <span className={styles.drawerMetaValue}>{roundCoord(unit.lat)}</span>
            </div>
            <div className={styles.drawerMetaRow}>
              <span className={styles.drawerMetaLabel}>Longitude</span>
              <span className={styles.drawerMetaValue}>{roundCoord(unit.lng)}</span>
            </div>
            <div className={styles.drawerMetaRow}>
              <span className={styles.drawerMetaLabel}>Walk saved</span>
              <span className={styles.drawerPending}>data pending</span>
            </div>
            <div className={styles.drawerMetaRow}>
              <span className={styles.drawerMetaLabel}>Village</span>
              <span className={styles.drawerPending}>data pending</span>
            </div>
            <div className={styles.drawerMetaRow}>
              <span className={styles.drawerMetaLabel}>File</span>
              <span
                className={styles.drawerMetaValue}
                style={{ fontSize: '0.72rem', wordBreak: 'break-all' }}
              >
                {unit.filename}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

function UnitPhoto({ filename, unitId }) {
  const src = `/tanzania/photos/${filename}`;

  return (
    <div style={{ position: 'relative' }}>
      <img
        src={src}
        alt={`Rainwater harvesting unit ${unitId}`}
        className={styles.drawerPhoto}
        onError={(e) => {
          // Replace with fallback on load error
          e.currentTarget.style.display = 'none';
          const fallback = e.currentTarget.nextSibling;
          if (fallback) fallback.style.display = 'flex';
        }}
      />
      <div
        className={styles.drawerPhotoFallback}
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        Photo unavailable
      </div>
    </div>
  );
}
