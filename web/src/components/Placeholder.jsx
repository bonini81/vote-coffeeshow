import styles from './Placeholder.module.css';

/** Marcador de posición. Se reemplaza por imágenes reales cuando lleguen los assets. */
export default function Placeholder({ label, shape = 'box', ratio, className = '' }) {
  return (
    <div
      className={`${styles.placeholder} ${styles[shape]} ${className}`}
      style={ratio ? { aspectRatio: ratio } : undefined}
      role="img"
      aria-label={label}
    >
      <span aria-hidden="true">{shape === 'circle' ? label?.trim().charAt(0) : label}</span>
    </div>
  );
}
