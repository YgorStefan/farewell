export class RegistroObitoRepository {
  #db;

  /** @param {import('../db/Database.js').Database} database */
  constructor(database) {
    this.#db = database;
  }

  /**
   * @param {{ search?: string | null }} [filter]
   */
  async findAll({ search = null } = {}) {
    const sql = `
      SELECT
        ro.id,
        ro.pessoa_id,
        p.nome || ' ' || p.sobrenome AS nome_completo,
        ro.numero_registro,
        ro.faf,
        ro.local_obito,
        ro.data_obito,
        ro.funeraria
      FROM registros_obitos ro
      JOIN pessoas p ON p.id = ro.pessoa_id
      WHERE ($1::text IS NULL
        OR ro.numero_registro ILIKE '%' || $1 || '%'
        OR ro.funeraria ILIKE '%' || $1 || '%'
        OR p.nome ILIKE '%' || $1 || '%'
        OR p.sobrenome ILIKE '%' || $1 || '%')
      ORDER BY ro.data_obito DESC
    `;
    const { rows } = await this.#db.query(sql, [search]);
    return rows;
  }

  /** @param {number} id */
  async findById(id) {
    const sql = `
      SELECT
        ro.id,
        ro.pessoa_id,
        p.nome || ' ' || p.sobrenome AS nome_completo,
        ro.numero_registro,
        ro.faf,
        ro.local_obito,
        ro.data_obito,
        ro.funeraria
      FROM registros_obitos ro
      JOIN pessoas p ON p.id = ro.pessoa_id
      WHERE ro.id = $1
      LIMIT 1
    `;
    const { rows } = await this.#db.query(sql, [id]);
    return rows[0] ?? null;
  }

  async create({ pessoa_id, numero_registro, faf, local_obito, data_obito, funeraria }) {
    const sql = `
      INSERT INTO registros_obitos (pessoa_id, numero_registro, faf, local_obito, data_obito, funeraria)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, pessoa_id, numero_registro, faf, local_obito, data_obito, funeraria
    `;
    const { rows } = await this.#db.query(sql, [
      pessoa_id,
      numero_registro,
      faf,
      local_obito,
      data_obito,
      funeraria,
    ]);
    return rows[0];
  }

  async update(id, { pessoa_id, numero_registro, faf, local_obito, data_obito, funeraria }) {
    const sql = `
      UPDATE registros_obitos
      SET pessoa_id = $2, numero_registro = $3, faf = $4, local_obito = $5, data_obito = $6, funeraria = $7
      WHERE id = $1
      RETURNING id, pessoa_id, numero_registro, faf, local_obito, data_obito, funeraria
    `;
    const { rows } = await this.#db.query(sql, [
      id,
      pessoa_id,
      numero_registro,
      faf,
      local_obito,
      data_obito,
      funeraria,
    ]);
    return rows[0] ?? null;
  }

  /** @param {number} id */
  async delete(id) {
    const sql = `DELETE FROM registros_obitos WHERE id = $1 RETURNING id`;
    const { rows } = await this.#db.query(sql, [id]);
    return rows.length > 0;
  }
}
