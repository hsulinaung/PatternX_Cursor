import { formatPriceRange } from "../../shared/utils/format.js";

export function compactBudget(min, max) {
  const k = (n) => {
    if (n == null) return null;
    if (n >= 1000) return `${Math.round(n / 1000)}K`;
    return String(n);
  };
  if (min != null && max != null) return `MMK ${k(min)}–${k(max)}`;
  if (max != null) return `under MMK ${k(max)}`;
  if (min != null) return `from MMK ${k(min)}`;
  return formatPriceRange(min, max);
}

export function estimatePrice(requirements = {}, tailor) {
  if (!tailor) return 0;
  const tMid = (tailor.priceMin + tailor.priceMax) / 2;
  let raw = tMid;
  if (requirements.budgetMin != null || requirements.budgetMax != null) {
    const lo = Math.max(requirements.budgetMin ?? tailor.priceMin, tailor.priceMin);
    const hi = Math.min(requirements.budgetMax ?? tailor.priceMax, tailor.priceMax);
    if (hi >= lo) raw = (lo + hi) / 2;
  }
  return Math.round(raw / 10000) * 10000;
}

export function defaultCustomization(requirements = {}, existing = {}) {
  const style = existing.style || requirements.style || "";
  const slim = /slim/i.test(style);
  return {
    clothingType: existing.clothingType || requirements.clothingType || "",
    style: existing.style || requirements.style || "",
    color: existing.color || requirements.color || "",
    fabric: existing.fabric || requirements.fabric || "",
    fit: existing.fit || (slim ? "Slim Fit" : ""),
    budgetMin: existing.budgetMin ?? requirements.budgetMin ?? null,
    budgetMax: existing.budgetMax ?? requirements.budgetMax ?? null,
    deadline: existing.deadline || requirements.deadline || "",
    notes: existing.notes || "",
    referenceImage: existing.referenceImage || null,
    referenceImageName: existing.referenceImageName || "",
    measurements: existing.measurements || null,
    measurementSource: existing.measurementSource || null,
  };
}

export function assistantAcknowledgement(req) {
  const piece = req.occasion
    ? `${req.occasion.toLowerCase()} ${(req.clothingType || "piece").toLowerCase()}`
    : (req.clothingType || "piece").toLowerCase();
  const budget =
    req.budgetMin != null || req.budgetMax != null
      ? ` within ${compactBudget(req.budgetMin, req.budgetMax)}`
      : "";
  const when = req.deadlineLabel
    ? ` that can be completed by ${req.deadlineLabel.toLowerCase()}`
    : req.deadline
      ? " in time for your deadline"
      : "";
  return `Got it. I'm looking for a ${piece}${budget}${when}. Let me find the best matches for you.`;
}
