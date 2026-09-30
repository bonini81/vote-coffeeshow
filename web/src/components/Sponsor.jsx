import styles from './Sponsor.module.css';

export default function Sponsor({ className = '' }) {
  return (
    <div className={`${styles.sponsor} ${className}`}>
      <span className={styles.label}>Auspicia:</span>
      {/* TODO: logo Produbanco */}
      <strong>Produbanco</strong>
    </div>
  );
}
