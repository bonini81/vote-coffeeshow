// Fotos de la galería de cada cafetería (src/assets/cafeterias/<NOMBRE>/<NOMBRE><n>.jpg).
// La carpeta se asocia por nombre o slug sin tildes, espacios ni símbolos: "Il Barista" -> "ilbarista".

const archivos = import.meta.glob('../assets/cafeterias/*/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});

const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const galerias = {};
for (const ruta of Object.keys(archivos).sort((a, b) =>
  a.localeCompare(b, undefined, { numeric: true }),
)) {
  const partes = ruta.split('/');
  const clave = normalizar(partes[partes.length - 2]);
  (galerias[clave] ??= []).push(archivos[ruta]);
}

export function galeriaDe(cafeteria) {
  for (const texto of [cafeteria.nombre, cafeteria.slug]) {
    if (!texto) continue;
    const fotos = galerias[normalizar(texto)];
    if (fotos) return fotos;
  }
  return [];
}
