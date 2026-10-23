import PublicLayout from '../components/PublicLayout.jsx';
import styles from './Privacidad.module.css';

export default function Privacidad() {
  return (
    <PublicLayout conEvento={false}>
      <article className={`container section ${styles.texto}`}>
        <h1>Política de Privacidad y Tratamiento de Datos Personales</h1>
        <p>
          La RUTA DEL COFFEE SHOW (en adelante, el "Sitio"), accesible desde rutadelcoffeeshow.ec,
          valoramos tu privacidad y nos comprometemos a proteger tus datos personales.
        </p>
        <p>
          Esta Política de Privacidad explica cómo recopilamos, utilizamos, compartimos y protegemos
          tu información cuando participas en nuestras votaciones para elegir a tu cafetería
          favorita que clasificará para el Coffee Show Supermaxi 2027.
        </p>

        <h2>1. Datos que recopilamos</h2>
        <p>
          Para garantizar la transparencia del proceso de votación y brindar una mejor experiencia,
          podemos recopilar la siguiente información:
        </p>
        <ul>
          <li>
            <strong>Datos de identificación:</strong> Nombre, apellido, cédula, ciudad, dirección de
            correo electrónico
          </li>
          <li>
            <strong>Datos de votación:</strong> Tus preferencias y selecciones (la cafetería por la
            que votaste).
          </li>
          <li>
            <strong>Datos técnicos:</strong> Dirección IP, tipo de navegador, zona horaria y sistema
            operativo. Esto se recopila de forma automatizada y se utiliza estrictamente para
            auditar los votos y prevenir fraudes (como votos múltiples desde bots).
          </li>
        </ul>

        <h2>2. Finalidad: ¿Para qué usamos tus datos?</h2>
        <p>La información que nos proporcionas se utiliza exclusivamente para los siguientes fines:</p>
        <ol>
          <li>
            <strong>Gestionar tu participación:</strong> Registrar y contabilizar tu voto de forma
            legítima.
          </li>
          <li>
            <strong>Prevención de fraude:</strong> Identificar y bloquear intentos de manipulación
            de los resultados de la votación (ej. uso de bots o votos masivos).
          </li>
          <li>
            <strong>Comunicación:</strong> Contactarte en caso de que tu participación te haga
            acreedor a los premios por sortear, o para enviarte los resultados finales del evento.
          </li>
          <li>
            <strong>Estadísticas:</strong> Generar informes anónimos y agregados sobre las
            preferencias del público.{' '}
            <em>No compartiremos tu identidad individual con las cafeterías.</em>
          </li>
        </ol>

        <h2>3. Base Legal para el Tratamiento</h2>
        <p>
          El tratamiento de tus datos personales se basa en tu <strong>consentimiento expreso</strong>.
          Al marcar la casilla "Acepto la Política de Privacidad" y hacer clic en el botón de votar,
          nos autorizas a procesar tus datos para los fines aquí descritos.
        </p>

        <h2>4. ¿Con quién compartimos tu información?</h2>
        <p>
          Tus datos personales{' '}
          <strong>no serán vendidos, alquilados ni cedidos a terceros</strong> para fines
          publicitarios. Solo podríamos compartir información en los siguientes casos:
        </p>
        <ul>
          <li>
            <strong>Proveedores de servicios:</strong> Plataformas de alojamiento web (ej.
            Firebase/Google Cloud) o servicios de envío de correos, que actúan bajo nuestros
            estrictos estándares de seguridad.
          </li>
          <li>
            <strong>Requerimiento legal:</strong> Si una autoridad competente u orden judicial nos
            exige proporcionar dicha información.
          </li>
          <li>
            <strong>Con las cafeterías participantes:</strong> Solo se compartirán{' '}
            <strong>datos agregados y estadísticos</strong> (ej. "La cafetería X recibió 500
            votos"). Nunca revelaremos tu nombre o correo asociándolo a tu voto específico.
          </li>
        </ul>

        <h2>5. Conservación de los Datos</h2>
        <p>
          Tus datos personales se conservarán únicamente durante el tiempo que dure el evento de
          votación y el período de auditoría posterior (aproximadamente 60 días después de
          finalizar el evento). Una vez concluido este plazo, los datos personales serán eliminados
          de forma segura o anonimizados.
        </p>

        <h2>6. Uso de Cookies</h2>
        <p>
          Utilizamos cookies técnicas y de sesión estrictamente necesarias para el funcionamiento
          del sitio web y para recordar si ya has emitido tu voto, garantizando así la integridad
          del concurso.
        </p>

        <h2>7. Tus Derechos</h2>
        <p>Como titular de los datos, tienes derecho a:</p>
        <ul>
          <li>
            <strong>Acceder</strong> a los datos que tenemos sobre ti.
          </li>
          <li>
            <strong>Rectificar</strong> cualquier información inexacta.
          </li>
          <li>
            <strong>Solicitar la eliminación</strong> de tus datos (ten en cuenta que esto podría
            anular tu voto).
          </li>
          <li>
            <strong>Retirar tu consentimiento</strong> en cualquier momento.
          </li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, puedes ponerte en contacto con nosotros a
          través del correo electrónico: <a href="mailto:creativos@wom.ec">creativos@wom.ec</a>
        </p>

        <h2>8. Cambios en esta Política</h2>
        <p>
          Nos reservamos el derecho de actualizar esta Política de Privacidad en cualquier momento.
          Cualquier cambio será publicado en esta misma página con una nueva fecha de "Última
          actualización"
        </p>
      </article>
    </PublicLayout>
  );
}
