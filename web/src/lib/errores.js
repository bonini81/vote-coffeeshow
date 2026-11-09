// Traduce errores de la callable submitVote a mensajes en español para el votante.

const MENSAJES = {
  'functions/already-exists':
    'Ya se registró un voto con estos datos. Solo se permite un voto por persona.',
  'functions/resource-exhausted':
    'Demasiados intentos desde tu conexión. Espera unos minutos e inténtalo de nuevo.',
  'functions/unimplemented': 'La votación aún no está habilitada.',
  'functions/unavailable':
    'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.',
  // El SDK reporta como "internal" las caídas de red del cliente (fetch fallido).
  'functions/internal':
    'No pudimos conectar con el servidor. Revisa tu internet e inténtalo de nuevo.',
  // App Check rechazado o token vencido.
  'functions/unauthenticated': 'Recarga la página e inténtalo de nuevo.',
  'functions/deadline-exceeded': 'La conexión tardó demasiado. Inténtalo de nuevo.',
};

const GENERICO = 'No pudimos registrar tu voto. Inténtalo de nuevo en unos minutos.';

// Errores que justifican reintentar la misma petición (no llegó o no se procesó en el servidor).
export const ERRORES_REINTENTABLES = ['functions/internal', 'functions/unavailable'];

// Mensajes que el votante entiende sin código; en el resto lo añadimos para poder diagnosticar.
const SIN_CODIGO = ['functions/already-exists', 'functions/resource-exhausted', 'functions/unimplemented'];

export function mensajeDeError(error) {
  const codigo = error?.code && !SIN_CODIGO.includes(error.code) ? ` (cód: ${error.code})` : '';
  if (MENSAJES[error?.code]) return `${MENSAJES[error.code]}${codigo}`;
  // El servidor ya envía mensajes en español para validaciones (invalid-argument, failed-precondition).
  if (['functions/invalid-argument', 'functions/failed-precondition'].includes(error?.code)) {
    return error.message;
  }
  return `${GENERICO}${codigo}`;
}
