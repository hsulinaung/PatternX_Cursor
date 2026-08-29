export function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  next.setHours(12, 0, 0, 0);
  return next;
}

export function toIsoDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseIsoDate(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function daysUntil(isoDate, from = new Date()) {
  const target = parseIsoDate(isoDate);
  if (!target) return null;
  const start = new Date(from);
  start.setHours(12, 0, 0, 0);
  return Math.round((target.getTime() - start.getTime()) / 86400000);
}

export function formatDisplayDate(isoDate) {
  const date = parseIsoDate(isoDate);
  if (!date) return null;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function nextWeekday(from, weekday) {
  const date = new Date(from);
  date.setHours(12, 0, 0, 0);
  const delta = (weekday - date.getDay() + 7) % 7 || 7;
  return addDays(date, delta);
}
