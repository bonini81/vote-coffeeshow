import { useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer.jsx';
import { auth } from '../../lib/firebase.js';
import styles from './Login.module.css';

const MENSAJES = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/invalid-email': 'Correo o contraseña incorrectos.',
  'auth/user-disabled': 'Esta cuenta está deshabilitada.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.',
  'auth/network-request-failed': 'No hay conexión. Revisa tu internet e inténtalo de nuevo.',
};

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }
    setEnviando(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), password);
      const { claims } = await user.getIdTokenResult(true);
      if (claims.admin !== true) {
        await signOut(auth);
        setError('Esta cuenta no tiene acceso al backoffice.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(MENSAJES[err?.code] ?? 'No pudimos iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
      <main className={styles.page}>
        <form className={styles.form} onSubmit={enviar} noValidate>
          <h1 className={styles.title}>Backoffice</h1>
          <p className={styles.intro}>Ingresa con tu cuenta de administrador.</p>

          <label htmlFor="email" className="visually-hidden">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            autoComplete="username"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />

          <label htmlFor="password" className="visually-hidden">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />

          {error && (
            <p className={styles.error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn btn--primary" disabled={enviando}>
            {enviando ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
