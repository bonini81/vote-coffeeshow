import { useEffect, useRef } from 'react';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
// Clave de pruebas de Cloudflare (siempre aprueba) para desarrollo sin VITE_TURNSTILE_SITE_KEY.
const SITE_KEY_PRUEBA = '1x00000000000000000000AA';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || SITE_KEY_PRUEBA;

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
 * cuando expira o falla. El token es de un solo uso: para pedir uno nuevo hay que
 * remontar el componente (cambiar su `key`).
 */
export default function Turnstile({ onToken }) {
  const contenedor = useRef(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    let widgetId;
    let activo = true;

    cargarScript()
      .then((turnstile) => {
        if (!activo || !contenedor.current) return;
        widgetId = turnstile.render(contenedor.current, {
          sitekey: SITE_KEY,
          language: 'es',
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        });
      })
      .catch(() => onTokenRef.current(''));

    return () => {
      activo = false;
      if (widgetId !== undefined) window.turnstile?.remove(widgetId);
    };
  }, []);

  return <div ref={contenedor} />;
}
