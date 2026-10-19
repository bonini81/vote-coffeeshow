// Lista canónica de participantes. La usa functions/scripts/seed.js para poblar Firestore
// y el frontend como respaldo en desarrollo si el emulador no está corriendo.

import { DATOS } from './cafeteriasDatos.js';

const DESCRIPCION = 'Donde empieza el café de especialidad en Ecuador.';
const HISTORIA =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.';

const NOMBRES = [
  'Stratto',
  'Isvar',
  'Legacy',
  'Palatu',
  'il Barista',
  'Broz',
  "Floyds",
  'Atávico',
  "Coatis",
  'Jae',
  'Cabra Negra',
  'Guayasamín',
  'Kafos',
  'Raymi',
];

export function slugify(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const REDES_DUMMY = {
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/',
  facebook: 'https://www.facebook.com/',
};

// Los datos reales vienen de cafeteriasDatos.js; lo que falte se rellena con datos de ejemplo.
export const CAFETERIAS = NOMBRES.map((nombre, orden) => {
  const d = DATOS.find((x) => x.nombre === nombre) ?? {};
  const redes = Object.fromEntries(Object.entries(d.redes ?? {}).filter(([, url]) => url));
  return {
    id: slugify(nombre),
    slug: slugify(nombre),
    nombre,
    orden,
    descripcion: DESCRIPCION,
    historia: d.historia || HISTORIA,
    direccion: d.direccion || 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
    ubicacionUrl: d.ubicacionUrl || '',
    // Sin fila en el CSV (dummy); con fila y horario vacío se muestra N/A.
    horarioAtencion: d.nombre ? d.horarioAtencion?.trim() || 'N/A' : 'Lorem ipsum dolor sit amet.',
    redes: Object.keys(redes).length ? redes : REDES_DUMMY,
    imagenUrl: '',
    videoUrl: '',
    galeria: [],
  };
});
