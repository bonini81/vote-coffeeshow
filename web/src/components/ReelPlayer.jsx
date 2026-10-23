import { useState } from 'react';
import styles from './ReelPlayer.module.css';

// Muestra la portada con un botón de play; el iframe de YouTube se carga solo al hacer clic.
export default function ReelPlayer({ id, portada, titulo }) {
  const [activo, setActivo] = useState(false);

  if (activo) {
    return (
      <iframe
        className={styles.marco}
        src={`https://www.youtube.com/embed/${id}?rel=0&playsinline=1&autoplay=1`}
        title={titulo}
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className={styles.portada}
      onClick={() => setActivo(true)}
      aria-label={`Reproducir ${titulo}`}
    >
      <img
        src={portada ?? `https://img.youtube.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
      />
      <span className={styles.play} aria-hidden="true">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
