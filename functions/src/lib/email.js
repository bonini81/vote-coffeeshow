// Sin "/" porque el email normalizado es el ID del documento en votosPorEmail.
const EMAIL_RE = /^[^\s@/]+@[^\s@/]+\.[^\s@/]{2,}$/;

/** Normalización acordada: trim + minúsculas (es también el ID de votosPorEmail). */
export function normalizarEmail(valor) {
  return String(valor ?? '')
    .trim()
    .toLowerCase();
}

export function esEmailValido(email) {
  return email.length <= 254 && EMAIL_RE.test(email);
}
