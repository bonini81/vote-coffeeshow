import { Link } from 'react-router-dom';
import Placeholder from './Placeholder.jsx';
import { logoDe } from '../data/logos.js';
import styles from './CafeteriaCard.module.css';

export default function CafeteriaCard({ cafeteria }) {
  const url = `/cafeteria/${cafeteria.slug}`;
  const logo = logoDe(cafeteria) || cafeteria.imagenUrl;
  return (
    <article className={styles.card}>
      <Link to={url} className={styles.imageLink} tabIndex={-1} aria-hidden="true">
        {logo ? (
          <img className={styles.image} src={logo} alt="" loading="lazy" />
        ) : (
          <Placeholder shape="circle" label={cafeteria.nombre} />
        )}
      </Link>
      <span className={styles.divider} aria-hidden="true" />
      <h3 className={styles.name}>{cafeteria.nombre}</h3>
      <Link to={url} className="btn btn--sm">
        Ver +<span className="visually-hidden"> sobre {cafeteria.nombre}</span>
      </Link>
    </article>
  );
}
