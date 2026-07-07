import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';

import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { createVelorioRouter } from './routes/velorios.routes.js';
import { createHealthRouter } from './routes/health.routes.js';
import { createAdminRouter } from './routes/admin.routes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

/**
 * @param {object} deps
 * @param {import('./controllers/VelorioController.js').VelorioController} deps.velorioController
 * @param {import('./controllers/AdminController.js').AdminController} deps.adminController
 * @param {import('express').RequestHandler} deps.authMiddleware
 * @param {import('./db/Database.js').Database} deps.database
 */
export function createApp({ velorioController, adminController, authMiddleware, database }) {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(pinoHttp({ logger }));

  app.use(
    rateLimit({
      windowMs: env.rateLimit.windowMs,
      max: env.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use('/api/health', createHealthRouter(database));
  app.use('/api/velorios', createVelorioRouter(velorioController));
  if (adminController && authMiddleware) {
    app.use('/api/admin', createAdminRouter(adminController, authMiddleware));
  }

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
