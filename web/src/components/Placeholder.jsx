import styles from './Placeholder.module.css';

/** Caja gris del wireframe. Se reemplaza por imágenes reales cuando lleguen los assets. */
export default function Placeholder({ label, shape = 'box', ratio, className = '' }) {
  return (
    <div
      className={`${styles.placeholder} ${styles[shape]} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={label}
    >
      {shape !== 'circle' && <span>{label}</span>}
    </div>
  );
}
