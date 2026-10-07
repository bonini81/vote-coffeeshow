import { useLocation } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import PublicLayout from '../components/PublicLayout.jsx';
import Sponsor from '../components/Sponsor.jsx';
import styles from './Gracias.module.css';
import coffeeShow from '../assets/fondos/rutaCoffeShow.png';

export default function Gracias() {
  const { state } = useLocation();

  return (
    <PublicLayout conHeader={false} conEvento={false} conSponsors>
      <section className={styles.gracias}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.brand}>
       
            <Sponsor />
          </div>
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
         
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
