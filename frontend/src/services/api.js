const BASE_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  ''
);

/**
 * @param {{ registro?: string, signal?: AbortSignal }} [options]
 * @returns {Promise<object[]>}
 */
export async function fetchVelorios({ registro = '', signal } = {}) {
  const url = new URL('/api/velorios', BASE_URL);
  if (registro.trim()) {
    url.searchParams.set('registro', registro.trim());
  }

  const response = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Falha ao carregar velorios (HTTP ${response.status})`);
  }

  const payload = await response.json();
  return payload.data ?? [];
}

/**
 * @param {number} id
 * @param {string} numeroRegistro
 */
export async function downloadBanner(id, numeroRegistro) {
  const url = new URL(`/api/velorios/${id}/banner.pdf`, BASE_URL);
  const response = await fetch(url, { headers: { Accept: 'application/pdf' } });
  if (!response.ok) {
    throw new Error(`Falha ao gerar o banner (HTTP ${response.status})`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = `banner-velorio-${numeroRegistro ?? id}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
}

// ──── Admin CRUD helpers ────

export function getAdminToken() {
  return sessionStorage.getItem('admin_token');
}

export function setAdminToken(token) {
  if (token) {
    sessionStorage.setItem('admin_token', token);
  } else {
    sessionStorage.removeItem('admin_token');
  }
}

export function isAuthenticated() {
  return !!getAdminToken();
}

export function logoutAdmin() {
  setAdminToken(null);
  window.location.hash = '';
}

async function adminFetch(path, options = {}) {
  const url = new URL(path, BASE_URL);
  const token = getAdminToken();

  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    headers,
    ...options,
  });

  if (response.status === 401) {
    setAdminToken(null);
    // Força o reload para redirecionar para a tela de login
    window.location.reload();
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (options.method === 'DELETE' && response.status === 204) return null;

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Erro HTTP ${response.status}`);
  }
  return response.json();
}

export async function loginAdmin(password) {
  const payload = await adminFetch('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
  if (payload?.token) {
    setAdminToken(payload.token);
  }
  return payload;
}

// ──── Pessoas ────

export async function fetchPessoas(search = '') {
  const path = search.trim()
    ? `/api/admin/pessoas?search=${encodeURIComponent(search.trim())}`
    : '/api/admin/pessoas';
  const payload = await adminFetch(path);
  return payload.data ?? [];
}

export function createPessoa(data) {
  return adminFetch('/api/admin/pessoas', { method: 'POST', body: JSON.stringify(data) });
}

export function updatePessoa(id, data) {
  return adminFetch(`/api/admin/pessoas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deletePessoa(id) {
  return adminFetch(`/api/admin/pessoas/${id}`, { method: 'DELETE' });
}

// ──── Registros de Óbito ────

export async function fetchRegistros(search = '') {
  const path = search.trim()
    ? `/api/admin/registros?search=${encodeURIComponent(search.trim())}`
    : '/api/admin/registros';
  const payload = await adminFetch(path);
  return payload.data ?? [];
}

export function createRegistro(data) {
  return adminFetch('/api/admin/registros', { method: 'POST', body: JSON.stringify(data) });
}

export function updateRegistro(id, data) {
  return adminFetch(`/api/admin/registros/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteRegistro(id) {
  return adminFetch(`/api/admin/registros/${id}`, { method: 'DELETE' });
}

// ──── Velórios ────

export async function fetchAdminVelorios(search = '') {
  const path = search.trim()
    ? `/api/admin/velorios?search=${encodeURIComponent(search.trim())}`
    : '/api/admin/velorios';
  const payload = await adminFetch(path);
  return payload.data ?? [];
}

export function createVelorio(data) {
  return adminFetch('/api/admin/velorios', { method: 'POST', body: JSON.stringify(data) });
}

export function updateVelorio(id, data) {
  return adminFetch(`/api/admin/velorios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export function deleteVelorio(id) {
  return adminFetch(`/api/admin/velorios/${id}`, { method: 'DELETE' });
}

// ──── Lookups (para selects de FK) ────

export async function fetchLookupPessoas() {
  const payload = await adminFetch('/api/admin/lookup/pessoas');
  return payload.data ?? [];
}

export async function fetchLookupRegistros() {
  const payload = await adminFetch('/api/admin/lookup/registros');
  return payload.data ?? [];
}
