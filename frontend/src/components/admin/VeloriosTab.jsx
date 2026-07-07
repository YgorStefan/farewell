import { useState, useEffect, useCallback } from 'react';
import { AdminTable } from './AdminTable.jsx';
import { AdminModal, FormField } from './AdminModal.jsx';
import { ConfirmDialog } from './ConfirmDialog.jsx';
import {
  fetchAdminVelorios,
  createVelorio,
  updateVelorio,
  deleteVelorio,
  fetchLookupRegistros,
} from '../../services/api.js';
import { useDebounce } from '../../hooks/useDebounce.js';

const COLUMNS = [
  { key: 'id', label: 'ID', className: 'col-id' },
  { key: 'nome_completo', label: 'Falecido' },
  { key: 'numero_registro', label: 'Registro' },
  { key: 'local_velorio', label: 'Local do Velório' },
  { key: 'sala_velorio', label: 'Sala' },
  {
    key: 'inicio_velorio',
    label: 'Início Velório',
    render: (row) => formatDateTime(row.inicio_velorio),
  },
  {
    key: 'inicio_sepultamento',
    label: 'Início Sep.',
    render: (row) => formatDateTime(row.inicio_sepultamento),
  },
  { key: 'local_sepultamento', label: 'Local Sep.' },
  {
    key: 'fim_sepultamento',
    label: 'Status',
    render: (row) =>
      row.fim_sepultamento ? (
        <span className="admin-badge admin-badge--done">Finalizado</span>
      ) : (
        <span className="admin-badge admin-badge--active">Em andamento</span>
      ),
  },
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
  registro_obito_id: '',
  local_velorio: '',
  local_sepultamento: '',
  sala_velorio: '',
  inicio_velorio: '',
  fim_velorio: '',
  inicio_sepultamento: '',
  fim_sepultamento: '',
};

export function VeloriosTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [registros, setRegistros] = useState([]);

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
      const data = await fetchAdminVelorios(debouncedSearch);
      setRows(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => { load(); }, [load]);

  const loadLookups = async () => {
    try {
      const r = await fetchLookupRegistros();
      setRegistros(r);
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
      registro_obito_id: String(row.registro_obito_id ?? ''),
      local_velorio: row.local_velorio ?? '',
      local_sepultamento: row.local_sepultamento ?? '',
      sala_velorio: row.sala_velorio ?? '',
      inicio_velorio: toInputDateTime(row.inicio_velorio),
      fim_velorio: toInputDateTime(row.fim_velorio),
      inicio_sepultamento: toInputDateTime(row.inicio_sepultamento),
      fim_sepultamento: toInputDateTime(row.fim_sepultamento),
    });
    await loadLookups();
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      ...form,
      registro_obito_id: Number(form.registro_obito_id),
      fim_velorio: form.fim_velorio || null,
      inicio_sepultamento: form.inicio_sepultamento || null,
      fim_sepultamento: form.fim_sepultamento || null,
    };
    try {
      if (editing) {
        await updateVelorio(editing.id, payload);
        showToast('Velório atualizado com sucesso');
      } else {
        await createVelorio(payload);
        showToast('Velório criado com sucesso');
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
      await deleteVelorio(deleteTarget.id);
      showToast('Velório excluído com sucesso');
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
            placeholder="Buscar por nome, registro ou local…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-tab__search-input"
            id="search-velorios"
          />
        </div>
        <button type="button" className="btn btn--primary" onClick={openCreate} id="btn-new-velorio">
          + Novo Velório
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
          emptyMessage="Nenhum velório encontrado."
        />
      )}

      <AdminModal
        title={editing ? 'Editar Velório' : 'Novo Velório'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <FormField label="Registro de Óbito" id="velorio-registro">
          <select id="velorio-registro" value={form.registro_obito_id} onChange={set('registro_obito_id')} required>
            <option value="">Selecione…</option>
            {registros.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Local do Velório" id="velorio-local">
          <input id="velorio-local" value={form.local_velorio} onChange={set('local_velorio')} required />
        </FormField>
        <FormField label="Sala do Velório" id="velorio-sala">
          <input id="velorio-sala" value={form.sala_velorio} onChange={set('sala_velorio')} />
        </FormField>
        <FormField label="Início do Velório" id="velorio-inicio">
          <input id="velorio-inicio" type="datetime-local" value={form.inicio_velorio} onChange={set('inicio_velorio')} required />
        </FormField>
        <FormField label="Fim do Velório" id="velorio-fim">
          <input id="velorio-fim" type="datetime-local" value={form.fim_velorio} onChange={set('fim_velorio')} />
        </FormField>
        <FormField label="Local do Sepultamento" id="velorio-local-sep">
          <input id="velorio-local-sep" value={form.local_sepultamento} onChange={set('local_sepultamento')} required />
        </FormField>
        <FormField label="Início do Sepultamento" id="velorio-inicio-sep">
          <input id="velorio-inicio-sep" type="datetime-local" value={form.inicio_sepultamento} onChange={set('inicio_sepultamento')} />
        </FormField>
        <FormField label="Fim do Sepultamento" id="velorio-fim-sep">
          <input id="velorio-fim-sep" type="datetime-local" value={form.fim_sepultamento} onChange={set('fim_sepultamento')} />
        </FormField>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir Velório"
        message={`Tem certeza que deseja excluir o velório de "${deleteTarget?.nome_completo}"? Esta ação é irreversível.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
