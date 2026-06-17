import PropTypes from 'prop-types';

export function SearchBar({ value, onChange }) {
  return (
    <div className="search">
      <label className="search__label" htmlFor="filtro-registro">
        Filtrar por Registro de Óbito
      </label>
      <div className="search__field">
        <svg
          className="search__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            d="M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
          />
        </svg>
        <input
          id="filtro-registro"
          type="search"
          inputMode="text"
          autoComplete="off"
          placeholder="REG-2026-0001"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {value && (
          <button
            type="button"
            className="search__clear"
            onClick={() => onChange('')}
            aria-label="Limpar filtro"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
