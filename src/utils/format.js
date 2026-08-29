export function formatMmk(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return `MMK ${Number(amount).toLocaleString("en-US")}`;
}

export function formatPriceRange(min, max) {
  return `${formatMmk(min)}–${Number(max).toLocaleString("en-US")}`;
}

export function formatCompletion(days) {
  if (!days) return "—";
  return `${days.min}–${days.max} days`;
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
