import { addDays, nextWeekday, toIsoDate } from "./dates.js";

const EMPTY = {
  clothingType: null,
  occasion: null,
  gender: null,
  style: null,
  color: null,
  fabric: null,
  budgetMin: null,
  budgetMax: null,
  deadline: null,
  deadlineLabel: null,
  location: null,
  preferences: [],
  confidence: 0,
  needsClarification: false,
  clarificationQuestion: null,
};

const CLOTHING = [
  { type: "Wedding Dress", gender: "Female", pattern: /wedding\s+dress|bridal\s+(gown|dress)|bridal wear/ },
  { type: "Traditional Wear", gender: null, pattern: /traditional\s+dress|htp|longyi|taungshay|pasoe|myanmar\s+dress/ },
  { type: "Evening Dress", gender: "Female", pattern: /evening\s+dress|gala\s+dress/ },
  { type: "Men's Suit", gender: "Male", pattern: /tuxedo|men'?s?\s+suit|\bsuit\b/ },
  { type: "Women's Dress", gender: "Female", pattern: /\bdress\b/ },
  { type: "Blouse", gender: "Female", pattern: /\bblouse\b/ },
  { type: "Jacket", gender: null, pattern: /\bjacket\b|\bblazer\b/ },
  { type: "Men's Shirt", gender: "Male", pattern: /\bshirts?\b/ },
  { type: "Pants", gender: null, pattern: /\bpants\b|\btrousers\b/ },
];

const OCCASIONS = [
  { value: "Wedding", pattern: /wedding|groom|bride|reception/ },
  { value: "Interview", pattern: /interview/ },
  { value: "Graduation", pattern: /graduation/ },
  { value: "Office", pattern: /office|workwear|work\b/ },
  { value: "Party", pattern: /party|evening|gala/ },
  { value: "Casual", pattern: /casual|everyday/ },
];

const STYLES = [
  { value: "Slim Fit", pattern: /slim\s*fit|slim-fit/ },
  { value: "Oversized", pattern: /oversized|over-sized/ },
  { value: "Traditional", pattern: /traditional/ },
  { value: "Modern", pattern: /\bmodern\b/ },
  { value: "Classic", pattern: /\bclassic\b/ },
  { value: "Formal", pattern: /\bformal\b/ },
  { value: "Casual", pattern: /\bcasual\b/ },
];

const COLORS = [
  "navy",
  "black",
  "white",
  "ivory",
  "cream",
  "charcoal",
  "grey",
  "gray",
  "blue",
  "brown",
  "beige",
  "gold",
  "maroon",
  "olive",
  "blush",
  "sage",
];

const LOCATIONS = [
  "Yangon",
  "Mandalay",
  "Naypyidaw",
  "Nay Pyi Taw",
  "Bago",
  "Sagaing",
  "Shan State",
  "Nyaungshwe",
  "Mawlamyine",
  "Taunggyi",
];

function parseAmount(raw) {
  if (!raw) return null;
  const text = String(raw).trim().toLowerCase().replace(/,/g, "");
  const k = text.match(/^(\d+(?:\.\d+)?)\s*k$/);
  if (k) return Math.round(Number(k[1]) * 1000);
  const n = Number(text.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function extractBudget(lower, original) {
  const range =
    original.match(/(\d[\d,]*(?:\s*k)?)\s*(?:-|–|—|to)\s*(\d[\d,]*(?:\s*k)?)/i) ||
    lower.match(/(\d[\d,]*(?:\s*k)?)\s*(?:-|–|—|to)\s*(\d[\d,]*(?:\s*k)?)/i);
  if (range) {
    const min = parseAmount(range[1]);
    const max = parseAmount(range[2]);
    if (min && max) return { budgetMin: Math.min(min, max), budgetMax: Math.max(min, max) };
  }

  const under = lower.match(/(?:under|below|up to|max(?:imum)?)\s*(?:mmk\s*)?(\d[\d,]*(?:\s*k)?)/i);
  if (under) {
    const max = parseAmount(under[1]);
    if (max) return { budgetMin: null, budgetMax: max };
  }

  const around = lower.match(/(?:around|about|approx(?:imately)?)\s*(?:mmk\s*)?(\d[\d,]*(?:\s*k)?)/i);
  if (around) {
    const mid = parseAmount(around[1]);
    if (mid) return { budgetMin: Math.round(mid * 0.8), budgetMax: Math.round(mid * 1.2) };
  }

  return { budgetMin: null, budgetMax: null };
}

function extractDeadline(lower, now) {
  if (/\btomorrow\b/.test(lower)) {
    const date = addDays(now, 1);
    return { deadline: toIsoDate(date), deadlineLabel: "Tomorrow" };
  }
  if (/\bnext week\b/.test(lower)) {
    const date = addDays(now, 7);
    return { deadline: toIsoDate(date), deadlineLabel: "Next week" };
  }
  if (/\bthis week\b/.test(lower)) {
    const date = addDays(now, 5);
    return { deadline: toIsoDate(date), deadlineLabel: "This week" };
  }
  const inDays = lower.match(/\bin\s+(\d+)\s+days?\b/);
  if (inDays) {
    const n = Number(inDays[1]);
    const date = addDays(now, n);
    return { deadline: toIsoDate(date), deadlineLabel: `In ${n} days` };
  }
  if (/\bby friday\b/.test(lower)) {
    const date = nextWeekday(now, 5);
    return { deadline: toIsoDate(date), deadlineLabel: "By Friday" };
  }
  const iso = lower.match(/\b(20\d{2}-\d{2}-\d{2})\b/);
  if (iso) return { deadline: iso[1], deadlineLabel: iso[1] };
  return { deadline: null, deadlineLabel: null };
}

function extractClothing(lower) {
  for (const item of CLOTHING) {
    if (item.pattern.test(lower)) return item;
  }
  return { type: null, gender: null };
}

function extractGender(lower, inferred) {
  if (/women'?s|ladies|female|\bher\b|\bwife\b/.test(lower)) return "Female";
  if (/men'?s|\bmale\b|\bhim\b|\bhis\b/.test(lower)) return "Male";
  return inferred;
}

export function emptyRequirements() {
  return { ...EMPTY, preferences: [] };
}

export function normalizeRequirements(raw = {}) {
  const next = { ...emptyRequirements(), ...raw };
  if (!Array.isArray(next.preferences)) next.preferences = [];
  if (next.budgetMin != null) next.budgetMin = Number(next.budgetMin);
  if (next.budgetMax != null) next.budgetMax = Number(next.budgetMax);
  if (next.budgetMin && next.budgetMax && next.budgetMin > next.budgetMax) {
    const swap = next.budgetMin;
    next.budgetMin = next.budgetMax;
    next.budgetMax = swap;
  }
  return applyClarification(next);
}

export function applyClarification(requirements) {
  const req = { ...requirements };
  const missingClothing = !req.clothingType;
  const missingBudget = req.budgetMin == null && req.budgetMax == null;
  const missingDeadline = !req.deadline;

  req.needsClarification = false;
  req.clarificationQuestion = null;

  if (missingClothing) {
    req.needsClarification = true;
    req.clarificationQuestion =
      "What would you like made? Include a budget and when you need it if you can.";
  } else if (missingBudget && missingDeadline) {
    req.needsClarification = true;
    req.clarificationQuestion = "Sure. What's your budget and when do you need it?";
  }

  const filled = [req.clothingType, req.occasion, req.budgetMax || req.budgetMin, req.deadline].filter(Boolean)
    .length;
  req.confidence = Math.min(0.95, 0.35 + filled * 0.15);
  return req;
}

export function parseRequirements(message, now = new Date()) {
  const text = (message || "").trim();
  const lower = text.toLowerCase();
  const clothing = extractClothing(lower);
  const budget = extractBudget(lower, text);
  const deadline = extractDeadline(lower, now);
  const occasion = OCCASIONS.find((item) => item.pattern.test(lower))?.value || null;
  const style = STYLES.find((item) => item.pattern.test(lower))?.value || null;
  const colorHit = COLORS.find((c) => new RegExp(`\\b${c}\\b`, "i").test(lower));
  const location = LOCATIONS.find((place) => lower.includes(place.toLowerCase())) || null;

  let fabric = null;
  if (/\blinen\b/.test(lower)) fabric = "Linen";
  if (/\bsilk\b/.test(lower)) fabric = "Silk";
  if (/\bwool\b/.test(lower)) fabric = "Wool";
  if (/\bcotton\b/.test(lower)) fabric = "Cotton";

  const requirements = normalizeRequirements({
    clothingType: clothing.type,
    occasion,
    gender: extractGender(lower, clothing.gender),
    style,
    color: colorHit ? colorHit[0].toUpperCase() + colorHit.slice(1) : null,
    fabric,
    budgetMin: budget.budgetMin,
    budgetMax: budget.budgetMax,
    deadline: deadline.deadline,
    deadlineLabel: deadline.deadlineLabel,
    location,
    preferences: [style, fabric, colorHit].filter(Boolean),
  });

  return {
    ok: true,
    source: "mock",
    message: text,
    requirements,
  };
}

export function mergeMessages(previous, next) {
  return [previous, next].filter(Boolean).join(" ").trim();
}
