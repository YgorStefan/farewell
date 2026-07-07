import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export function AdminModal({ title, open, onClose, onSubmit, submitting, children }) {
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
      onClose();
    };
    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  if (!open) return null;

  return (
    <dialog ref={dialogRef} className="admin-modal" id="admin-modal">
      <div className="admin-modal__backdrop" onClick={onClose} onKeyDown={(e) => e.key === 'Escape' && onClose()} role="presentation" />
      <form className="admin-modal__content" onSubmit={handleSubmit}>
        <header className="admin-modal__header">
          <h2 className="admin-modal__title">{title}</h2>
          <button
            type="button"
            className="admin-modal__close"
            onClick={onClose}
            aria-label="Fechar"
          >
            ×
          </button>
        </header>

        <div className="admin-modal__body">{children}</div>

        <footer className="admin-modal__footer">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Salvando…' : 'Salvar'}
          </button>
        </footer>
      </form>
    </dialog>
  );
}

AdminModal.propTypes = {
  title: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  children: PropTypes.node,
};

export function FormField({ label, id, children }) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={id}>
        {label}
      </label>
      {children}
    </div>
  );
}

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
