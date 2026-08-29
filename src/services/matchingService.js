import { tailors } from "../data/tailors";

/**
 * Placeholder matcher. Phase 2 will score budget, type, deadline, style, location, rating.
 */
export function matchTailors(_requirements, catalog = tailors) {
  return catalog
    .filter((t) => t.available)
    .slice(0, 3)
    .map((t, index) => ({
      tailor: t,
      score: 90 - index * 4,
      reasons: ["Placeholder match — scoring lands in Phase 2."],
    }));
}

export function getTopRecommendation(matches) {
  return matches[0] || null;
}
