import crypto from 'node:crypto';
import { AppError } from '../errors/AppError.js';

export class AuthService {
  #adminPassword;
  #sessions; // Map<token, { expiresAt: number }>
  #sessionTimeoutMs;

  /**
   * @param {object} options
   * @param {string} options.adminPassword
   * @param {number} [options.sessionTimeoutMs]
   */
  constructor({ adminPassword, sessionTimeoutMs = 2 * 60 * 60 * 1000 }) {
    this.#adminPassword = adminPassword;
    this.#sessionTimeoutMs = sessionTimeoutMs;
    this.#sessions = new Map();
  }

  /**
   * @param {string} password
   * @returns {string} token de sessão
   */
  login(password) {
    if (typeof password !== 'string' || password !== this.#adminPassword) {
      throw new AppError('Senha invalida', 401);
    }

    const token = crypto.randomUUID();
    const expiresAt = Date.now() + this.#sessionTimeoutMs;

    this.#sessions.set(token, { expiresAt });

    // Cleanup expired sessions asynchronously
    this.#cleanup();

    return token;
  }

  /**
   * @param {string} token
   * @returns {boolean}
   */
  validateToken(token) {
    if (!token) return false;
    const session = this.#sessions.get(token);
    if (!session) return false;

    if (Date.now() > session.expiresAt) {
      this.#sessions.delete(token);
      return false;
    }

    // Refresh session on access
    session.expiresAt = Date.now() + this.#sessionTimeoutMs;
    return true;
  }

  #cleanup() {
    const now = Date.now();
    for (const [token, session] of this.#sessions.entries()) {
      if (now > session.expiresAt) {
        this.#sessions.delete(token);
      }
    }
  }
}
