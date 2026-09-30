import { Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import PublicLayout from '../components/PublicLayout.jsx';
import Sponsor from '../components/Sponsor.jsx';
import styles from './Gracias.module.css';

export default function Gracias() {
  const { state } = useLocation();

  return (
    <PublicLayout conHeader={false} conEvento={false}>
      <section className={styles.gracias}>
        <div className={`container ${styles.inner}`}>
          <div className={styles.brand}>
            <Logo size="md" />
            <Sponsor />
          </div>
          <div className={styles.mensaje}>
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
            <Link to="/" className="btn">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
