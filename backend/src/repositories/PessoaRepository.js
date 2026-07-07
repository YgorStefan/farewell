export class PessoaRepository {
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
      SELECT id, nome, sobrenome, cpf, data_nascimento, data_falecimento
      FROM pessoas
      WHERE ($1::text IS NULL
        OR nome ILIKE '%' || $1 || '%'
        OR sobrenome ILIKE '%' || $1 || '%'
        OR cpf ILIKE '%' || $1 || '%')
      ORDER BY nome ASC, sobrenome ASC
    `;
    const { rows } = await this.#db.query(sql, [search]);
    return rows;
  }

  /** @param {number} id */
  async findById(id) {
    const sql = `
      SELECT id, nome, sobrenome, cpf, data_nascimento, data_falecimento
      FROM pessoas
      WHERE id = $1
      LIMIT 1
    `;
    const { rows } = await this.#db.query(sql, [id]);
    return rows[0] ?? null;
  }

  async create({ nome, sobrenome, cpf, data_nascimento, data_falecimento }) {
    const sql = `
      INSERT INTO pessoas (nome, sobrenome, cpf, data_nascimento, data_falecimento)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nome, sobrenome, cpf, data_nascimento, data_falecimento
    `;
    const { rows } = await this.#db.query(sql, [
      nome,
      sobrenome,
      cpf,
      data_nascimento,
      data_falecimento,
    ]);
    return rows[0];
  }

  async update(id, { nome, sobrenome, cpf, data_nascimento, data_falecimento }) {
    const sql = `
      UPDATE pessoas
      SET nome = $2, sobrenome = $3, cpf = $4, data_nascimento = $5, data_falecimento = $6
      WHERE id = $1
      RETURNING id, nome, sobrenome, cpf, data_nascimento, data_falecimento
    `;
    const { rows } = await this.#db.query(sql, [
      id,
      nome,
      sobrenome,
      cpf,
      data_nascimento,
      data_falecimento,
    ]);
    return rows[0] ?? null;
  }

  /** @param {number} id */
  async delete(id) {
    const sql = `DELETE FROM pessoas WHERE id = $1 RETURNING id`;
    const { rows } = await this.#db.query(sql, [id]);
    return rows.length > 0;
  }
}
