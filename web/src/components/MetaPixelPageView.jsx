import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// El snippet de index.html solo inicializa el píxel; el PageView se envía aquí
// para contar también la navegación interna (SPA). El backoffice no se rastrea.
export default function MetaPixelPageView() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith('/admin')) return;
    window.fbq?.('track', 'PageView');
  }, [pathname]);
  return null;
}
