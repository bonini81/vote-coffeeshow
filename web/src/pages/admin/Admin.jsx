import { Navigate, Route, Routes } from 'react-router-dom';
import { useAdminAuth } from '../../hooks/useAdminAuth.js';
import Dashboard from './Dashboard.jsx';
import Login from './Login.jsx';

// Backoffice: /admin (panel, protegido) y /admin/login.
export default function Admin() {
  const { cargando, usuario, esAdmin } = useAdminAuth();

  if (cargando) return <p className="container section">Cargando…</p>;

  const autorizado = usuario && esAdmin;

  return (
    <Routes>
      <Route
        path="login"
        element={autorizado ? <Navigate to="/admin" replace /> : <Login />}
      />
      <Route
        index
        element={autorizado ? <Dashboard usuario={usuario} /> : <Navigate to="/admin/login" replace />}
      />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
