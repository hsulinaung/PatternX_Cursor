import { getSession, saveSession } from "./orderService";
import { matchTailors } from "./matchingService";

export function loadJourney() {
  return getSession() || {};
}

export function saveJourney(partial) {
  return saveSession(partial);
}

export function saveRequirements(requirements, extras = {}) {
  const matches = matchTailors(requirements);
  return saveSession({
    requirements,
    matches,
    selectedTailorId: extras.keepSelection ? getSession().selectedTailorId : matches[0]?.tailor.id || null,
    ...extras,
  });
}
