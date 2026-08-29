export const MEASUREMENT_FIELDS = [
  { key: "shoulderWidth", label: "Shoulder Width", group: "Upper body", min: 30, max: 60 },
  { key: "chest", label: "Chest", group: "Upper body", min: 70, max: 140 },
  { key: "waist", label: "Waist", group: "Upper body", min: 55, max: 140 },
  { key: "hip", label: "Hip", group: "Upper body", min: 70, max: 150 },
  { key: "sleeveLength", label: "Sleeve Length", group: "Arms", min: 45, max: 80 },
  { key: "jacketLength", label: "Jacket Length", group: "Torso", min: 55, max: 95 },
  { key: "inseam", label: "Inseam", group: "Lower body", min: 55, max: 100 },
  { key: "trouserWaist", label: "Trouser Waist", group: "Lower body", min: 55, max: 140 },
];

export const DEMO_MEASUREMENTS = {
  shoulderWidth: 44,
  chest: 96,
  waist: 82,
  hip: 98,
  sleeveLength: 61,
  jacketLength: 72,
  inseam: 78,
  trouserWaist: 82,
};

export function emptyMeasurements() {
  return Object.fromEntries(MEASUREMENT_FIELDS.map((f) => [f.key, ""]));
}

export function estimateMeasurements(customerId = "") {
  if (customerId === "customer-demo") return { ...DEMO_MEASUREMENTS };
  const seed = [...String(customerId)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
  const jitter = (base, span) => Math.round(base + ((seed % (span * 2 + 1)) - span));
  return {
    shoulderWidth: jitter(43, 2),
    chest: jitter(95, 3),
    waist: jitter(81, 3),
    hip: jitter(97, 3),
    sleeveLength: jitter(60, 2),
    jacketLength: jitter(71, 2),
    inseam: jitter(77, 2),
    trouserWaist: jitter(81, 3),
  };
}

export function validateMeasurements(values) {
  const errors = {};
  for (const field of MEASUREMENT_FIELDS) {
    const raw = values[field.key];
    const n = Number(raw);
    if (raw === "" || raw == null) {
      errors[field.key] = `${field.label} is required.`;
    } else if (!Number.isFinite(n) || n <= 0) {
      errors[field.key] = "Enter a number greater than zero.";
    } else if (n < field.min || n > field.max) {
      errors[field.key] = `Use a realistic range (${field.min}–${field.max} cm).`;
    }
  }
  return errors;
}

export function normalizeMeasurements(values) {
  return Object.fromEntries(MEASUREMENT_FIELDS.map((f) => [f.key, Number(values[f.key])]));
}

export function sourceLabel(source) {
  if (source === "manual") return "Manual";
  if (source === "camera-estimate") return "AI Estimated";
  return "Estimated";
}
