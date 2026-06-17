import { beforeAll, afterAll, describe, it, expect } from 'vitest';
import request from 'supertest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { PostgreSqlContainer } from '@testcontainers/postgresql';

import { Database } from '../../src/db/Database.js';
import { VelorioRepository } from '../../src/repositories/VelorioRepository.js';
import { VelorioService } from '../../src/services/VelorioService.js';
import { BannerPdfService } from '../../src/services/BannerPdfService.js';
import { VelorioController } from '../../src/controllers/VelorioController.js';
import { createApp } from '../../src/app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '../..');

const spec = JSON.parse(readFileSync(path.join(root, 'openapi.json'), 'utf8'));

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);
ajv.addSchema(spec, 'openapi.json');

function validator(name) {
  const validate = ajv.getSchema(`openapi.json#/components/schemas/${name}`);
  if (!validate) throw new Error(`Schema nao encontrado: ${name}`);
  return validate;
}

let container;
let database;
let app;

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:15-alpine').start();
  database = new Database({ connectionString: container.getConnectionUri(), ssl: false });
  await database.query(readFileSync(path.join(root, '../database/init.sql'), 'utf8'));

  const repository = new VelorioRepository(database);
  const controller = new VelorioController({
    service: new VelorioService(repository),
    pdfService: new BannerPdfService(),
  });
  app = createApp({ velorioController: controller, database });
}, 120_000);

afterAll(async () => {
  await database?.close();
  await container?.stop();
});

describe('Contrato OpenAPI', () => {
  it('GET /api/health respeita HealthResponse', async () => {
    const res = await request(app).get('/api/health');
    const validate = validator('HealthResponse');
    expect(validate(res.body), JSON.stringify(validate.errors)).toBe(true);
  });

  it('GET /api/velorios respeita VelorioListResponse (sem campos extras)', async () => {
    const res = await request(app).get('/api/velorios');
    const validate = validator('VelorioListResponse');
    expect(validate(res.body), JSON.stringify(validate.errors)).toBe(true);
  });

  it('GET /api/velorios filtrado tambem respeita o contrato', async () => {
    const res = await request(app).get('/api/velorios').query({ registro: 'REG-2026-0001' });
    const validate = validator('VelorioListResponse');
    expect(validate(res.body), JSON.stringify(validate.errors)).toBe(true);
  });

  it('erros respeitam ErrorResponse', async () => {
    const res = await request(app).get('/api/velorios/999999/banner.pdf');
    const validate = validator('ErrorResponse');
    expect(validate(res.body), JSON.stringify(validate.errors)).toBe(true);
  });
});
