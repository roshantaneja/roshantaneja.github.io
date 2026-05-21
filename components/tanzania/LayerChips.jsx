import styles from '../../styles/tanzania.module.css';

/**
 * LayerChips
 *
 * Toggle pill buttons for controlling visible map layers.
 *
 * Props:
 *   layers: { id: string, label: string }[]
 *   active: Set<string>
 *   onToggle: (id: string) => void
 */
export default function LayerChips({ layers, active, onToggle }) {
  return (
    <div className={styles.chipsBar} role="group" aria-label="Map layer toggles">
      {layers.map((layer) => (
        <button
          key={layer.id}
          className={[styles.chip, active.has(layer.id) ? styles.chipActive : ''].join(' ')}
          onClick={() => onToggle(layer.id)}
          aria-pressed={active.has(layer.id)}
          title={`Toggle ${layer.label} layer`}
        >
          {layer.label}
        </button>
      ))}
    </div>
  );
}
