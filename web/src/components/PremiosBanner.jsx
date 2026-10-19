import holstein from '../assets/logos/auspiciaHolstein.png';
import styles from './PremiosBanner.module.css';

const PREMIOS = [
  { titulo: 'Premio 1', detalle: '1 Freidora de Aire Digital 8L Holstein Serenity Collection' },
  { titulo: 'Premio 2', detalle: '5 Cafeteras de 12 Tazas Holstein Serenity Collection' },
  { titulo: 'Premio 3', detalle: '10 Wafleras Personal Holstein Serenity Collection' },
];

export default function PremiosBanner() {
  return (
    <section className={styles.premios} aria-labelledby="premios">
      <div className={`container ${styles.premiosInner}`}>
        <div className={styles.premiosText}>
          <img src={holstein} alt="Holstein Housewares" className={styles.holstein} />
          <h2 id="premios" className={styles.premiosTitulo}>
            Vota por tu favorito y gana
          </h2>
          <ul className={styles.premiosLista}>
            {PREMIOS.map((p) => (
              <li key={p.titulo}>
                <strong>{p.titulo}</strong>
                <span>{p.detalle}</span>
              </li>
            ))}
          </ul>

            <h2 className={styles.premiosTitulo}>
              SON 16 GANADORES
          </h2>

        </div>
      </div>
    </section>
  );
}
