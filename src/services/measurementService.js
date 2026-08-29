import { storageGet, storageSet } from "./storageService.js";

const KEY = "measurements";

function allProfiles() {
  const data = storageGet(KEY, {});
  return data && typeof data === "object" ? data : {};
}

export function getMeasurementProfile(customerId) {
  if (!customerId) return null;
  return allProfiles()[customerId] || null;
}

export function saveMeasurementProfile({ customerId, source, measurements }) {
  if (!customerId) return null;
  const profile = {
    id: `measurement-${customerId}`,
    customerId,
    unit: "cm",
    source: source || "manual",
    measurements,
    updatedAt: new Date().toISOString(),
  };
  const next = { ...allProfiles(), [customerId]: profile };
  storageSet(KEY, next);
  return profile;
}
