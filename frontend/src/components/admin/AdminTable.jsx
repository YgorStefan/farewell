import PropTypes from 'prop-types';

export function AdminTable({ columns, rows, onEdit, onDelete, emptyMessage }) {
  if (rows.length === 0) {
    return (
      <div className="admin-table__empty">
        <p>{emptyMessage ?? 'Nenhum registro encontrado.'}</p>
      </div>
    );
  }

  return (
    <div className="admin-table__wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={col.className ?? ''}>
                {col.label}
              </th>
            ))}
            <th className="admin-table__th-actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key} className={col.className ?? ''}>
                  {col.render ? col.render(row) : (row[col.key] ?? '-')}
                </td>
              ))}
              <td className="admin-table__actions">
                <button
                  type="button"
                  className="admin-table__btn admin-table__btn--edit"
                  title="Editar"
                  onClick={() => onEdit(row)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                    />
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="admin-table__btn admin-table__btn--delete"
                  title="Excluir"
                  onClick={() => onDelete(row)}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

AdminTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      className: PropTypes.string,
    })
  ).isRequired,
  rows: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  emptyMessage: PropTypes.string,
};
