import { AppError } from '../errors/AppError.js';
import { logger } from '../config/logger.js';

export function notFound(_req, res) {
  res.status(404).json({ error: 'Rota nao encontrada' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  logger.error({ err: error }, 'Erro nao tratado');
  res.status(500).json({ error: 'Erro interno do servidor' });
}
