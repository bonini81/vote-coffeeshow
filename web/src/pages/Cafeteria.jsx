import { Link, useParams } from 'react-router-dom';
import CafeteriaCarousel from '../components/CafeteriaCarousel.jsx';
import Placeholder from '../components/Placeholder.jsx';
import PublicLayout from '../components/PublicLayout.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import { useCafeterias } from '../hooks/useCafeterias.js';
import NotFound from './NotFound.jsx';
import styles from './Cafeteria.module.css';

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
  const galeria = cafeteria.galeria?.length ? cafeteria.galeria : [null, null, null, null];

  return (
    <PublicLayout cafeteriaSlug={cafeteria.slug}>
      <section className="section">
        <div className={`container ${styles.perfil}`}>
          <div className={styles.avatar}>
            {cafeteria.imagenUrl ? (
              <img src={cafeteria.imagenUrl} alt="" className={styles.avatarImg} />
            ) : (
              <Placeholder shape="circle" label={cafeteria.nombre} />
            )}
          </div>
          <div className={styles.info}>
            <h1 className={styles.nombre}>{cafeteria.nombre}</h1>
            <p>{cafeteria.historia || cafeteria.descripcion}</p>
            {cafeteria.direccion && (
              <p className={styles.dato}>
                <strong>Dirección:</strong> {cafeteria.direccion}
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
          <div className={styles.reel}>
            {cafeteria.videoUrl ? (
              <video src={cafeteria.videoUrl} controls playsInline preload="metadata" />
            ) : (
              <Placeholder label="Video reel 9:16" ratio="9 / 16" />
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

      <section className={`section ${styles.otros}`} aria-labelledby="otros">
        <div className="container">
          <h2 id="otros" className={styles.otrosTitulo}>
            Ver otros participantes
          </h2>
          <CafeteriaCarousel cafeterias={otras} />
        </div>
      </section>
    </PublicLayout>
  );
}
