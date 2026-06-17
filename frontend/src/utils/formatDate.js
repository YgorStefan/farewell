const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'America/Sao_Paulo',
});

const dateShortFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  timeZone: 'America/Sao_Paulo',
});

export function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return dateTimeFormatter.format(date);
}

export function formatTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return timeFormatter.format(date);
}

export function formatDateShort(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return dateShortFormatter.format(date);
}

/**
 * @returns {{ text: string, today: boolean }}
 */
export function formatDateTimeSmart(value) {
  if (!value) return { text: '-', today: false };
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { text: '-', today: false };
  const today = dayFormatter.format(date) === dayFormatter.format(new Date());
  return {
    text: today ? `Hoje, ${timeFormatter.format(date)}` : dateTimeFormatter.format(date),
    today,
  };
}
