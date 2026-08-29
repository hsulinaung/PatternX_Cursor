import { listPublicTailors } from "../shared/data/tailors.js";
import { daysUntil } from "../shared/utils/dates.js";
import { formatCompletion, formatPriceRange } from "../shared/utils/format.js";

const WEIGHTS = {
  clothing: 30,
  budget: 20,
  deadline: 20,
  style: 10,
  location: 10,
  rating: 5,
  availability: 5,
};

function tokens(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2);
}

function hasWord(hay, word) {
  return new RegExp(`\\b${word.replace(/s$/, "s?")}\\b`, "i").test(hay);
}

function clothingScore(req, tailor) {
  if (!req.clothingType) return { points: WEIGHTS.clothing, label: "Open to their specialties", ok: true };
  const hay = [...tailor.specialties, tailor.description, ...tailor.styles].join(" ").toLowerCase();
  const type = req.clothingType.toLowerCase();

  if (type.includes("suit")) {
    if (/suits?\b|tuxedo|formal wear/.test(hay)) {
      return { points: WEIGHTS.clothing, label: `Specializes in ${req.clothingType.toLowerCase()}`, ok: true };
    }
    return { points: 0, label: "Different clothing focus", ok: false };
  }
  if (type.includes("traditional")) {
    if (/traditional|longyi|htp|ceremonial/.test(hay)) {
      return { points: WEIGHTS.clothing, label: "Specializes in traditional wear", ok: true };
    }
    return { points: 0, label: "Different clothing focus", ok: false };
  }
  if (type.includes("dress")) {
    if (/dress|bridal|evening/.test(hay)) {
      return { points: WEIGHTS.clothing, label: "Specializes in dresses", ok: true };
    }
    return { points: 0, label: "Different clothing focus", ok: false };
  }
  if (type.includes("shirt") && /shirts?/.test(hay)) {
    return { points: WEIGHTS.clothing, label: "Specializes in shirts", ok: true };
  }
  if (type.includes("jacket") && /jacket|blazer/.test(hay)) {
    return { points: WEIGHTS.clothing, label: "Specializes in jackets", ok: true };
  }

  const keys = tokens(type).filter((k) => !["men", "women", "male", "female"].includes(k));
  const hits = keys.filter((k) => hasWord(hay, k));
  if (hits.length >= 1) {
    return { points: Math.round(WEIGHTS.clothing * 0.7), label: "Related specialty", ok: true };
  }
  return { points: 0, label: "Different clothing focus", ok: false };
}

function rangeOverlap(aMin, aMax, bMin, bMax) {
  const left = Math.max(aMin, bMin);
  const right = Math.min(aMax, bMax);
  return Math.max(0, right - left);
}

function budgetScore(req, tailor) {
  if (req.budgetMin == null && req.budgetMax == null) {
    return { points: Math.round(WEIGHTS.budget * 0.8), label: "Budget not specified", ok: true, overlap: true };
  }
  const uMin = req.budgetMin ?? 0;
  const uMax = req.budgetMax ?? req.budgetMin ?? tailor.priceMax;
  const overlap = rangeOverlap(uMin, uMax, tailor.priceMin, tailor.priceMax);
  if (overlap <= 0) {
    return { points: 0, label: "Outside your budget range", ok: false, overlap: false };
  }
  const userWidth = Math.max(1, uMax - uMin);
  const tailorInside = tailor.priceMin >= uMin && tailor.priceMax <= uMax;
  const ratio = tailorInside ? 1 : overlap / userWidth;
  const points = Math.round(WEIGHTS.budget * Math.min(1, Math.max(0.35, ratio)));
  return {
    points,
    label: tailorInside ? "Fits your budget" : "Partial budget overlap",
    ok: true,
    overlap: true,
  };
}

function deadlineScore(req, tailor) {
  if (!req.deadline) {
    return { points: Math.round(WEIGHTS.deadline * 0.8), label: "Flexible timeline", ok: true, feasible: true };
  }
  const days = daysUntil(req.deadline);
  if (days == null) {
    return { points: Math.round(WEIGHTS.deadline * 0.5), label: "Deadline unclear", ok: true, feasible: true };
  }
  if (days < 1) {
    return { points: 0, label: "Deadline is too soon", ok: false, feasible: false };
  }
  if (tailor.completionDays.max <= days) {
    return { points: WEIGHTS.deadline, label: "Can finish before your deadline", ok: true, feasible: true };
  }
  if (tailor.completionDays.min <= days) {
    return { points: Math.round(WEIGHTS.deadline * 0.45), label: "Tight but possible", ok: true, feasible: true };
  }
  return { points: 0, label: "Typical lead time is longer than your deadline", ok: false, feasible: false };
}

function styleScore(req, tailor) {
  if (!req.style) return { points: WEIGHTS.style, label: "Style left open", ok: true };
  const hay = tailor.styles.join(" ").toLowerCase();
  const wanted = req.style.toLowerCase();
  if (hay.includes(wanted) || wanted.split(" ").some((w) => w.length > 3 && hay.includes(w))) {
    return { points: WEIGHTS.style, label: `Matches ${req.style.toLowerCase()}`, ok: true };
  }
  return { points: 3, label: "Different usual style", ok: false };
}

function locationScore(req, tailor) {
  if (!req.location) return { points: WEIGHTS.location, label: "Any location", ok: true };
  const wanted = req.location.toLowerCase();
  const hay = tailor.location.toLowerCase();
  if (hay.includes(wanted) || wanted.includes(hay.split(",")[0].trim())) {
    return { points: WEIGHTS.location, label: `Based in ${tailor.location}`, ok: true };
  }
  return { points: 2, label: "Different city", ok: false };
}

function ratingScore(tailor) {
  const points = Math.round((tailor.rating / 5) * WEIGHTS.rating);
  return { points, label: tailor.rating >= 4.7 ? "Highly rated" : "Solid rating", ok: tailor.rating >= 4.5 };
}

function availabilityScore(tailor) {
  return tailor.available
    ? { points: WEIGHTS.availability, label: "Available", ok: true }
    : { points: 0, label: "Currently unavailable", ok: false };
}

function buildExplanation(tailor, req, reasons) {
  const budget = req.budgetMin != null || req.budgetMax != null ? formatPriceRange(req.budgetMin ?? 0, req.budgetMax ?? req.budgetMin) : "your budget";
  const why = reasons.filter((r) => r.ok).slice(0, 4).map((r) => r.label.toLowerCase());
  return `PatternX selected ${tailor.name} as your best match because ${why.join(", ")}${req.deadline ? `, and their ${formatCompletion(tailor.completionDays)} turnaround fits your timeline` : ""}. Their prices (${formatPriceRange(tailor.priceMin, tailor.priceMax)}) sit against ${budget}.`;
}

export function matchTailors(requirements, catalog = listPublicTailors()) {
  const req = requirements || {};
  const results = catalog.map((tailor) => {
    const clothing = clothingScore(req, tailor);
    const budget = budgetScore(req, tailor);
    const deadline = deadlineScore(req, tailor);
    const style = styleScore(req, tailor);
    const location = locationScore(req, tailor);
    const rating = ratingScore(tailor);
    const availability = availabilityScore(tailor);
    const breakdown = { clothing, budget, deadline, style, location, rating, availability };
    const score = Object.values(breakdown).reduce((sum, part) => sum + part.points, 0);
    const reasons = [
      budget,
      clothing,
      deadline,
      rating,
      availability,
      style,
      location,
    ];
    const exclude =
      !tailor.available ||
      (req.clothingType && clothing.points === 0) ||
      ((req.budgetMin != null || req.budgetMax != null) && !budget.overlap) ||
      (req.deadline && !deadline.feasible);

    return {
      tailor,
      score,
      breakdown,
      reasons: reasons.filter((r) => r.ok).map((r) => r.label),
      missed: reasons.filter((r) => !r.ok).map((r) => r.label),
      exclude,
    };
  });

  return results
    .filter((r) => !r.exclude)
    .sort((a, b) => b.score - a.score || b.tailor.rating - a.tailor.rating)
    .map((r, index) => ({
      ...r,
      rank: index + 1,
      isTop: index === 0,
      explanation: buildExplanation(r.tailor, req, r.reasons.map((label) => ({ label, ok: true }))),
    }));
}

export function getTopRecommendation(matches) {
  return matches[0] || null;
}

export { WEIGHTS };
