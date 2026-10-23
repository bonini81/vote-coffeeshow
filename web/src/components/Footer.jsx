import { Link } from 'react-router-dom';
import { COPYRIGHT } from '../data/config.js';
import SocialLinks from './SocialLinks.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.legal}>
          <p className={styles.copyright}>{COPYRIGHT}</p>
          <Link to="/terminos" className={styles.enlace}>
            Términos y Condiciones
          </Link>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}
