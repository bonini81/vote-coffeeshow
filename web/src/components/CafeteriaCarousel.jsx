import { useCallback, useEffect, useRef, useState } from 'react';
import CafeteriaCard from './CafeteriaCard.jsx';
import styles from './CafeteriaCarousel.module.css';

const MOBILE_QUERY = '(max-width: 639px)';
const POR_PAGINA_MOBILE = 2;
const AUTOPLAY_MS = 4000;
const PAUSA_TRAS_INTERACCION_MS = 8000;

export default function CafeteriaCarousel({ cafeterias }) {
  const pista = useRef(null);
  const pausaHasta = useRef(0);
  const [esMobile, setEsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );
  const [pagina, setPagina] = useState(0);

  const totalPaginas = Math.ceil(cafeterias.length / POR_PAGINA_MOBILE);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setEsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const irAPagina = useCallback((p) => {
    const el = pista.current;
    const item = el?.children[p * POR_PAGINA_MOBILE];
    if (!el || !item) return;
    el.scrollTo({ left: item.offsetLeft - el.children[0].offsetLeft, behavior: 'smooth' });
  }, []);

  const onScroll = () => {
    const el = pista.current;
    if (!el || !esMobile) return;
    if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
      setPagina(totalPaginas - 1);
      return;
    }
    const base = el.children[0].offsetLeft;
    let mejor = 0;
    let distMin = Infinity;
    for (let p = 0; p < totalPaginas; p++) {
      const inicio = el.children[p * POR_PAGINA_MOBILE].offsetLeft - base;
      const d = Math.abs(inicio - el.scrollLeft);
      if (d < distMin) {
        distMin = d;
        mejor = p;
      }
    }
    setPagina(mejor);
  };

  const pausar = () => {
    pausaHasta.current = Date.now() + PAUSA_TRAS_INTERACCION_MS;
  };

  useEffect(() => {
    if (!esMobile || totalPaginas < 2) return undefined;
    const id = setInterval(() => {
      if (Date.now() < pausaHasta.current) return;
      const siguiente = (pagina + 1) % totalPaginas;
      irAPagina(siguiente);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [esMobile, pagina, totalPaginas, irAPagina]);

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
      <div className={styles.viewport}>
        <ul
          className={styles.track}
          ref={pista}
          onScroll={onScroll}
          onPointerDown={pausar}
          onTouchStart={pausar}
        >
          {cafeterias.map((c) => (
            <li key={c.id} className={styles.item}>
              <CafeteriaCard cafeteria={c} />
            </li>
          ))}
        </ul>
        {totalPaginas > 1 && (
          <div className={styles.dots} role="tablist" aria-label="Páginas del carrusel">
            {Array.from({ length: totalPaginas }, (_, p) => (
              <button
                key={p}
                type="button"
                role="tab"
                aria-selected={p === pagina}
                aria-label={`Página ${p + 1}`}
                className={`${styles.dot} ${p === pagina ? styles.dotActive : ''}`}
                onClick={() => {
                  pausar();
                  irAPagina(p);
                }}
              />
            ))}
          </div>
        )}
      </div>
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
