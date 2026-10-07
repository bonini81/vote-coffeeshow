import { useCallback, useEffect, useMemo, useState } from 'react';
import { signOut } from 'firebase/auth';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';
import Footer from '../../components/Footer.jsx';
import { useCafeterias } from '../../hooks/useCafeterias.js';
import { descargarCsv } from '../../lib/csv.js';
import { auth, db } from '../../lib/firebase.js';
import styles from './Dashboard.module.css';
import VotosChart from './VotosChart.jsx';

const TAMANO_PAGINA = 50;

const formatoFecha = new Intl.DateTimeFormat('es-EC', { dateStyle: 'short', timeStyle: 'short' });

const fechaDe = (voto) => {
  const fecha = voto.creadoEn?.toDate?.();
  return fecha ? formatoFecha.format(fecha) : '';
};

const hashCorto = (hash) => (hash ? `${hash.slice(0, 8)}…` : '');

export default function Dashboard({ usuario }) {
  const { cafeterias } = useCafeterias();
  const [conteos, setConteos] = useState({});
  const [votos, setVotos] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hayMas, setHayMas] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [cargandoMas, setCargandoMas] = useState(false);
  const [exportando, setExportando] = useState(false);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const nombreDe = useCallback(
    (id) => cafeterias.find((c) => c.id === id)?.nombre ?? id,
    [cafeterias],
  );

  const cargarPagina = useCallback(async (despuesDe) => {
    const consulta = despuesDe
      ? query(
          collection(db, 'votos'),
          orderBy('creadoEn', 'desc'),
          startAfter(despuesDe),
          limit(TAMANO_PAGINA),
        )
      : query(collection(db, 'votos'), orderBy('creadoEn', 'desc'), limit(TAMANO_PAGINA));
    const snap = await getDocs(consulta);
    setVotos((prev) => [...prev, ...snap.docs.map((d) => ({ id: d.id, ...d.data() }))]);
    setCursor(snap.docs.at(-1) ?? despuesDe);
    setHayMas(snap.size === TAMANO_PAGINA);
  }, []);

  useEffect(() => {
    let activo = true;
    (async () => {
      try {
        const [snapConteos] = await Promise.all([
          getDocs(collection(db, 'conteos')),
          cargarPagina(null),
        ]);
        if (!activo) return;
        setConteos(Object.fromEntries(snapConteos.docs.map((d) => [d.id, d.data().votos ?? 0])));
      } catch {
        if (activo) setError('No pudimos cargar los datos. Recarga la página.');
      } finally {
        if (activo) setCargando(false);
      }
    })();
    return () => {
      activo = false;
    };
  }, [cargarPagina]);

  const datosGrafico = useMemo(
    () =>
      cafeterias
        .map((c) => ({ nombre: c.nombre, votos: conteos[c.id] ?? 0 }))
        .sort((a, b) => b.votos - a.votos),
    [cafeterias, conteos],
  );
  const totalVotos = datosGrafico.reduce((suma, d) => suma + d.votos, 0);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return votos;
    return votos.filter((v) =>
      [v.nombre, v.apellido, v.emailNormalizado, nombreDe(v.cafeteriaId)]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [votos, busqueda, nombreDe]);

  const verMas = async () => {
    setCargandoMas(true);
    try {
      await cargarPagina(cursor);
    } catch {
      setError('No pudimos cargar más votos.');
    } finally {
      setCargandoMas(false);
    }
  };

  const exportar = async () => {
    setExportando(true);
    setError('');
    try {
      const snap = await getDocs(query(collection(db, 'votos'), orderBy('creadoEn', 'desc')));
      const filas = snap.docs.map((d) => {
        const v = d.data();
        return [
          fechaDe(v),
          nombreDe(v.cafeteriaId),
          v.nombre,
          v.apellido,
          v.emailNormalizado,
          v.cedulaHash,
        ];
      });
      descargarCsv(
        `votos-${new Date().toISOString().slice(0, 10)}.csv`,
        ['Fecha', 'Cafetería', 'Nombre', 'Apellido', 'Email', 'Cédula (hash)'],
        filas,
      );
    } catch {
      setError('No pudimos exportar el CSV. Inténtalo de nuevo.');
    } finally {
      setExportando(false);
    }
  };

  return (
    <>
      <header className={styles.barra}>
        <div className={`container ${styles.barraInner}`}>
          <strong>Backoffice</strong>
          <span className={styles.usuario}>{usuario.email}</span>
          <button type="button" className={styles.salir} onClick={() => signOut(auth)}>
            Salir
          </button>
        </div>
      </header>

      <main className={`container ${styles.main}`}>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <section>
          <h2 className={styles.h2}>Cafeterías más votadas</h2>
          <p className={styles.sub}>{totalVotos} votos en total</p>
          {cargando ? <p>Cargando…</p> : <VotosChart datos={datosGrafico} />}
        </section>

        <section>
          <div className={styles.cabeceraTabla}>
            <h2 className={styles.h2}>Votos</h2>
            <input
              type="search"
              placeholder="Buscar por nombre, email o cafetería"
              aria-label="Buscar votos"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className={styles.input}
            />
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={exportar}
              disabled={exportando || cargando}
            >
              {exportando ? 'Exportando…' : 'Descargar CSV'}
            </button>
          </div>

          <div className={styles.tablaWrap}>
            <table className={styles.tabla}>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Cafetería</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Cédula (hash)</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((v) => (
                  <tr key={v.id}>
                    <td>{fechaDe(v)}</td>
                    <td>{nombreDe(v.cafeteriaId)}</td>
                    <td>
                      {v.nombre} {v.apellido}
                    </td>
                    <td>{v.emailNormalizado}</td>
                    <td className={styles.hash}>{hashCorto(v.cedulaHash)}</td>
                  </tr>
                ))}
                {!cargando && filtrados.length === 0 && (
                  <tr>
                    <td colSpan={5} className={styles.vacio}>
                      {busqueda ? 'Sin resultados en los votos cargados.' : 'Aún no hay votos.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {hayMas && (
            <button type="button" className={styles.verMas} onClick={verMas} disabled={cargandoMas}>
              {cargandoMas ? 'Cargando…' : 'Ver más'}
            </button>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
