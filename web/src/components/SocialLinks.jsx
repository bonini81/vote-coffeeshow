import { REDES } from '../data/config.js';
import styles from './SocialLinks.module.css';

const ICONOS = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.5 2h-3v13.6a2.9 2.9 0 1 1-2-2.75V9.7a6 6 0 1 0 5 5.9V9.3a7.4 7.4 0 0 0 4.5 1.5V7.7c-2.3 0-4.5-1.9-4.5-4.2V2z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.25-1.5 1.55-1.5H16.7V3.7C16.4 3.65 15.4 3.55 14.25 3.55c-2.4 0-4.05 1.45-4.05 4.15v2.25H7.5v3.1h2.7v8h3.3z" />
    </svg>
  ),
};

/** Íconos de redes. Si se pasa `redes` ({ instagram: url, ... }) solo se muestran esas. */
export default function SocialLinks({ redes, variante = 'claro' }) {
  const lista = redes ? REDES.map((r) => ({ ...r, url: redes[r.id] })).filter((r) => r.url) : REDES;
  if (lista.length === 0) return null;
  return (
    <ul className={`${styles.list} ${styles[variante]}`}>
      {lista.map((red) => (
        <li key={red.id}>
          <a
            href={red.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
            aria-label={red.nombre}
          >
            {ICONOS[red.id]}
          </a>
        </li>
      ))}
    </ul>
  );
}
