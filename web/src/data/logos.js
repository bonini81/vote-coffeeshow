// Logos en miniatura de las cafeterías (src/assets/logos/thumbs/<clave>-thumb.<ext>).
// La clave es el nombre o slug sin tildes, espacios ni símbolos: "Il Barista" -> "ilbarista".

const archivos = import.meta.glob('../assets/logos/thumbs/*-thumb.*', {
  eager: true,
  import: 'default',
});

const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const logos = Object.fromEntries(
  Object.entries(archivos).map(([ruta, url]) => [
    normalizar(ruta.split('/').pop().replace(/-thumb\..+$/, '')),
    url,
  ]),
);

// Archivos cuyo nombre no coincide con el de la cafetería.
const ALIAS = { ilbarista: 'barista', atavico: 'attavico' };

export function logoDe(cafeteria) {
  for (const texto of [cafeteria.nombre, cafeteria.slug]) {
    if (!texto) continue;
    const clave = normalizar(texto);
    const logo = logos[clave] ?? logos[ALIAS[clave]];
    if (logo) return logo;
  }
  return null;
}
