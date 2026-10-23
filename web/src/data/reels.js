// Shorts de YouTube y portadas de cada cafetería (src/assets/cafeterias/reelCover/<CLAVE>1.jpg).
// La clave es el nombre o slug sin tildes, espacios ni símbolos: "Il Barista" -> "ilbarista".

const portadas = import.meta.glob('../assets/cafeterias/reelCover/*', {
  eager: true,
  import: 'default',
});

const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const portadaPorClave = Object.fromEntries(
  Object.entries(portadas).map(([ruta, url]) => [
    normalizar(ruta.split('/').pop().replace(/\d*\.[^.]+$/, '')),
    url,
  ]),
);

const REELS = {
  coatis: 'hipDZdlcxmY',
  cabranegra: 'qzuzt7tYn4c',
  raymi: 'AwpaXHlSTrU',
  kafos: 'osYYhZYvU0k',
  ilbarista: 'vYinFONSLcU',
  floyds: 'jak6HYOtb70',
  palatu: 'W29yix-MU1U',
  legacy: 'bc3qBs09QVg',
  isvar: 'LaG3fsk2m2I',
  atavico: '8JbEBpPe1_U',
  stratto: '_Rmbne-ksm0',
  broz: 'R-kynEVceIU',
  jae: 'JReRXZYNitM',
  guayasamin: 'wVu0bgWY6RY',
};

export function reelDe(cafeteria) {
  for (const texto of [cafeteria.nombre, cafeteria.slug]) {
    if (!texto) continue;
    const clave = normalizar(texto);
    if (REELS[clave]) return { id: REELS[clave], portada: portadaPorClave[clave] ?? null };
  }
  return null;
}
