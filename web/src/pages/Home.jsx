import CafeteriaCard from '../components/CafeteriaCard.jsx';
import Logo from '../components/Logo.jsx';
import PublicLayout from '../components/PublicLayout.jsx';
import Sponsor from '../components/Sponsor.jsx';
import { CONCURSO, EVENTO } from '../data/config.js';
import { useCafeterias } from '../hooks/useCafeterias.js';
import rutaDelCoffee from '../assets/heros/rutaDelCoffee1.png';
import produbanco1 from '../assets/logos/AuspiciaProdubanco1.png';
import thermalimex from '../assets/logos/thermalimex.png';
import styles from './Home.module.css';

export default function Home() {
  const { cafeterias, cargando, error } = useCafeterias();

  return (
    <PublicLayout conHeader={false}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
           
              
              <img src={rutaDelCoffee} width="350px" className={styles.imageCoffeeShow} />
                <img src={produbanco1} width="220px" className={styles.imageProdubanco} />
                  
            <p className={styles.llamado}>{CONCURSO.llamado}</p>
              <img src={thermalimex} width="220px" className={styles.imageProdubanco} />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="participantes">
        <div className="container">
          <header className={styles.intro}>
            <h2 id="participantes">
              Dale click, conoce la historia de cada uno y vota por tu favorito.
            </h2>
            <p>
              Las {CONCURSO.ganadores} más votadas ganarán un espacio sin costo en la Zona de
              Especialidad Produbanco dentro del  <strong>{EVENTO.nombre}. Votación desde el{' '}
              {CONCURSO.inicio} al {CONCURSO.cierre}.</strong>
            </p>
          </header>

          {cargando && <p className={styles.estado}>Cargando participantes…</p>}
          {error && (
            <p className={styles.estado} role="alert">
              No pudimos cargar los participantes. Intenta de nuevo en unos minutos, gracias.
            </p>
          )}

          <ul className={styles.grid}>
            {cafeterias.map((c) => (
              <li key={c.id}>
                <CafeteriaCard cafeteria={c} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PublicLayout>
  );
}
