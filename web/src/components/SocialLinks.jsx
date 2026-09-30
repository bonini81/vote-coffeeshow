import { REDES } from '../data/config.js';
import styles from './SocialLinks.module.css';

/** Íconos de redes. Si se pasa `redes` ({ instagram: url, ... }) solo se muestran esas. */
export default function SocialLinks({ redes, variante = 'claro' }) {
  const lista = redes ? REDES.map((r) => ({ ...r, url: redes[r.id] })).filter((r) => r.url) : REDES;
  if (lista.length === 0) return null;
  return (
    <ul className={`${styles.list} ${styles[variante]}`}>
      {lista.map((red) => (
        <li key={red.id}>
          <a href={red.url} target="_blank" rel="noreferrer" aria-label={red.nombre}>
            {/* TODO: íconos reales */}
            <span className={styles.icon} aria-hidden="true" />
            <span className={styles.label}>{red.nombre}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
