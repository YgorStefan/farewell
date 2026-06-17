import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { Database } from './db/Database.js';
import { VelorioRepository } from './repositories/VelorioRepository.js';
import { VelorioService } from './services/VelorioService.js';
import { BannerPdfService } from './services/BannerPdfService.js';
import { VelorioController } from './controllers/VelorioController.js';
import { createApp } from './app.js';

function bootstrap() {
  const database = new Database({
    connectionString: env.databaseUrl,
    ssl: env.databaseSsl,
    logger,
  });

  const repository = new VelorioRepository(database);
  const service = new VelorioService(repository);
  const pdfService = new BannerPdfService();
  const velorioController = new VelorioController({ service, pdfService });

  const app = createApp({ velorioController, database });

  const server = app.listen(env.port, () => {
    logger.info(`API ouvindo na porta ${env.port} (${env.nodeEnv})`);
  });

  const shutdown = async (signal) => {
    logger.info(`Recebido ${signal}, encerrando graciosamente...`);
    server.close(async () => {
      await database.close();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap();
