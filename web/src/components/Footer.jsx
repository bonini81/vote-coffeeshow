import { COPYRIGHT } from '../data/config.js';
import SocialLinks from './SocialLinks.jsx';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <small>{COPYRIGHT}</small>
        <SocialLinks />
      </div>
    </footer>
  );
}
