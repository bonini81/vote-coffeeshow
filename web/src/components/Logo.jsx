import { Link } from 'react-router-dom';
import styles from './Logo.module.css';
import coffeShow from '../assets/logos/coffeeShowHeader.png';

export default function Logo({ size = 'md' }) {
  return (
    <Link to="/" className={`${styles.logo} ${styles[size]}`} aria-label="Inicio">
             <img src={coffeShow } width="250px" className={styles.imageCoffeeShow} />
    </Link>
  );
}
