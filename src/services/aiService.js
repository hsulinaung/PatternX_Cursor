/**
 * Calls the Netlify parse-request function when available.
 * Falls back to a deterministic mock so the UI never depends on an API key.
 */
export async function parseRequest(message) {
  const text = (message || "").trim();

  try {
    const response = await fetch("/.netlify/functions/parse-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    if (!response.ok) {
      throw new Error(`parse-request failed: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.requirements) {
      return { ...data, source: data.source || "netlify" };
    }
  } catch {
    // Function unavailable in Vite-only local dev — use mock.
  }

  return mockParse(text);
}

export function mockParse(message) {
  const lower = (message || "").toLowerCase();
  const wantsSuit = /suit|tuxedo|blazer/.test(lower);
  const wantsWedding = /wedding|ceremony|reception/.test(lower);
  const budget = lower.match(/mmk\s*(\d[\d,]*)\s*[-–to]+\s*(\d[\d,]*)/i);

  return {
    ok: true,
    source: "mock",
    message,
    clarification: null,
    requirements: {
      clothingType: wantsSuit ? "Men's Suit" : null,
      occasion: wantsWedding ? "Wedding" : null,
      gender: /women|ladies|her /.test(lower) ? "Women" : "Men",
      style: /slim/.test(lower) ? "Modern Slim Fit" : null,
      color: null,
      fabric: null,
      budgetMin: budget ? Number(budget[1].replace(/,/g, "")) : null,
      budgetMax: budget ? Number(budget[2].replace(/,/g, "")) : null,
      deadline: /next week/.test(lower) ? "next week" : null,
      location: null,
      preferences: [],
    },
  };
}
