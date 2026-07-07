import PropTypes from 'prop-types';

const SKELETON_KEYS = ['s1', 's2', 's3', 's4', 's5'];

export function LoadingGrid() {
  return (
    <div className="agenda" aria-hidden="true">
      <section className="agenda__section">
        <div className="skeleton skeleton--heading" />
        <div className="agenda__rows">
          {SKELETON_KEYS.map((key) => (
            <div key={key} className="row row--skeleton">
              <div className="row__time">
                <div className="skeleton skeleton--time" />
              </div>
              <div className="row__body">
                <div className="skeleton skeleton--reg" />
                <div className="skeleton skeleton--title" />
                <div className="skeleton skeleton--support" />
              </div>
              <div className="row__aside">
                <div className="skeleton skeleton--room" />
                <div className="skeleton skeleton--button" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ErrorIcon() {
  return (
    <svg className="state__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 7.5v5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="16.3" r="1" fill="currentColor" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg className="state__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 3c1.9 2.1 1.9 3.9 0 5.4-1.9-1.5-1.9-3.3 0-5.4Z"
        fill="currentColor"
      />
      <rect
        x="9.5"
        y="10"
        width="5"
        height="9"
        rx="1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M7 21h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <ErrorIcon />
      <h2 className="state__title">Não foi possível carregar os velórios</h2>
      <p className="state__text">{message}</p>
      <button type="button" className="btn btn--ghost" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}

ErrorState.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
};

export function EmptyState({ filtered }) {
  return (
    <div className="state">
      <EmptyIcon />
      <h2 className="state__title">
        {filtered
          ? 'Nenhum atendimento para este registro'
          : 'Nenhum velório em andamento'}
      </h2>
      <p className="state__text">
        {filtered
          ? 'Verifique o número do Registro de Óbito e tente novamente.'
          : 'Não há velórios ativos no Memorial Farewell neste momento.'}
      </p>
    </div>
  );
}

EmptyState.propTypes = {
  filtered: PropTypes.bool,
};
