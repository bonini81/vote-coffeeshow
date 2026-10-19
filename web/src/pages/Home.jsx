import CafeteriaCard from '../components/CafeteriaCard.jsx';
import Logo from '../components/Logo.jsx';
import PremiosBanner from '../components/PremiosBanner.jsx';
import PublicLayout from '../components/PublicLayout.jsx';
import Sponsor from '../components/Sponsor.jsx';
import { CONCURSO, EVENTO } from '../data/config.js';
import { useCafeterias } from '../hooks/useCafeterias.js';
import rutaDelCoffee from '../assets/heros/rutaDelCoffee1.png';
import produbanco1 from '../assets/logos/AuspiciaProdubanco1.png';
import kissLeft from '../assets/fondos/kiss-left.png';
import kissRight from '../assets/fondos/kiss-right.png';
import styles from './Home.module.css';

// Orden de aparición en la Home (clave = nombre sin tildes ni símbolos). Las no listadas van al final.
const ORDEN_HOME = [
  'guayasamin',
  'raymi',
  'stratto',
  'isvar',
  'legacy',
  'broz',
  'palatu',
  'ilbarista',
  'floyds',
  'cabranegra',
  'atavico',
  'coatis',
  'jae',
  'kafos',
];

const clave = (c) =>
  c.nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const posicion = (c) => {
  const i = ORDEN_HOME.indexOf(clave(c));
  return i === -1 ? ORDEN_HOME.length : i;
};

export default function Home() {
  const { cafeterias: lista, cargando, error } = useCafeterias();
  const cafeterias = [...lista].sort((a, b) => posicion(a) - posicion(b));

  return (
    <PublicLayout conHeader={false}>
      <div className={styles.page}>
      <section className={styles.hero}>
        <img src={kissRight} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissHero}`} />
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroText}>
           
              
              <img src={rutaDelCoffee} width="350px" className={styles.imageCoffeeShow} />
                <img src={produbanco1} width="220px" className={styles.imageProdubanco} />
                  

          </div>
        </div>
      </section>

      <PremiosBanner />

      <section className={`section ${styles.participantes}`} aria-labelledby="participantes">
        <img src={kissLeft} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissLeft}`} />
        <img src={kissRight} alt="" aria-hidden="true" className={`${styles.kiss} ${styles.kissBottom}`} />
        <div className="container">
          <header className={styles.intro}>
            <h2 id="participantes">
              Dale click, conoce la historia de cada uno y vota por tu favorito
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

          <ul className={`${styles.grid} ${cargando || error ? styles.sinFondo : ''}`}>
            {cafeterias.map((c) => (
              <li key={c.id}>
                <CafeteriaCard cafeteria={c} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      </div>
    </PublicLayout>
  );
}
