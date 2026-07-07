import { useState, useEffect } from 'react';
import { Header } from './components/Header.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { SectionHeading } from './components/SectionHeading.jsx';
import { VelorioRow } from './components/VelorioRow.jsx';
import { LoadingGrid, ErrorState, EmptyState } from './components/Feedback.jsx';
import { AdminPage } from './components/admin/AdminPage.jsx';
import { LoginPage } from './components/admin/LoginPage.jsx';
import { useDebounce } from './hooks/useDebounce.js';
import { useVelorios } from './hooks/useVelorios.js';
import { splitAgenda } from './utils/agenda.js';
import { downloadBanner, isAuthenticated, logoutAdmin } from './services/api.js';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return hash;
}

function PanelPage() {
  const [registro, setRegistro] = useState('');
  const debouncedRegistro = useDebounce(registro, 400);

  const { velorios, loading, refreshing, error, lastUpdated, refetch } =
    useVelorios(debouncedRegistro);

  const [exportingId, setExportingId] = useState(null);
  const [exportedId, setExportedId] = useState(null);
  const [exportError, setExportError] = useState(null);

  const handleExport = async (velorio) => {
    setExportingId(velorio.id);
    setExportError(null);
    try {
      await downloadBanner(velorio.id, velorio.numeroRegistro);
      setExportedId(velorio.id);
      setTimeout(
        () => setExportedId((current) => (current === velorio.id ? null : current)),
        2200
      );
    } catch (err) {
      setExportError(err.message ?? 'Falha ao exportar o banner');
    } finally {
      setExportingId(null);
    }
  };

  const isFiltering = debouncedRegistro.trim().length > 0;

  const renderRow = (velorio, destaque) => (
    <VelorioRow
      key={velorio.id}
      velorio={velorio}
      destaque={destaque}
      onExport={handleExport}
      exporting={exportingId === velorio.id}
      exported={exportedId === velorio.id}
    />
  );

  const { emVelorio, emSepultamento } = splitAgenda(velorios);
  const total = emVelorio.length + emSepultamento.length;

  let content;
  if (loading) {
    content = <LoadingGrid />;
  } else if (error) {
    content = <ErrorState message={error} onRetry={refetch} />;
  } else if (total === 0) {
    content = <EmptyState filtered={isFiltering} />;
  } else {
    content = (
      <div className="agenda">
        {emVelorio.length > 0 && (
          <section className="agenda__section">
            <SectionHeading>Em velório</SectionHeading>
            <div className="agenda__rows">
              {emVelorio.map((velorio) => renderRow(velorio, 'velorio'))}
            </div>
          </section>
        )}
        {emSepultamento.length > 0 && (
          <section className="agenda__section">
            <SectionHeading>Em sepultamento</SectionHeading>
            <div className="agenda__rows">
              {emSepultamento.map((velorio) => renderRow(velorio, 'sepultamento'))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      {refreshing && <div className="refresh-bar" aria-hidden="true" />}
      <div className="container">
        <Header
          total={total}
          emVelorio={emVelorio.length}
          emSepultamento={emSepultamento.length}
          lastUpdated={lastUpdated}
          refreshing={refreshing}
        >
          <SearchBar value={registro} onChange={setRegistro} />
        </Header>

        {exportError && (
          <p className="banner-error" role="alert">
            {exportError}
          </p>
        )}

        <main className="content">{content}</main>

        <div className="app__admin-link-wrapper">
          <a href="#/admin" className="app__admin-link" id="link-admin">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Administração
          </a>
        </div>

        <footer className="app__footer">
          <span>Farewell {new Date().getFullYear()}. Todos os direitos reservados.</span>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  const hash = useHashRoute();
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuth(isAuthenticated());
  }, [hash]);

  if (hash === '#/admin') {
    if (!auth) {
      return (
        <div className="app">
          <div className="container">
            <LoginPage
              onLoginSuccess={() => setAuth(true)}
              onNavigateHome={() => (window.location.hash = '')}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="app">
        <div className="container">
          <AdminPage
            onNavigateHome={() => (window.location.hash = '')}
            onLogout={() => {
              logoutAdmin();
              setAuth(false);
            }}
          />
        </div>
      </div>
    );
  }

  return <PanelPage />;
}
