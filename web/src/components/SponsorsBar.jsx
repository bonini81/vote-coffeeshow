import styles from './SponsorsBar.module.css';

export default function SponsorsBar() {
  return (
    <section className={styles.bar} aria-label="Organizadores">
      <div className={`container ${styles.inner}`}>
        <span>Un evento exclusivo de:</span>
        {/* TODO: logos Supermaxi y WOM */}
        <span className={styles.logos}>Supermaxi · WOM</span>
      </div>
    </section>
  );
}
