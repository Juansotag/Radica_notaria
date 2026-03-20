// Formatting utilities for NotaríaDoc

export function formatCOP(value) {
  if (value === null || value === undefined || value === '') return '';
  const num = typeof value === 'string'
    ? parseFloat(value.replace(/\./g, '').replace(',', '.'))
    : value;
  if (isNaN(num)) return '';
  return '$' + num.toLocaleString('es-CO').replace(/,/g, '.') + ' COP';
}

export function formatCOPInput(rawStr) {
  const digits = String(rawStr).replace(/\D/g, '');
  if (!digits) return '';
  return parseInt(digits, 10).toLocaleString('es-CO').replace(/,/g, '.');
}

export function parseCOPInput(fmtStr) {
  return parseInt(String(fmtStr).replace(/\./g, '') || '0', 10);
}

const MESES = [
  'enero','febrero','marzo','abril','mayo','junio',
  'julio','agosto','septiembre','octubre','noviembre','diciembre'
];

export function formatColombianDate(date) {
  return `${date.getDate()} de ${MESES[date.getMonth()]} de ${date.getFullYear()}`;
}

export function formatRelativeTime(date) {
  const diff  = Date.now() - date.getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 1)   return 'Ahora mismo';
  if (mins < 60)  return `Hace ${mins} minuto${mins !== 1 ? 's' : ''}`;
  if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
  return `Hace ${days} día${days !== 1 ? 's' : ''}`;
}
