import { parseRequirements } from "../src/shared/utils/requirementParser.js";
import { matchTailors } from "../src/services/matchingService.js";

const now = new Date(2026, 7, 29);
const demo =
  "I want a suit for my friend's wedding next week, budget range is MMK 100000-300000.";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const demoParsed = parseRequirements(demo, now);
const req = demoParsed.requirements;
console.log("demo", req);
assert(req.clothingType === "Men's Suit", "clothing");
assert(req.occasion === "Wedding", "occasion");
assert(req.budgetMin === 100000 && req.budgetMax === 300000, "budget");
assert(req.deadline === "2026-09-05", "deadline date");
assert(req.needsClarification === false, "no clarification on demo");

const matches = matchTailors(req);
console.log(
  "matches",
  matches.map((m) => `${m.score} ${m.tailor.name}`)
);
assert(matches[0].tailor.id === "t-aung", "Aung should be top");
assert(matches.length >= 1, "has matches");
assert(!matches.some((m) => m.tailor.id === "t-nilar"), "women's studio excluded for men's suit");
assert(!matches.some((m) => m.tailor.id === "t-golden"), "shirt house excluded for men's suit");
assert(!matches.some((m) => m.tailor.id === "t-bago"), "unavailable excluded");

const suitOnly = parseRequirements("I need a suit.", now);
assert(suitOnly.requirements.needsClarification === true, "clarification");

const empty = parseRequirements("   ", now);
assert(empty.requirements.needsClarification === true, "empty-ish");

const kimono = parseRequirements("I want a kimono next week budget 100000-300000", now);
assert(!kimono.requirements.clothingType, "unsupported clothing");

const kBudget = parseRequirements("suit wedding 100k-300k next week", now);
assert(kBudget.requirements.budgetMin === 100000, "k suffix");

const shifted = { ...req, budgetMin: 200000, budgetMax: 400000 };
const rematch = matchTailors(shifted);
console.log(
  "budget 200-400",
  rematch.map((m) => `${m.score} ${m.tailor.name}`)
);

const tight = { ...req, deadline: "2026-08-30", deadlineLabel: "Tomorrow" };
const tightMatches = matchTailors(tight);
console.log(
  "tight deadline",
  tightMatches.map((m) => m.tailor.name)
);

console.log("phase2 checks passed");
