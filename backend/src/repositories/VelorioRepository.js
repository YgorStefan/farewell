export class VelorioRepository {
  #db;

  static #LOCAL_MEMORIAL = 'Memorial Luto Curitiba';

  static #BASE_SELECT = `
    SELECT
      v.id,
      p.nome || ' ' || p.sobrenome AS nome_completo,
      ro.numero_registro,
      ro.funeraria,
      v.sala_velorio,
      v.local_velorio,
      v.inicio_velorio,
      v.inicio_sepultamento,
      v.local_sepultamento
    FROM velorios v
    JOIN registros_obitos ro ON ro.id = v.registro_obito_id
    JOIN pessoas p ON p.id = ro.pessoa_id
  `;

  /** @param {import('../db/Database.js').Database} database */
  constructor(database) {
    this.#db = database;
  }

  /**
   * @param {{ registro?: string | null }} [filter]
   */
  async findAtivos({ registro = null } = {}) {
    const sql = `
      ${VelorioRepository.#BASE_SELECT}
      WHERE v.local_velorio = $1
        AND v.inicio_velorio <= NOW()
        AND v.fim_sepultamento IS NULL
        AND ($2::text IS NULL OR ro.numero_registro ILIKE '%' || $2 || '%')
      ORDER BY v.inicio_velorio ASC
    `;
    const { rows } = await this.#db.query(sql, [
      VelorioRepository.#LOCAL_MEMORIAL,
      registro,
    ]);
    return rows;
  }

  /**
   * @param {number} id
   */
  async findAtivoById(id) {
    const sql = `
      ${VelorioRepository.#BASE_SELECT}
      WHERE v.id = $1
        AND v.local_velorio = $2
        AND v.inicio_velorio <= NOW()
        AND v.fim_sepultamento IS NULL
      LIMIT 1
    `;
    const { rows } = await this.#db.query(sql, [
      id,
      VelorioRepository.#LOCAL_MEMORIAL,
    ]);
    return rows[0] ?? null;
  }
}
