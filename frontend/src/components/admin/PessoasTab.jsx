import { useState, useEffect, useCallback } from 'react';
import { AdminTable } from './AdminTable.jsx';
import { AdminModal, FormField } from './AdminModal.jsx';
import { ConfirmDialog } from './ConfirmDialog.jsx';
import { fetchPessoas, createPessoa, updatePessoa, deletePessoa } from '../../services/api.js';
import { useDebounce } from '../../hooks/useDebounce.js';

const COLUMNS = [
  { key: 'id', label: 'ID', className: 'col-id' },
  { key: 'nome', label: 'Nome' },
  { key: 'sobrenome', label: 'Sobrenome' },
  { key: 'cpf', label: 'CPF' },
  {
    key: 'data_nascimento',
    label: 'Nascimento',
    render: (row) => formatDate(row.data_nascimento),
  },
  {
    key: 'data_falecimento',
    label: 'Falecimento',
    render: (row) => formatDate(row.data_falecimento),
  },
];

function formatDate(value) {
  if (!value) return '-';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function toInputDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

const EMPTY = { nome: '', sobrenome: '', cpf: '', data_nascimento: '', data_falecimento: '' };

export function PessoasTab() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

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
      const data = await fetchPessoas(debouncedSearch);
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

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      nome: row.nome ?? '',
      sobrenome: row.sobrenome ?? '',
      cpf: row.cpf ?? '',
      data_nascimento: toInputDate(row.data_nascimento),
      data_falecimento: toInputDate(row.data_falecimento),
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (editing) {
        await updatePessoa(editing.id, form);
        showToast('Pessoa atualizada com sucesso');
      } else {
        await createPessoa(form);
        showToast('Pessoa criada com sucesso');
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
      await deletePessoa(deleteTarget.id);
      showToast('Pessoa excluída com sucesso');
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
            placeholder="Buscar por nome ou CPF…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-tab__search-input"
            id="search-pessoas"
          />
        </div>
        <button type="button" className="btn btn--primary" onClick={openCreate} id="btn-new-pessoa">
          + Nova Pessoa
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
          emptyMessage="Nenhuma pessoa encontrada."
        />
      )}

      <AdminModal
        title={editing ? 'Editar Pessoa' : 'Nova Pessoa'}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
      >
        <FormField label="Nome" id="pessoa-nome">
          <input id="pessoa-nome" value={form.nome} onChange={set('nome')} required />
        </FormField>
        <FormField label="Sobrenome" id="pessoa-sobrenome">
          <input id="pessoa-sobrenome" value={form.sobrenome} onChange={set('sobrenome')} required />
        </FormField>
        <FormField label="CPF" id="pessoa-cpf">
          <input id="pessoa-cpf" value={form.cpf} onChange={set('cpf')} placeholder="000.000.000-00" required />
        </FormField>
        <FormField label="Data de Nascimento" id="pessoa-nascimento">
          <input id="pessoa-nascimento" type="date" value={form.data_nascimento} onChange={set('data_nascimento')} required />
        </FormField>
        <FormField label="Data de Falecimento" id="pessoa-falecimento">
          <input id="pessoa-falecimento" type="date" value={form.data_falecimento} onChange={set('data_falecimento')} required />
        </FormField>
      </AdminModal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Excluir Pessoa"
        message={`Tem certeza que deseja excluir "${deleteTarget?.nome} ${deleteTarget?.sobrenome}"? Esta ação é irreversível e também excluirá todos os registros de óbito e velórios associados.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        confirming={deleting}
      />
    </div>
  );
}
