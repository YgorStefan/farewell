import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { Database } from './db/Database.js';
import { VelorioRepository } from './repositories/VelorioRepository.js';
import { PessoaRepository } from './repositories/PessoaRepository.js';
import { RegistroObitoRepository } from './repositories/RegistroObitoRepository.js';
import { AdminVelorioRepository } from './repositories/AdminVelorioRepository.js';
import { VelorioService } from './services/VelorioService.js';
import { BannerPdfService } from './services/BannerPdfService.js';
import { AdminService } from './services/AdminService.js';
import { AuthService } from './services/AuthService.js';
import { VelorioController } from './controllers/VelorioController.js';
import { AdminController } from './controllers/AdminController.js';
import { createAuthMiddleware } from './middlewares/auth.middleware.js';
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

  // Admin CRUD
  const pessoaRepository = new PessoaRepository(database);
  const registroObitoRepository = new RegistroObitoRepository(database);
  const adminVelorioRepository = new AdminVelorioRepository(database);
  const adminService = new AdminService({ pessoaRepository, registroObitoRepository, adminVelorioRepository });
  
  const authService = new AuthService({ adminPassword: env.adminPassword });
  const authMiddleware = createAuthMiddleware(authService);
  const adminController = new AdminController({ service: adminService, authService });

  const app = createApp({ velorioController, adminController, authMiddleware, database });

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
