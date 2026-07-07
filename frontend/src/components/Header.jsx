import PropTypes from 'prop-types';
import { formatTime } from '../utils/formatDate.js';

function VigilCandle() {
  return (
    <svg
      className="vigil__candle"
      viewBox="0 0 24 32"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id="flameGlow" cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#eac26b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#eac26b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="vigil__glow" cx="12" cy="8" r="8" fill="url(#flameGlow)" />
      <path
        className="vigil__flame"
        d="M12 2.5c2.1 2.6 3.1 4.5 3.1 6.3 0 2.3-1.4 3.8-3.1 3.8s-3.1-1.5-3.1-3.8c0-1.8 1-3.7 3.1-6.3Z"
        fill="#d9a23f"
      />
      <path
        className="vigil__flame"
        d="M12 5.6c1 1.4 1.5 2.5 1.5 3.5 0 1.3-.7 2.1-1.5 2.1s-1.5-.8-1.5-2.1c0-1 .5-2.1 1.5-3.5Z"
        fill="#f6dd9c"
      />
      <path d="M12 12.6v2.1" stroke="#54595f" strokeWidth="1.4" strokeLinecap="round" />
      <rect
        x="8.2"
        y="14.6"
        width="7.6"
        height="11.6"
        rx="1.7"
        fill="#eef3f8"
        stroke="#3b66a7"
        strokeWidth="1.4"
      />
      <path d="M6.4 26.9h11.2" stroke="#3b66a7" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function Header({ total, emVelorio = 0, emSepultamento = 0, lastUpdated, refreshing, children }) {
  return (
    <header className={`header ${refreshing ? 'header--refreshing' : ''}`}>
      <img className="header__logo" src="/logo.png?v=2" alt="Memorial Farewell" />

      <div className="header__brand">
        <h1 className="header__title">Painel de Velórios e Sepultamentos</h1>
        <div className="header__statusline" role="status" aria-live="polite">
          <span className="vigil" aria-hidden="true">
            <VigilCandle />
          </span>
          <span className="header__count">{emVelorio} em velório</span>
          <span className="header__sep" aria-hidden="true">·</span>
          <span className="header__count">{emSepultamento} em sepultamento</span>
          <span className="header__sep" aria-hidden="true">·</span>
          <span className="header__count header__count--total">{total} no total</span>
        </div>
        {lastUpdated && (
          <span className="header__updated">
            Atualizado às {formatTime(lastUpdated)}
          </span>
        )}
        {lastUpdated && (
          <span className="header__progress" aria-hidden="true">
            <span className="header__progress-fill" key={lastUpdated.getTime()} />
          </span>
        )}
      </div>

      {children}
    </header>
  );
}

Header.propTypes = {
  total: PropTypes.number.isRequired,
  emVelorio: PropTypes.number,
  emSepultamento: PropTypes.number,
  lastUpdated: PropTypes.instanceOf(Date),
  refreshing: PropTypes.bool,
  children: PropTypes.node,
};
