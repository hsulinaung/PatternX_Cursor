import { sampleDesignRequests } from "../shared/data/designRequests.js";
import { createDesignRequest } from "../shared/data/contracts.js";
import { storageGet, storageSet } from "./storageService.js";

const REQUESTS_KEY = "designRequests";

export function getDesignRequests() {
  const stored = storageGet(REQUESTS_KEY, null);
  if (Array.isArray(stored) && stored.length) return stored;
  storageSet(REQUESTS_KEY, sampleDesignRequests);
  return sampleDesignRequests;
}

export function getDesignRequestById(id) {
  return getDesignRequests().find((r) => r.id === id) || null;
}

export function getRequestsForTailor(tailorId) {
  return getDesignRequests().filter((r) => r.tailorId === tailorId);
}

function nextRequestId(existing) {
  const numbers = existing
    .map((r) => Number(String(r.id || "").replace(/\D/g, "")))
    .filter((n) => Number.isFinite(n));
  const max = numbers.length ? Math.max(...numbers) : 2000;
  return `DR-${max + 1}`;
}

export function createDesignRequestRecord(partial) {
  const request = createDesignRequest({
    ...partial,
    id: partial.id || nextRequestId(getDesignRequests()),
  });
  const next = [request, ...getDesignRequests()];
  storageSet(REQUESTS_KEY, next);
  return request;
}

export function updateDesignRequest(id, patch) {
  const requests = getDesignRequests();
  const next = requests.map((r) => (r.id === id ? { ...r, ...patch } : r));
  storageSet(REQUESTS_KEY, next);
  return next.find((r) => r.id === id) || null;
}
