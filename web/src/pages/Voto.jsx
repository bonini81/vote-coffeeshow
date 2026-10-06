import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import tazaCafe from '../assets/fondos/tazaCafe.png';
import PublicLayout from '../components/PublicLayout.jsx';
import Turnstile from '../components/Turnstile.jsx';
import { CONCURSO, EVENTO } from '../data/config.js';
import { useCafeterias } from '../hooks/useCafeterias.js';
import { esCedulaValida, normalizarCedula } from '../lib/cedula.js';
import { mensajeDeError } from '../lib/errores.js';
import { functions } from '../lib/firebase.js';
import styles from './Voto.module.css';

const submitVote = httpsCallable(functions, 'submitVote');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validar(datos) {
  const errores = {};
  if (!datos.cafeteriaId) errores.cafeteriaId = 'Selecciona una cafetería.';
  if (!datos.nombre.trim()) errores.nombre = 'Ingresa tu nombre.';
  if (!datos.apellido.trim()) errores.apellido = 'Ingresa tu apellido.';
  if (!esCedulaValida(datos.cedula)) errores.cedula = 'Ingresa una cédula ecuatoriana válida.';
  if (!EMAIL_RE.test(datos.email.trim())) errores.email = 'Ingresa un correo válido.';
  if (!datos.consentimiento) errores.consentimiento = 'Debes aceptar la política de privacidad.';
  return errores;
}

export default function Voto() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { cafeterias } = useCafeterias();

  const [datos, setDatos] = useState({
    cafeteriaId: params.get('c') ?? '',
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    consentimiento: false,
  });
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [captchaKey, setCaptchaKey] = useState(0);

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos((d) => ({ ...d, [name]: type === 'checkbox' ? checked : value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const enviar = async (e) => {
    e.preventDefault();
    setErrorGeneral('');
    const nuevosErrores = validar(datos);
    if (!turnstileToken) nuevosErrores.turnstile = 'Completa la verificación de seguridad.';
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      await submitVote({
        cafeteriaId: datos.cafeteriaId,
        nombre: datos.nombre.trim(),
        apellido: datos.apellido.trim(),
        cedula: normalizarCedula(datos.cedula),
        email: datos.email.trim(),
        consentimiento: datos.consentimiento,
        turnstileToken,
      });
      const cafeteria = cafeterias.find((c) => c.id === datos.cafeteriaId);
      navigate('/gracias', { replace: true, state: { cafeteria: cafeteria?.nombre } });
    } catch (error) {
      setErrorGeneral(mensajeDeError(error));
      // El token es de un solo uso: pedimos uno nuevo para el siguiente intento.
      setTurnstileToken('');
      setCaptchaKey((k) => k + 1);
    } finally {
      setEnviando(false);
    }
  };

  const campo = (name, label, props = {}) => (
    <div className={styles.field}>
      <label htmlFor={name} className="visually-hidden">
        {label}
      </label>
      <input
        id={name}
        name={name}
        placeholder={label}
        value={datos[name]}
        onChange={cambiar}
        aria-invalid={Boolean(errores[name])}
        aria-describedby={errores[name] ? `${name}-error` : undefined}
        className={styles.input}
        {...props}
      />
      {errores[name] && (
        <span id={`${name}-error`} className={styles.error}>
          {errores[name]}
        </span>
      )}
    </div>
  );

  return (
    <PublicLayout cafeteriaSlug={datos.cafeteriaId || undefined}>
      <section className={`section ${styles.fondo}`}>
        <div className={`container ${styles.layout}`}>
          <div className={styles.media}>
            <img src={tazaCafe} alt="" />
          </div>

          <div>
            <h1 className={styles.title}>¡Vota y participa!</h1>
            <p className={styles.intro}>
              Las {CONCURSO.ganadores} más votadas ganarán un espacio sin costo en la Zona de
              Especialidad Produbanco dentro del <strong>{EVENTO.nombre}</strong> y competirán por la taza dorada.
            </p>

            <form className={styles.form} onSubmit={enviar} noValidate>
              <div className={styles.field}>
                <label htmlFor="cafeteriaId" className="visually-hidden">
                  Cafetería
                </label>
                <select
                  id="cafeteriaId"
                  name="cafeteriaId"
                  value={datos.cafeteriaId}
                  onChange={cambiar}
                  aria-invalid={Boolean(errores.cafeteriaId)}
                  className={styles.input}
                >
                  <option value="">Selecciona tu café de especialidad favorito</option>
                  {cafeterias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
                {errores.cafeteriaId && <span className={styles.error}>{errores.cafeteriaId}</span>}
              </div>

              {campo('nombre', 'Nombre', { autoComplete: 'given-name' })}
              {campo('apellido', 'Apellido', { autoComplete: 'family-name' })}
              {campo('cedula', 'Cédula', {
                inputMode: 'numeric',
                maxLength: 12,
                autoComplete: 'off',
              })}
              {campo('email', 'Email', {
                type: 'email',
                autoComplete: 'email',
                inputMode: 'email',
              })}

              <div className={styles.field}>
                <label className={styles.check}>
                  <input
                    type="checkbox"
                    name="consentimiento"
                    checked={datos.consentimiento}
                    onChange={cambiar}
                    aria-invalid={Boolean(errores.consentimiento)}
                  />
                  <span>
                    He leído y acepto la{' '}
                    <Link to="/privacidad" target="_blank">
                      política de privacidad
                    </Link>
                    .
                  </span>
                </label>
                {errores.consentimiento && (
                  <span className={styles.error}>{errores.consentimiento}</span>
                )}
              </div>

              <div className={styles.field}>
                <Turnstile key={captchaKey} onToken={setTurnstileToken} />
                {errores.turnstile && <span className={styles.error}>{errores.turnstile}</span>}
              </div>

              {errorGeneral && (
                <p className={styles.errorGeneral} role="alert">
                  {errorGeneral}
                </p>
              )}

              <button type="submit" className="btn btn--primary" disabled={enviando}>
                {enviando ? 'Enviando…' : 'Votar'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
