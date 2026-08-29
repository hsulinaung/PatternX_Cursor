import { normalizeRequirements, parseRequirements } from "../../src/shared/utils/requirementParser.js";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

async function parseWithOpenAi(message) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const model = process.env.AI_MODEL || "gpt-4o-mini";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Extract tailoring requirements as JSON with keys: clothingType, occasion, gender, style, color, fabric, budgetMin, budgetMax, deadline (YYYY-MM-DD or null), deadlineLabel, location, preferences (array). Use null when unknown. Do not invent a budget.",
        },
        { role: "user", content: message },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI ${response.status}`);
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content;
  const parsed = JSON.parse(content);
  return normalizeRequirements(parsed);
}

export async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  let message = "";
  try {
    const body = JSON.parse(event.body || "{}");
    message = typeof body.message === "string" ? body.message : "";
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const mock = parseRequirements(message);

  try {
    const aiRequirements = await parseWithOpenAi(message);
    if (aiRequirements) {
      return json(200, {
        ok: true,
        source: "openai",
        message,
        requirements: aiRequirements,
      });
    }
  } catch {
    return json(200, {
      ok: true,
      source: "mock",
      warning: "AI unavailable, used PatternX parser",
      message,
      requirements: mock.requirements,
    });
  }

  return json(200, {
    ok: true,
    source: "mock",
    message,
    requirements: mock.requirements,
  });
}
