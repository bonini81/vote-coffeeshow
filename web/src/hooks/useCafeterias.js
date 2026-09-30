import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase.js';
import { CAFETERIAS } from '../data/cafeterias.js';

// La lista casi no cambia: se pide una sola vez por sesión y se comparte entre páginas.
let cache = null;

async function cargarCafeterias() {
  try {
    const snap = await getDocs(query(collection(db, 'cafeterias'), orderBy('orden')));
    const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (lista.length > 0) return lista;
    if (import.meta.env.DEV) {
      console.warn('Firestore sin cafeterías: usando datos locales. Corre `npm run seed`.');
      return CAFETERIAS;
    }
    return [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn(
        'No se pudo leer Firestore (¿emuladores apagados?). Usando datos locales.',
        error,
      );
      return CAFETERIAS;
    }
    throw error;
  }
}

export function useCafeterias() {
  const [estado, setEstado] = useState(() => ({
    cafeterias: [],
    cargando: true,
    error: null,
  }));

  useEffect(() => {
    let activo = true;
    cache ??= cargarCafeterias().catch((error) => {
      cache = null;
      throw error;
    });
    cache.then(
      (cafeterias) => activo && setEstado({ cafeterias, cargando: false, error: null }),
      (error) => activo && setEstado({ cafeterias: [], cargando: false, error }),
    );
    return () => {
      activo = false;
    };
  }, []);

  return estado;
}
