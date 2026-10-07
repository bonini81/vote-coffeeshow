// Escapa una celda CSV. Las celdas que empiezan con = + - @ se prefijan con ' para evitar
// inyección de fórmulas al abrir el archivo en Excel.
function celda(valor) {
  let texto = String(valor ?? '');
  if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`;
  return /[",\n\r]/.test(texto) ? `"${texto.replaceAll('"', '""')}"` : texto;
}

/** Descarga `filas` (arrays) como CSV; BOM UTF-8 para que Excel respete las tildes. */
export function descargarCsv(nombreArchivo, encabezados, filas) {
  const contenido = [encabezados, ...filas].map((fila) => fila.map(celda).join(',')).join('\r\n');
  const blob = new Blob(['﻿', contenido], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(url);
}
