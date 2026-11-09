// Detección de navegadores internos de redes sociales (WebView de Instagram, Facebook, TikTok).
// Solo existen en móvil: en escritorio los enlaces se abren en el navegador normal.

const MOVIL_RE = /Android|iPhone|iPad|iPod/i;
const INTERNO_RE = /Instagram|FBAN|FBAV|FB_IAB|TikTok|musical_ly/i;

export function enNavegadorInterno(userAgent = globalThis.navigator?.userAgent ?? '') {
  return MOVIL_RE.test(userAgent) && INTERNO_RE.test(userAgent);
}
