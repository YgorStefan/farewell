export class AdminVelorioRepository {
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
        v.id,
        v.registro_obito_id,
        p.nome || ' ' || p.sobrenome AS nome_completo,
        ro.numero_registro,
        v.local_velorio,
        v.local_sepultamento,
        v.sala_velorio,
        v.inicio_velorio,
        v.fim_velorio,
        v.inicio_sepultamento,
        v.fim_sepultamento
      FROM velorios v
      JOIN registros_obitos ro ON ro.id = v.registro_obito_id
      JOIN pessoas p ON p.id = ro.pessoa_id
      WHERE ($1::text IS NULL
        OR p.nome ILIKE '%' || $1 || '%'
        OR p.sobrenome ILIKE '%' || $1 || '%'
        OR ro.numero_registro ILIKE '%' || $1 || '%'
        OR v.local_velorio ILIKE '%' || $1 || '%')
      ORDER BY v.inicio_velorio DESC
    `;
    const { rows } = await this.#db.query(sql, [search]);
    return rows;
  }

  /** @param {number} id */
  async findById(id) {
    const sql = `
      SELECT
        v.id,
        v.registro_obito_id,
        p.nome || ' ' || p.sobrenome AS nome_completo,
        ro.numero_registro,
        v.local_velorio,
        v.local_sepultamento,
        v.sala_velorio,
        v.inicio_velorio,
        v.fim_velorio,
        v.inicio_sepultamento,
        v.fim_sepultamento
      FROM velorios v
      JOIN registros_obitos ro ON ro.id = v.registro_obito_id
      JOIN pessoas p ON p.id = ro.pessoa_id
      WHERE v.id = $1
      LIMIT 1
    `;
    const { rows } = await this.#db.query(sql, [id]);
    return rows[0] ?? null;
  }

  async create({
    registro_obito_id,
    local_velorio,
    local_sepultamento,
    sala_velorio,
    inicio_velorio,
    fim_velorio,
    inicio_sepultamento,
    fim_sepultamento,
  }) {
    const sql = `
      INSERT INTO velorios (
        registro_obito_id, local_velorio, local_sepultamento, sala_velorio,
        inicio_velorio, fim_velorio, inicio_sepultamento, fim_sepultamento
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, registro_obito_id, local_velorio, local_sepultamento, sala_velorio,
                inicio_velorio, fim_velorio, inicio_sepultamento, fim_sepultamento
    `;
    const { rows } = await this.#db.query(sql, [
      registro_obito_id,
      local_velorio,
      local_sepultamento,
      sala_velorio,
      inicio_velorio,
      fim_velorio ?? null,
      inicio_sepultamento ?? null,
      fim_sepultamento ?? null,
    ]);
    return rows[0];
  }

  async update(id, {
    registro_obito_id,
    local_velorio,
    local_sepultamento,
    sala_velorio,
    inicio_velorio,
    fim_velorio,
    inicio_sepultamento,
    fim_sepultamento,
  }) {
    const sql = `
      UPDATE velorios
      SET registro_obito_id = $2, local_velorio = $3, local_sepultamento = $4,
          sala_velorio = $5, inicio_velorio = $6, fim_velorio = $7,
          inicio_sepultamento = $8, fim_sepultamento = $9
      WHERE id = $1
      RETURNING id, registro_obito_id, local_velorio, local_sepultamento, sala_velorio,
                inicio_velorio, fim_velorio, inicio_sepultamento, fim_sepultamento
    `;
    const { rows } = await this.#db.query(sql, [
      id,
      registro_obito_id,
      local_velorio,
      local_sepultamento,
      sala_velorio,
      inicio_velorio,
      fim_velorio ?? null,
      inicio_sepultamento ?? null,
      fim_sepultamento ?? null,
    ]);
    return rows[0] ?? null;
  }

  /** @param {number} id */
  async delete(id) {
    const sql = `DELETE FROM velorios WHERE id = $1 RETURNING id`;
    const { rows } = await this.#db.query(sql, [id]);
    return rows.length > 0;
  }
}
