exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  let message = "";
  try {
    const body = JSON.parse(event.body || "{}");
    message = typeof body.message === "string" ? body.message : "";
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: "Invalid JSON body" }),
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok: true,
      source: "parse-request-placeholder",
      message,
      requirements: null,
      clarification: null,
    }),
  };
};
