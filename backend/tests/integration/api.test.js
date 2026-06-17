import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

import { Database } from '../../src/db/Database.js';
import { VelorioRepository } from '../../src/repositories/VelorioRepository.js';
import { VelorioService } from '../../src/services/VelorioService.js';
import { BannerPdfService } from '../../src/services/BannerPdfService.js';
import { VelorioController } from '../../src/controllers/VelorioController.js';
import { createApp } from '../../src/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INIT_SQL = path.resolve(__dirname, '../../../database/init.sql');

function binaryParser(res, callback) {
  const chunks = [];
  res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
  res.on('end', () => callback(null, Buffer.concat(chunks)));
}

let container;
let database;
let app;

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:15-alpine').start();
  database = new Database({ connectionString: container.getConnectionUri(), ssl: false });

  const sql = readFileSync(INIT_SQL, 'utf8');
  await database.query(sql);

  const repository = new VelorioRepository(database);
  const service = new VelorioService(repository);
  const controller = new VelorioController({
    service,
    pdfService: new BannerPdfService(),
  });
  app = createApp({ velorioController: controller, database });
}, 120_000);

afterAll(async () => {
  await database?.close();
  await container?.stop();
});

describe('GET /api/health', () => {
  it('retorna ok com o banco disponivel', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', database: 'up' });
  });
});

describe('GET /api/velorios', () => {
  it('lista apenas velorios ativos do Memorial Luto Curitiba', async () => {
    const res = await request(app).get('/api/velorios');
    expect(res.status).toBe(200);

    expect(res.body.total).toBeGreaterThanOrEqual(4);
    expect(res.body.total).toBeLessThanOrEqual(9);
    expect(res.body.data).toHaveLength(res.body.total);

    for (const item of res.body.data) {
      expect(item.localVelorio).toBe('Memorial Luto Curitiba');
    }

    const registros = res.body.data.map((v) => v.numeroRegistro);
    expect(registros).toContain('REG-2026-0001');
  });

  it('expoe todos os campos exigidos pelo dashboard', async () => {
    const res = await request(app).get('/api/velorios');
    const [item] = res.body.data;
    expect(item).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        nomeCompleto: expect.any(String),
        numeroRegistro: expect.any(String),
        funeraria: expect.any(String),
        sala: expect.any(String),
        inicioVelorio: expect.any(String),
        inicioSepultamento: expect.any(String),
        localSepultamento: expect.any(String),
      })
    );
  });

  it('filtra por numero de registro de obito', async () => {
    const res = await request(app).get('/api/velorios').query({ registro: 'REG-2026-0001' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    expect(res.body.data[0].numeroRegistro).toBe('REG-2026-0001');
  });

  it('retorna lista vazia para registro inexistente', async () => {
    const res = await request(app).get('/api/velorios').query({ registro: 'NAO-EXISTE' });
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(0);
    expect(res.body.data).toEqual([]);
  });
});

describe('GET /api/velorios/:id/banner.pdf', () => {
  it('gera o banner em PDF de um velorio ativo', async () => {
    const list = await request(app).get('/api/velorios');
    const id = list.body.data[0].id;

    const res = await request(app)
      .get(`/api/velorios/${id}/banner.pdf`)
      .buffer(true)
      .parse(binaryParser);
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toMatch(/application\/pdf/);
    expect(res.headers['content-disposition']).toMatch(/attachment; filename=/);
    expect(res.body.subarray(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('retorna 404 para velorio inexistente', async () => {
    const res = await request(app).get('/api/velorios/999999/banner.pdf');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('retorna 400 para id invalido', async () => {
    const res = await request(app).get('/api/velorios/abc/banner.pdf');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('rota desconhecida', () => {
  it('retorna 404 padronizado', async () => {
    const res = await request(app).get('/api/rota-inexistente');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
