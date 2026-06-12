// Vercel Serverless Function: polls the status of a Replicate prediction.
// The frontend calls this every ~2 seconds until the prediction succeeds
// or fails. Keeps the Replicate API key server-side and avoids CORS issues.

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.REPLICATE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'REPLICATE_API_KEY is not configured on the server.' });
  }

  const { id } = req.query;
  if (!id || !/^[\w-]+$/.test(id)) {
    return res.status(400).json({ error: 'A valid prediction id is required.' });
  }

  try {
    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { Authorization: `Token ${apiKey}` }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || 'Failed to fetch prediction status.'
      });
    }

    return res.status(200).json({
      status: data.status,        // starting | processing | succeeded | failed | canceled
      output: data.output || null, // URL string or array of URLs when succeeded
      error: data.error || null
    });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach the Replicate API. Please try again.' });
  }
}
