import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout.jsx';
import styles from './Privacidad.module.css';

export default function Terminos() {
  return (
    <PublicLayout conEvento={false}>
      <article className={`container section ${styles.texto}`}>
        <h1>Términos y Condiciones de Uso</h1>
        <p>
          Estos Términos y Condiciones (en adelante, los "Términos") regulan el acceso y uso del
          sitio web rutadelcoffeeshow.ec (en adelante, el "Sitio") y la participación en la dinámica
          de votación para elegir tu cafetería favorita que clasificará al evento Coffee Show
          Supermaxi 2027.
        </p>
        <p>
          Al acceder al Sitio y emitir tu voto, aceptas estar sujeto a estos Términos. Si no estás
          de acuerdo con ellos, te rogamos que no utilices el Sitio ni participes en la votación.
        </p>

        <h2>1. Dinámica de la Votación</h2>
        <p>
          El propósito de este Sitio es permitir al público votar por su cafetería favorita para que
          las 8 más votadas sean parte del Coffee Show Supermaxi 2027.
        </p>
        <ul>
          <li>
            <strong>Período de votación:</strong> Las votaciones estarán abiertas desde el jueves 22
            de octubre hasta el domingo 22 de noviembre, 2026. Nos reservamos el derecho de
            modificar estas fechas si las circunstancias lo requieren, notificándolo en el Sitio.
          </li>
          <li>
            <strong>Requisitos:</strong> Para votar, el usuario deberá proporcionar información
            veraz en el formulario y aceptar nuestra{' '}
            <Link to="/privacidad">Política de Privacidad</Link>.
          </li>
        </ul>

        <h2>2. Reglas de Votación y Prevención de Fraude</h2>
        <p>Para garantizar un proceso justo y transparente, se establecen las siguientes reglas estrictas:</p>
        <ol>
          <li>
            <strong>Límite de votos:</strong> Se permite únicamente{' '}
            <strong>1 voto por persona / 1 voto por dirección de correo electrónico</strong> durante
            la vigencia del concurso.
          </li>
          <li>
            <strong>Prohibición de prácticas fraudulentas:</strong> Queda estrictamente prohibido el
            uso de bots, scripts, macros, generadores de correos electrónicos falsos o temporales,
            granjas de clics, redes privadas virtuales (VPN) con fines de ocultamiento, u otros
            métodos automatizados o semi-automatizados para inflar votos.
          </li>
          <li>
            <strong>Auditoría y Anulación:</strong> La organización de Coffee Show Supermaxi
            auditará los resultados de forma continua. Nos reservamos el derecho inapelable de{' '}
            <strong>descalificar, anular o eliminar</strong> cualquier voto, o conjunto de votos,
            que consideremos sospechosos, fraudulentos o que infrinjan estos Términos, sin previo
            aviso.
          </li>
        </ol>

        <h2>3. Elegibilidad</h2>
        <p>
          Para participar en la votación, debes ser mayor de 18 años. Si eres menor de edad, debes
          contar con el permiso de tus padres o tutores legales para participar y proporcionar tus
          datos.
        </p>

        <h2>4. Sorteos o Premios para los Votantes</h2>
        <p>Como parte del concurso, se sortearán diversos premios para los votantes:</p>
        <p>
          <u>Detalle de premios:</u>
        </p>
        <ul>
          <li>
            <strong>Premio 1:</strong> 1 Freidora de Aire Digital 8L Holstein Serenity Collection
          </li>
          <li>
            <strong>Premio 2:</strong> 5 Cafeteras de 12 Tazas Holstein Serenity Collection
          </li>
          <li>
            <strong>Premio 3:</strong> 10 Wafleras Personal Holstein Serenity Collection
          </li>
        </ul>
        <p>
          <u>Condiciones:</u>
        </p>
        <ul>
          <li>Los premios son intransferibles y no canjeables por dinero en efectivo.</li>
          <li>
            Los ganadores serán notificados a través de las redes sociales de Coffee Show Supermaxi (
            <a href="https://www.instagram.com/coffeeshowec/" target="_blank" rel="noopener noreferrer">
              https://www.instagram.com/coffeeshowec/
            </a>
            ) y al correo electrónico proporcionado. Si no responden en un plazo de 3 días, el
            premio será reasignado.
          </li>
        </ul>

        <h2>5. Propiedad Intelectual</h2>
        <p>
          Todo el contenido del Sitio, incluyendo textos, gráficos, logotipos, diseño de la
          interfaz y código fuente, es propiedad de{' '}
          <strong>Coffee Show Supermaxi y su organizador WOM Agency,</strong> se utiliza bajo
          licencia o permiso de las cafeterías participantes. Queda prohibida su reproducción,
          distribución o modificación sin autorización previa y por escrito. Las marcas y logotipos
          de las cafeterías participantes pertenecen a sus respectivos dueños.
        </p>

        <h2>6. Modificación o Cancelación del Evento</h2>
        <p>
          Nos reservamos el derecho de suspender, cancelar o modificar la dinámica de votación en
          caso de fallos técnicos, ataques informáticos, desastres naturales, o cualquier otra
          causa de fuerza mayor que comprometa la integridad del evento o el funcionamiento del
          Sitio.
        </p>

        <h2>7. Limitación de Responsabilidad</h2>
        <p>
          El Sitio se proporciona "tal cual". No garantizamos que el acceso al Sitio sea
          ininterrumpido o libre de errores. La Ruta del Coffee Show Supermaxi no se hace
          responsable por:
        </p>
        <ul>
          <li>
            Votos que no se registren debido a problemas de conexión a internet o fallos en el
            navegador del usuario.
          </li>
          <li>Daños o perjuicios derivados del uso o la imposibilidad de uso del Sitio.</li>
        </ul>

        <h2>8. Ley Aplicable y Jurisdicción</h2>
        <p>
          Estos Términos se rigen por las leyes de Ecuador. Cualquier disputa que surja en relación
          con este Sitio o la votación será sometida a la jurisdicción de los tribunales
          competentes de <strong>Quito, Ecuador.</strong>
        </p>

        <h2>9. Contacto</h2>
        <p>
          Si tienes alguna duda, reclamo o comentario sobre estos Términos o el proceso de
          votación, puedes contactarnos en: <a href="mailto:creativos@wom.ec">creativos@wom.ec</a>
        </p>
      </article>
    </PublicLayout>
  );
}
