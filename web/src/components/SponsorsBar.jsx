import styles from './SponsorsBar.module.css';
import logoSupermaxiWom from '../assets/logos/supermaxiWomLogo.jpg';

export default function SponsorsBar() {
  return (
    <section className={styles.bar} aria-label="Organizadores">
      <div className={`container ${styles.inner}`}>
        <br />
        <img src={logoSupermaxiWom} alt="Supermaxi y WOM" />
      </div>
    </section>
  );
}
