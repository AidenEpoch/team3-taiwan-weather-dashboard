const ALLOWED_DATASETS = new Set([
  "O-A0002-001",
  "O-A0005-001",
  "O-A0001-001",
  "F-C0032-001",
]);

module.exports = async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const dataset = String(request.query.dataset || "");
  if (!ALLOWED_DATASETS.has(dataset)) {
    return response.status(400).json({ error: "Unsupported dataset" });
  }

  const apiKey = process.env.CWA_API_KEY;
  if (!apiKey) {
    return response.status(500).json({ error: "Server configuration is missing" });
  }

  const upstreamUrl = new URL(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/${dataset}`,
  );
  upstreamUrl.searchParams.set("Authorization", apiKey);
  upstreamUrl.searchParams.set("format", "JSON");

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      headers: { Accept: "application/json" },
    });
    const payload = await upstreamResponse.json();

    response.setHeader(
      "Cache-Control",
      "public, s-maxage=600, stale-while-revalidate=300",
    );
    return response.status(upstreamResponse.status).json(payload);
  } catch (error) {
    console.error("CWA request failed", error);
    return response.status(502).json({ error: "Weather service unavailable" });
  }
};
