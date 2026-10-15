import { Link, useParams } from 'react-router-dom';
import CafeteriaCarousel from '../components/CafeteriaCarousel.jsx';
import Placeholder from '../components/Placeholder.jsx';
import PublicLayout from '../components/PublicLayout.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import { logoDe } from '../data/logos.js';
import { useCafeterias } from '../hooks/useCafeterias.js';
import NotFound from './NotFound.jsx';
import kissLeft from '../assets/fondos/kiss-left.png';
import kissRight from '../assets/fondos/kiss-right.png';
import styles from './Cafeteria.module.css';
import { galeriaDe } from '../data/galerias.js';

// TODO: reels de relleno hasta recibir los reales de cada cafetería.
const REELS_DEMO = ['9bRtFrJOglE', 'F1Tg47BLk4g', 'grFzvY-PoJo', '0uV9nL844Zk'];

export default function Cafeteria() {
  const { slug } = useParams();
  const { cafeterias, cargando } = useCafeterias();

  if (cargando) {
    return (
      <PublicLayout>
        <p className="container section">Cargando…</p>
      </PublicLayout>
    );
  }

  const cafeteria = cafeterias.find((c) => c.slug === slug);
  if (!cafeteria) return <NotFound />;

  const otras = cafeterias.filter((c) => c.slug !== slug);
  const galeria = cafeteria.galeria?.length ? cafeteria.galeria : galeriaDe(cafeteria);
  const indice = cafeterias.findIndex((c) => c.slug === slug);
  const reelDemo = REELS_DEMO[indice % REELS_DEMO.length];

  return (
    <PublicLayout cafeteriaSlug={cafeteria.slug}>
      <div className={styles.pagina}>
      <img src={kissRight} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissTop}`} />
      <img src={kissLeft} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissLeft}`} />
      <img src={kissRight} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissBottom}`} />
      <section className={`section ${styles.principal} ${styles.ficha}`}>
        <div className={`container ${styles.perfil}`}>
          <div className={styles.avatar}>
            {cafeteria.imagenUrl ? (
              <img src={cafeteria.imagenUrl} alt="" className={styles.avatarImg} />
            ) : logoDe(cafeteria) ? (
              <img src={logoDe(cafeteria)} alt={`Logo de ${cafeteria.nombre}`} className={styles.logo} />
            ) : (
              <Placeholder shape="circle" label={cafeteria.nombre} />
            )}
          </div>
          <div className={styles.info}>
            <h1 className={styles.nombre}>{cafeteria.nombre}</h1>
            <p>{cafeteria.historia || cafeteria.descripcion}</p>

                {cafeteria.horarioAtencion && (
              <p className={styles.dato}>
                <strong>Horarios de atención:</strong>{' '}
                {cafeteria.horarioAtencion}
              </p>
            )}

            {cafeteria.direccion && (
              <p className={styles.dato}>
                <strong>Ubicación:</strong> {cafeteria.direccion}
              </p>
            )}
            {cafeteria.telefono && (
              <p className={styles.dato}>
                <strong>Teléfono:</strong>{' '}
                <a href={`tel:${cafeteria.telefono}`}>{cafeteria.telefono}</a>
              </p>
            )}

            
            <SocialLinks redes={cafeteria.redes} variante="oscuro" />
            <Link to={`/votar?c=${cafeteria.slug}`} className={`btn btn--primary ${styles.votar}`}>
              Votar por {cafeteria.nombre}
            </Link>
          </div>
        </div>

        <div className={`container ${styles.media}`}>
          <img src={kissLeft} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissReel}`} />
          <div className={styles.reel}>
            {cafeteria.videoUrl ? (
              <video src={cafeteria.videoUrl} controls playsInline preload="metadata" />
            ) : (
              <iframe
                src={`https://www.youtube.com/embed/${reelDemo}?rel=0&playsinline=1`}
                title={`Reel de ${cafeteria.nombre}`}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            )}
          </div>
          <ul className={styles.galeria}>
            {galeria.map((url, i) => (
              <li key={url ?? i}>
                {url ? (
                  <img src={url} alt="" loading="lazy" />
                ) : (
                  <Placeholder label="" ratio="4 / 3" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={`section ${styles.principal} ${styles.otros}`} aria-labelledby="otros">
        <div className="container">
          <h2 id="otros" className={styles.otrosTitulo}>
            Ver otros participantes
          </h2>
          <CafeteriaCarousel cafeterias={otras} />
        </div>
      </section>
      </div>
    </PublicLayout>
  );
}
