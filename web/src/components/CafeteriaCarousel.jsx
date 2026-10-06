import { useRef } from 'react';
import CafeteriaCard from './CafeteriaCard.jsx';
import styles from './CafeteriaCarousel.module.css';

export default function CafeteriaCarousel({ cafeterias }) {
  const pista = useRef(null);

  const mover = (direccion) => {
    const el = pista.current;
    if (el) el.scrollBy({ left: direccion * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <div className={styles.carousel}>
      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => mover(-1)}
        aria-label="Anteriores"
      >
        <svg viewBox="0 0 10 12" aria-hidden="true">
          <path d="M8 0 L0 6 L8 12 Z" />
        </svg>
      </button>
      <ul className={styles.track} ref={pista}>
        {cafeterias.map((c) => (
          <li key={c.id} className={styles.item}>
            <CafeteriaCard cafeteria={c} />
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => mover(1)}
        aria-label="Siguientes"
      >
        <svg viewBox="0 0 10 12" aria-hidden="true">
          <path d="M2 0 L10 6 L2 12 Z" />
        </svg>
      </button>
    </div>
  );
}
