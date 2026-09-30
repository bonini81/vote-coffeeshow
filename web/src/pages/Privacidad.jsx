import PublicLayout from '../components/PublicLayout.jsx';
import { CONCURSO } from '../data/config.js';
import styles from './Privacidad.module.css';

// TODO: texto final revisado por el cliente/legal (LOPDP Ecuador) y plazo de conservación.
export default function Privacidad() {
  return (
    <PublicLayout conEvento={false}>
      <article className={`container section ${styles.texto}`}>
        <h1>Aviso de privacidad</h1>
        <p>
          Los datos que ingresas al votar (nombre, apellido, cédula y correo electrónico) se usan
          únicamente para registrar tu voto en la {CONCURSO.nombre} y garantizar que cada persona
          vote una sola vez, conforme a la Ley Orgánica de Protección de Datos Personales del
          Ecuador.
        </p>
        <h2>Qué guardamos</h2>
        <ul>
          <li>Nombre, apellido y correo electrónico.</li>
          <li>
            Tu cédula <strong>no se guarda en texto plano</strong>: se almacena un código cifrado
            que solo sirve para evitar votos duplicados.
          </li>
          <li>
            Datos técnicos mínimos (navegador e identificador cifrado de la conexión) para prevenir
            fraude.
          </li>
        </ul>
        <h2>Por cuánto tiempo</h2>
        <p>Los datos se eliminarán al cierre del concurso. [Plazo exacto por definir]</p>
        <h2>Tus derechos</h2>
        <p>
          Puedes solicitar acceso, rectificación o eliminación de tus datos escribiendo a [correo de
          contacto por definir].
        </p>
      </article>
    </PublicLayout>
  );
}
