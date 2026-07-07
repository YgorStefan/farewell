import { AppError } from '../errors/AppError.js';

/**
   * @param {import('../services/AuthService.js').AuthService} authService
   */
export function createAuthMiddleware(authService) {
  return (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      next(new AppError('Token de autenticacao ausente ou malformatado', 401));
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const isValid = authService.validateToken(token);

    if (!isValid) {
      next(new AppError('Sessao expirada ou invalida. Faca login novamente.', 401));
      return;
    }

    next();
  };
}
