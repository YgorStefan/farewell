import pg from 'pg';

const { Pool } = pg;

export class Database {
  #pool;

  /**
   * @param {object} options
   * @param {string|null} [options.connectionString]
   * @param {boolean} options.ssl
   * @param {import('pino').Logger} [options.logger]
   */
  constructor({ connectionString, ssl, logger }) {
    this.#pool = new Pool({
      ...(connectionString ? { connectionString } : {}),
      ssl: ssl ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });

    this.#pool.on('error', (error) => {
      logger?.error({ err: error }, 'Erro inesperado no pool do PostgreSQL');
    });
  }

  /**
   * @param {string} text
   * @param {unknown[]} [params]
   */
  async query(text, params = []) {
    return this.#pool.query(text, params);
  }

  async healthCheck() {
    await this.#pool.query('SELECT 1');
    return true;
  }

  async close() {
    await this.#pool.end();
  }
}
