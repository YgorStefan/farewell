process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgres://placeholder:placeholder@localhost:5432/placeholder';
process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
process.env.RATE_LIMIT_MAX = '10000000';

const CONNECTIONS = 25;
const DURATION_SECONDS = 10;
const P99_LIMIT_MS = 500;

async function main() {
  const { readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const path = await import('node:path');
  const autocannon = (await import('autocannon')).default;
  const { PostgreSqlContainer } = await import('@testcontainers/postgresql');

  const { Database } = await import('../../src/db/Database.js');
  const { VelorioRepository } = await import('../../src/repositories/VelorioRepository.js');
  const { VelorioService } = await import('../../src/services/VelorioService.js');
  const { BannerPdfService } = await import('../../src/services/BannerPdfService.js');
  const { VelorioController } = await import('../../src/controllers/VelorioController.js');
  const { createApp } = await import('../../src/app.js');

  const dir = path.dirname(fileURLToPath(import.meta.url));
  const initSql = readFileSync(path.resolve(dir, '../../../database/init.sql'), 'utf8');

  console.log('Subindo PostgreSQL (Testcontainers)...');
  const container = await new PostgreSqlContainer('postgres:15-alpine').start();
  const database = new Database({ connectionString: container.getConnectionUri(), ssl: false });
  await database.query(initSql);

  const controller = new VelorioController({
    service: new VelorioService(new VelorioRepository(database)),
    pdfService: new BannerPdfService(),
  });
  const app = createApp({ velorioController: controller, database });

  const server = await new Promise((resolve) => {
    const s = app.listen(0, () => resolve(s));
  });
  const { port } = server.address();

  console.log(`Carga: ${CONNECTIONS} conexoes por ${DURATION_SECONDS}s em GET /api/velorios`);
  const result = await autocannon({
    url: `http://localhost:${port}/api/velorios`,
    connections: CONNECTIONS,
    duration: DURATION_SECONDS,
  });

  await new Promise((resolve) => server.close(resolve));
  await database.close();
  await container.stop();

  console.log('\n--- Resultado ---');
  console.log(`Requisicoes/s (media): ${result.requests.average}`);
  console.log(`Latencia media: ${result.latency.average} ms`);
  console.log(`Latencia p99: ${result.latency.p99} ms`);
  console.log(`Respostas nao-2xx: ${result.non2xx}`);
  console.log(`Erros: ${result.errors}`);

  const failures = [];
  if (result.non2xx > 0) failures.push(`respostas nao-2xx: ${result.non2xx}`);
  if (result.errors > 0) failures.push(`erros de conexao: ${result.errors}`);
  if (result.latency.p99 > P99_LIMIT_MS) {
    failures.push(`latencia p99 ${result.latency.p99}ms > ${P99_LIMIT_MS}ms`);
  }

  if (failures.length > 0) {
    console.error('\nFALHOU:', failures.join('; '));
    process.exit(1);
  }
  console.log('\nOK: thresholds de performance atendidos.');
  process.exit(0);
}

try {
  await main();
} catch (error) {
  console.error(error);
  process.exit(1);
}
