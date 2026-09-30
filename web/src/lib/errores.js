// Traduce errores de la callable submitVote a mensajes en español para el votante.

const MENSAJES = {
  'functions/already-exists':
    'Ya se registró un voto con estos datos. Solo se permite un voto por persona.',
  'functions/resource-exhausted':
    'Demasiados intentos desde tu conexión. Espera unos minutos e inténtalo de nuevo.',
  'functions/unimplemented': 'La votación aún no está habilitada.',
  'functions/unavailable':
    'No hay conexión con el servidor. Revisa tu internet e inténtalo de nuevo.',
};

const GENERICO = 'No pudimos registrar tu voto. Inténtalo de nuevo en unos minutos.';

export function mensajeDeError(error) {
  if (MENSAJES[error?.code]) return MENSAJES[error.code];
  // El servidor ya envía mensajes en español para validaciones (invalid-argument, failed-precondition).
  if (['functions/invalid-argument', 'functions/failed-precondition'].includes(error?.code)) {
    return error.message;
  }
  return GENERICO;
}
