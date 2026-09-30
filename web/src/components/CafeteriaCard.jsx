import { Link } from 'react-router-dom';
import Placeholder from './Placeholder.jsx';
import styles from './CafeteriaCard.module.css';

export default function CafeteriaCard({ cafeteria }) {
  const url = `/cafeteria/${cafeteria.slug}`;
  return (
    <article className={styles.card}>
      <Link to={url} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        {cafeteria.imagenUrl ? (
          <img className={styles.image} src={cafeteria.imagenUrl} alt="" loading="lazy" />
        ) : (
          <Placeholder shape="circle" label={cafeteria.nombre} />
        )}
      </Link>
      <h3 className={styles.name}>{cafeteria.nombre}</h3>
      <p className={styles.desc}>{cafeteria.descripcion}</p>
      <Link to={url} className="btn btn--sm">
        Ver más<span className="visually-hidden"> sobre {cafeteria.nombre}</span>
      </Link>
    </article>
  );
}
