import PropTypes from 'prop-types';
import { formatDateTimeSmart } from '../utils/formatDate.js';

const ICON_DOWNLOAD = 'M12 3v12m0 0l-4-4m4 4l4-4M5 21h14';
const ICON_CHECK = 'M5 13l4 4L19 7';

function BtnIcon({ d, strokeWidth = 2 }) {
  return (
    <svg className="btn__icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        d={d}
      />
    </svg>
  );
}

BtnIcon.propTypes = {
  d: PropTypes.string.isRequired,
  strokeWidth: PropTypes.number,
};

function Field({ label, value }) {
  return (
    <div className="row__field">
      <span className="row__field-label">{label}</span>
      <span className="row__field-value">{value ?? '-'}</span>
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.node,
};

function exportButtonContent(exporting, exported) {
  if (exporting) return <span>Gerando…</span>;
  if (exported) {
    return (
      <>
        <BtnIcon d={ICON_CHECK} strokeWidth={2.4} />
        <span>Banner exportado</span>
      </>
    );
  }
  return (
    <>
      <BtnIcon d={ICON_DOWNLOAD} />
      <span>Exportar Banner</span>
    </>
  );
}

export function VelorioRow({ velorio, onExport, exporting, exported, destaque = 'sepultamento' }) {
  const sepultamento = formatDateTimeSmart(velorio.inicioSepultamento);
  const inicioVelorio = formatDateTimeSmart(velorio.inicioVelorio);

  const velorioEmDestaque = destaque === 'velorio';
  const today = velorioEmDestaque ? inicioVelorio.today : sepultamento.today;

  return (
    <article className="row">
      <div className={`row__time${today ? ' row__time--today' : ''}`}>
        <span className="row__time-label">início do velório</span>
        <span className={velorioEmDestaque ? 'row__time-value' : 'row__time-sub'}>
          {inicioVelorio.text}
        </span>
        <span className="row__time-label row__time-label--main">início do sepultamento</span>
        <span className={velorioEmDestaque ? 'row__time-sub' : 'row__time-value'}>
          {sepultamento.text}
        </span>
      </div>

      <div className="row__body">
        <span className="row__registro">{velorio.numeroRegistro}</span>
        <h2 className="row__name">{velorio.nomeCompleto}</h2>
        <div className="row__fields">
          <Field label="Local do sepultamento" value={velorio.localSepultamento} />
          <Field label="Funerária responsável" value={velorio.funeraria} />
        </div>
      </div>

      <div className="row__aside">
        <span className="row__room">{velorio.sala ?? 'Sala não informada'}</span>
        <button
          type="button"
          className={`btn btn--primary${exported ? ' btn--success' : ''}`}
          onClick={() => onExport(velorio)}
          disabled={exporting}
        >
          {exportButtonContent(exporting, exported)}
        </button>
      </div>
    </article>
  );
}

VelorioRow.propTypes = {
  velorio: PropTypes.shape({
    id: PropTypes.number,
    nomeCompleto: PropTypes.string,
    numeroRegistro: PropTypes.string,
    funeraria: PropTypes.string,
    sala: PropTypes.string,
    inicioVelorio: PropTypes.string,
    inicioSepultamento: PropTypes.string,
    localSepultamento: PropTypes.string,
  }).isRequired,
  onExport: PropTypes.func.isRequired,
  exporting: PropTypes.bool,
  exported: PropTypes.bool,
  destaque: PropTypes.oneOf(['velorio', 'sepultamento']),
};
