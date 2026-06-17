/**
 * @param {object[]} velorios
 * @param {Date} [now]
 * @returns {{ emVelorio: object[], emSepultamento: object[] }}
 */
export function splitAgenda(velorios, now = new Date()) {
  const nowMs = now.getTime();
  const emVelorio = [];
  const emSepultamento = [];

  for (const velorio of velorios) {
    const sep = toDate(velorio.inicioSepultamento);

    if (sep !== null && sep.getTime() <= nowMs) {
      emSepultamento.push(velorio);
    } else {
      emVelorio.push(velorio);
    }
  }

  emVelorio.sort(byInicioSepultamento);
  emSepultamento.sort(byInicioSepultamento);

  return { emVelorio, emSepultamento };
}

function byInicioSepultamento(a, b) {
  const aMs = toDate(a.inicioSepultamento)?.getTime() ?? Number.POSITIVE_INFINITY;
  const bMs = toDate(b.inicioSepultamento)?.getTime() ?? Number.POSITIVE_INFINITY;
  return aMs - bMs;
}

function toDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}
