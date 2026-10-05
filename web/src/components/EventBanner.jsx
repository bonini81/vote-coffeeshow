import { EVENTO } from '../data/config.js';
import Placeholder from './Placeholder.jsx';
import styles from './EventBanner.module.css';
import coffeeShow from '../assets/heros/CoffeShow1.png'

export default function EventBanner() {
  return (
    <section className={styles.banner} aria-labelledby="evento-titulo">
      <div className={`container ${styles.inner}`}>
     
      
        <div className={styles.info}>
             <img src={coffeeShow} alt="Coffee Show banner"/>
          <p className={styles.date}>
            <strong>{EVENTO.fechas}</strong>
            <br />
            <span>{EVENTO.lugar}</span>
          </p>
          <a className="btn btn--primary btn--sm" href={EVENTO.urlEntradas} target="_blank" rel="noreferrer">
            Comprar entradas
          </a>
          {/* TODO: logo Buen Plan */}
          <p className={styles.partner}>Buen Plan</p>
        </div>
      </div>
    </section>
  );
}
