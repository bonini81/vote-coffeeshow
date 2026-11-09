import { useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
// Clave de pruebas de Cloudflare (siempre aprueba) para desarrollo sin VITE_TURNSTILE_SITE_KEY.
const SITE_KEY_PRUEBA = '1x00000000000000000000AA';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || SITE_KEY_PRUEBA;

// Reinicios automáticos del widget tras un error, para recuperarse de fallos puntuales de red.
const MAX_REINICIOS = 3;
const ESPERA_REINICIO_MS = 2500;

let scriptPromise;
function cargarScript() {
  scriptPromise ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = () => {
      scriptPromise = undefined;
      reject(new Error('No se pudo cargar Turnstile'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/**
 * Widget de Cloudflare Turnstile. Llama a onToken con el token al resolverse y con ''
 * cuando expira o falla. Ante un error se reinicia solo (hasta MAX_REINICIOS veces) y
 * avisa con onError(codigo) para poder mostrar o registrar la causa.
 * El token es de un solo uso: para pedir uno nuevo hay que remontar el componente
 * (cambiar su `key`).
 */
export default function Turnstile({ onToken, onError }) {
  const contenedor = useRef(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
  }, [onToken, onError]);

  useEffect(() => {
    let widgetId;
    let activo = true;
    let reinicios = 0;
    let temporizador;

    cargarScript()
      .then((turnstile) => {
        if (!activo || !contenedor.current) return;
        widgetId = turnstile.render(contenedor.current, {
          sitekey: SITE_KEY,
          language: 'es',
          retry: 'auto',
          'retry-interval': 3000,
          'refresh-expired': 'auto',
          callback: (token) => {
            reinicios = 0;
            onErrorRef.current?.('');
            onTokenRef.current(token);
          },
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': (codigo) => {
            console.warn('Turnstile error', codigo);
            onTokenRef.current('');
            onErrorRef.current?.(String(codigo ?? ''));
            if (reinicios < MAX_REINICIOS) {
              reinicios += 1;
              clearTimeout(temporizador);
              temporizador = setTimeout(() => {
                if (activo && widgetId !== undefined) window.turnstile?.reset(widgetId);
              }, ESPERA_REINICIO_MS);
            }
            return true; // ya lo manejamos: evita el aviso por defecto en consola
          },
        });
      })
      .catch(() => {
        onTokenRef.current('');
        onErrorRef.current?.('script');
      });

    return () => {
      activo = false;
      clearTimeout(temporizador);
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
    };
  }, []);

  return <div ref={contenedor} />;
}
