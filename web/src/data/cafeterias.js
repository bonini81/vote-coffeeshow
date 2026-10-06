// Lista canónica de participantes. La usa functions/scripts/seed.js para poblar Firestore
// y el frontend como respaldo en desarrollo si el emulador no está corriendo.

const DESCRIPCION = 'Donde empieza el café de especialidad en Ecuador.';
const HISTORIA =
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.';

const NOMBRES = [
  'Stratto',
  'Isvar',
  'Legacy',
  'Palatu',
  'Il Barista',
  'Broz',
  "Floyd's",
  'Atávico',
  "Coati's",
  'Buntura',
  'Jae',
  'Nuna',
];

export function slugify(nombre) {
  return nombre
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const CAFETERIAS = NOMBRES.map((nombre, orden) => ({
  id: slugify(nombre),
  slug: slugify(nombre),
  nombre,
  orden,
  descripcion: DESCRIPCION,
  historia: HISTORIA,
  direccion: 'Lorem ipsum dolor sit amet, consectetuer adipiscing',
  telefono: '0998011457',
  horarioAtencion:  'Lorem ipsum dolor sit amet.',
  redes: {
    instagram: 'https://www.instagram.com/',
    tiktok: 'https://www.tiktok.com/',
    facebook: 'https://www.facebook.com/',
  },
  imagenUrl: '',
  videoUrl: '',
  galeria: [],
}));
