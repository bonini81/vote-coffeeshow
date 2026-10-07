import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase.js';

/** Estado de sesión del backoffice: un usuario cuenta como admin solo con el custom claim `admin: true`. */
export function useAdminAuth() {
  const [estado, setEstado] = useState({ cargando: true, usuario: null, esAdmin: false });

  useEffect(() => {
    let activo = true;
    const baja = onAuthStateChanged(auth, async (usuario) => {
      if (!usuario) {
        if (activo) setEstado({ cargando: false, usuario: null, esAdmin: false });
        return;
      }
      try {
        const { claims } = await usuario.getIdTokenResult();
        if (activo) setEstado({ cargando: false, usuario, esAdmin: claims.admin === true });
      } catch {
        if (activo) setEstado({ cargando: false, usuario, esAdmin: false });
      }
    });
    return () => {
      activo = false;
      baja();
    };
  }, []);

  return estado;
}
