import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Sponsor from './Sponsor.jsx';
import styles from './Header.module.css';

export default function Header({ cafeteriaSlug }) {
  const destino = cafeteriaSlug ? `/votar?c=${cafeteriaSlug}` : '/votar';
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Logo size="sm" />
          <Sponsor />
        </div>
        <Link to={destino} className="btn btn--primary btn--sm">
          Votar
        </Link>
      </div>
    </header>
  );
}
