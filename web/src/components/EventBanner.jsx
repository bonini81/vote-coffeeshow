import { EVENTO } from '../data/config.js';
import Placeholder from './Placeholder.jsx';
import styles from './EventBanner.module.css';
import coffeeShow from '../assets/heros/CoffeShow1.png'
import buenPlan from '../assets/logos/buenPlan1.png'
import produbanco from '../assets/logos/AuspiciaProdubanco2.png'

export default function EventBanner() {
  return (
    <section className={styles.banner} aria-labelledby="evento-titulo">
      <div className={`container ${styles.inner}`}>
     
      
        <div className={styles.info}>
             <img src={coffeeShow} alt="Coffee Show banner" />
          <p className={styles.date}>
            <strong>{EVENTO.fechas}</strong>
            <br />
            <span>{EVENTO.lugar}</span>
          </p>
          {EVENTO.mostrarEntradas && (
            <>
              <a className="btn btn--naranja btn--lg" href={EVENTO.urlEntradas} target="_blank" rel="noreferrer">
                Comprar Entradas
              </a>
              <img src={buenPlan} alt="Buen Plan" className={styles.imageBuenPlan} />
            </>
          )}
             <img src={produbanco} alt="Coffee Show banner" className={styles.imageProdubanco}/>
        </div>
      </div>
    </section>
  );
}
