import { Link } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout.jsx';

export default function NotFound() {
  return (
    <PublicLayout conEvento={false}>
      <section className="container section">
        <h1>Página no encontrada</h1>
        <p>La página que buscas no existe.</p>
        <Link to="/" className="btn">
          Volver al inicio
        </Link>
      </section>
    </PublicLayout>
  );
}
