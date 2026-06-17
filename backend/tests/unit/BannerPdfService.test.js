import { describe, it, expect } from 'vitest';
import { BannerPdfService } from '../../src/services/BannerPdfService.js';

const velorio = {
  id: 1,
  nomeCompleto: 'João Silva',
  numeroRegistro: 'REG-2026-0001',
  funeraria: 'Funerária Bom Pastor',
  sala: 'Sala Lírio',
  inicioVelorio: '2026-06-22T08:00:00.000Z',
  inicioSepultamento: '2026-06-24T10:00:00.000Z',
  localSepultamento: 'Cemitério Municipal',
};

function renderToBuffer(doc) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.end();
  });
}

describe('BannerPdfService', () => {
  it('gera um documento PDF valido (assinatura %PDF-)', async () => {
    const service = new BannerPdfService();
    const doc = service.build(velorio);
    const buffer = await renderToBuffer(doc);

    expect(buffer.length).toBeGreaterThan(800);
    expect(buffer.subarray(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('nao quebra quando campos opcionais estao ausentes', async () => {
    const service = new BannerPdfService();
    const doc = service.build({
      ...velorio,
      inicioSepultamento: null,
      localSepultamento: null,
      funeraria: null,
    });
    const buffer = await renderToBuffer(doc);
    expect(buffer.subarray(0, 5).toString('ascii')).toBe('%PDF-');
  });
});
