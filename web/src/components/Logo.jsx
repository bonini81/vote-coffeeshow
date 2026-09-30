import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

export default function Logo({ size = 'md' }) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[size]}`} aria-label="Inicio">
      <span className={styles.kicker}>Ruta del</span>
      <span className={styles.name}>
        Coffee Show
        <br />
        Supermaxi
      </span>
    </Link>
  );
}
