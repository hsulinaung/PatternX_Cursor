export function formatCurrency(amount) {
  return formatMmk(amount);
}

export function formatMmk(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  return `MMK ${Number(amount).toLocaleString("en-US")}`;
}

export function formatPriceRange(min, max) {
  if (min == null && max == null) return "Not specified";
  if (min == null) return `Up to ${formatMmk(max)}`;
  if (max == null) return `From ${formatMmk(min)}`;
  return `${formatMmk(min)} – ${Number(max).toLocaleString("en-US")}`;
}

export function displayValue(value, fallback = "Not specified") {
  if (value == null || value === "") return fallback;
  return value;
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
