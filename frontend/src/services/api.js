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
