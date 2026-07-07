import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirming }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleCancel = (e) => {
      e.preventDefault();
      onCancel();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onCancel]);

  if (!open) return null;

  return (
    <dialog ref={dialogRef} className="admin-modal confirm-dialog" id="confirm-dialog">
      <div className="admin-modal__backdrop" onClick={onCancel} onKeyDown={(e) => e.key === 'Escape' && onCancel()} role="presentation" />
      <div className="admin-modal__content confirm-dialog__content">
        <div className="confirm-dialog__icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0Z"
            />
          </svg>
        </div>
        <h2 className="confirm-dialog__title">{title}</h2>
        <p className="confirm-dialog__message">{message}</p>
        <div className="confirm-dialog__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={confirming}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={confirming}
          >
            {confirming ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </div>
    </dialog>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirming: PropTypes.bool,
};
