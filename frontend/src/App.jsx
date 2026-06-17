import { useState } from 'react';
import { Header } from './components/Header.jsx';
import { SearchBar } from './components/SearchBar.jsx';
import { SectionHeading } from './components/SectionHeading.jsx';
import { VelorioRow } from './components/VelorioRow.jsx';
import { LoadingGrid, ErrorState, EmptyState } from './components/Feedback.jsx';
import { useDebounce } from './hooks/useDebounce.js';
import { useVelorios } from './hooks/useVelorios.js';
import { splitAgenda } from './utils/agenda.js';
import { downloadBanner } from './services/api.js';

export default function App() {
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

        <footer className="app__footer">
          <span>Luto Curitiba {new Date().getFullYear()}. Todos os direitos reservados.</span>
        </footer>
      </div>
    </div>
  );
}
