import { parseRequirements, normalizeRequirements } from "../shared/utils/requirementParser.js";

function fallbackParse(message) {
  return { ...parseRequirements(message), source: "mock" };
}

function looksValid(data) {
  return data && typeof data === "object" && data.requirements && typeof data.requirements === "object";
}

export async function parseRequest(message) {
  const text = (message || "").trim();
  if (!text) {
    return {
      ok: false,
      source: "client",
      error: "empty",
      message: text,
      requirements: normalizeRequirements({
        needsClarification: true,
        clarificationQuestion: "Tell me what you'd like made, including a budget if you can.",
      }),
    };
  }

  try {
    const response = await fetch("/.netlify/functions/parse-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    if (!response.ok) throw new Error(`parse-request failed: ${response.status}`);
    const data = await response.json();
    if (!looksValid(data)) throw new Error("invalid AI response");
    return {
      ok: true,
      source: data.source || "netlify",
      message: text,
      requirements: normalizeRequirements(data.requirements),
      warning: data.warning || null,
    };
  } catch {
    return fallbackParse(text);
  }
}
