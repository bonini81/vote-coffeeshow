import { useLocation } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import PublicLayout from '../components/PublicLayout.jsx';
import kissLeft from '../assets/fondos/kiss-left.png';
import kissRight from '../assets/fondos/kiss-right.png';
import styles from './Gracias.module.css';
import produbanco from '../assets/logos/AuspiciaProdubanco1.png';
import coffeeShow from '../assets/fondos/rutaCoffeShow.png';

export default function Gracias() {
  const { state } = useLocation();

  return (
    <PublicLayout conHeader={false} conSponsors>
      <div className={styles.pagina}>
      <img src={kissRight} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissTop}`} />
      <img src={kissLeft} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissBottom}`} />
      <section className={styles.gracias}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.mensaje}>
          <img src={coffeeShow} width="350px" className={styles.graciasImageCoffeeShow} />
            <h1 className={styles.title}>¡Gracias!</h1>
            <p className={styles.texto}>
              Tu voto
              {state?.cafeteria ? (
                <>
                  {' '}
                  por <strong>{state.cafeteria}</strong>
                </>
              ) : null}{' '}
              fue registrado.
            </p>
            <img src={produbanco} alt="Produbanco" className={styles.logoProdubanco} />
          </div>
        </div>
      </section>
      </div>
    </PublicLayout>
  );
}
