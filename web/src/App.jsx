import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.jsx';
import Cafeteria from './pages/Cafeteria.jsx';
import Gracias from './pages/Gracias.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Privacidad from './pages/Privacidad.jsx';
import Voto from './pages/Voto.jsx';

// El backoffice (Recharts, Auth) no se descarga para los votantes.
const Admin = lazy(() => import('./pages/admin/Admin.jsx'));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cafeteria/:slug" element={<Cafeteria />} />
        <Route path="/votar" element={<Voto />} />
        <Route path="/gracias" element={<Gracias />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/admin/*" element={
            <Suspense fallback={null}>
              <Admin />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
