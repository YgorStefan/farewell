import { useState, useEffect, useCallback } from 'react';
import { AdminTable } from './AdminTable.jsx';
import { AdminModal, FormField } from './AdminModal.jsx';
import { ConfirmDialog } from './ConfirmDialog.jsx';
import {
  fetchRegistros,
  createRegistro,
  updateRegistro,
  deleteRegistro,
  fetchLookupPessoas,
} from '../../services/api.js';
import { useDebounce } from '../../hooks/useDebounce.js';

const COLUMNS = [
  { key: 'id', label: 'ID', className: 'col-id' },
  { key: 'numero_registro', label: 'Nº Registro' },
  { key: 'nome_completo', label: 'Pessoa' },
  { key: 'faf', label: 'FAF' },
  { key: 'local_obito', label: 'Local do Óbito' },
  {
    key: 'data_obito',
    label: 'Data do Óbito',
    render: (row) => formatDateTime(row.data_obito),
  },
  { key: 'funeraria', label: 'Funerária' },
];

function formatDateTime(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

function toInputDateTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

const EMPTY = {
  pessoa_id: '',
  numero_registro: '',
  faf: '',
  local_obito: '',
  data_obito: '',
  funeraria: '',
};

export function RegistrosTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [pessoas, setPessoas] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRegistros(debouncedSearch);
      setRows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const loadLookups = async () => {
    try {
      const p = await fetchLookupPessoas();
      setPessoas(p);
    } catch { /* ignore */ }
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = async () => {
    setEditing(null);
    setForm(EMPTY);
    await loadLookups();
    setModalOpen(true);
  };

  const openEdit = async (row) => {
    setEditing(row);
    setForm({
      pessoa_id: String(row.pessoa_id ?? ''),
      numero_registro: row.numero_registro ?? '',
      faf: row.faf ?? '',
      local_obito: row.local_obito ?? '',
      data_obito: toInputDateTime(row.data_obito),
      funeraria: row.funeraria ?? '',
    });
    await loadLookups();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = { ...form, pessoa_id: Number(form.pessoa_id) };
    try {
      if (editing) {
        await updateRegistro(editing.id, payload);
        showToast('Registro atualizado com sucesso');
      } else {
        await createRegistro(payload);
        showToast('Registro criado com sucesso');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteRegistro(deleteTarget.id);
      showToast('Registro excluído com sucesso');
      setDeleteTarget(null);
      load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="admin-tab">
      <div className="admin-tab__toolbar">
        <div className="admin-tab__search">
          <input
            type="search"
            placeholder="Buscar por registro, nome ou funerária…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-tab__search-input"
            id="search-registros"
          />
        </div>
        <button type="button" className="btn btn--primary" onClick={openCreate} id="btn-new-registro">
          + Novo Registro
        </button>
      </div>

      {toast && (
        <output className={`admin-toast admin-toast--${toast.type}`}>
          {toast.msg}
        </output>
      )}

      {loading && <div className="admin-tab__loading">Carregando…</div>}
      {error && <div className="admin-toast admin-toast--error">{error}</div>}

      {!loading && !error && (
        <AdminTable
          columns={COLUMNS}
          rows={rows}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          emptyMessage="Nenhum registro de óbito encontrado."
        />
      )}

      <AdminModal
        title={editing ? 'Editar Registro de Óbito' : 'Novo Registro de Óbito'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <FormField label="Pessoa" id="registro-pessoa">
          <select id="registro-pessoa" value={form.pessoa_id} onChange={set('pessoa_id')} required>
            <option value="">Selecione…</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Nº Registro" id="registro-numero">
          <input id="registro-numero" value={form.numero_registro} onChange={set('numero_registro')} placeholder="REG-2026-0001" required />
        </FormField>
        <FormField label="FAF" id="registro-faf">
          <input id="registro-faf" value={form.faf} onChange={set('faf')} placeholder="FAF-001" />
        </FormField>
        <FormField label="Local do Óbito" id="registro-local">
          <input id="registro-local" value={form.local_obito} onChange={set('local_obito')} required />
        </FormField>
        <FormField label="Data do Óbito" id="registro-data">
          <input id="registro-data" type="datetime-local" value={form.data_obito} onChange={set('data_obito')} required />
        </FormField>
        <FormField label="Funerária" id="registro-funeraria">
          <input id="registro-funeraria" value={form.funeraria} onChange={set('funeraria')} required />
        </FormField>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir Registro de Óbito"
        message={`Tem certeza que deseja excluir o registro "${deleteTarget?.numero_registro}"? Esta ação é irreversível e também excluirá todos os velórios associados.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
