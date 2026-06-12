// Vercel Serverless Function: starts a Replicate upscale prediction.
// Acts as a proxy because Replicate's API blocks direct browser calls (CORS)
// and the API key must remain secret (server-side only).
//
// Set the key in Vercel: Project > Settings > Environment Variables
//   REPLICATE_API_KEY = <your Replicate API token>

// Model version hashes are pinned. To update one, open the model page on
// replicate.com (e.g. replicate.com/nightmareai/real-esrgan), go to the
// "Versions" tab and copy the latest version hash.
const MODELS = {
  normal: {
    // nightmareai/real-esrgan — general photo upscaling, supports scale 2/4
    version: 'f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa',
    input: (image, scale) => ({ image, scale, face_enhance: false })
  },
  anime: {
    // jingyunliang/swinir — anime / real-world super-resolution.
    // Note: SwinIR's large real-world model upscales 4x by default and does
    // not take a numeric scale parameter; the requested scale is accepted
    // from the client for API consistency but the model controls the factor.
    version: '660d922d33153019e8c263a3bba265de882e7f4f70396546b6c9c8f9d47a021a',
    input: (image, scale) => ({
      image,
      task_type: 'Real-World Image Super-Resolution-Large',
      noise: 15,
      jpeg: 40
    })
  }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.REPLICATE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'REPLICATE_API_KEY is not configured on the server. Set it in Vercel > Settings > Environment Variables.'
    });
  }

  const { image, scale, type } = req.body || {};

  if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
    return res.status(400).json({ error: 'A base64 image data URL is required.' });
  }
  if (![2, 4].includes(scale)) {
    return res.status(400).json({ error: 'Scale must be 2 or 4.' });
  }
  if (!['normal', 'anime'].includes(type)) {
    return res.status(400).json({ error: "Type must be 'normal' or 'anime'." });
  }

  const model = MODELS[type];

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: model.version,
        input: model.input(image, scale)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || data.title || 'Replicate API request failed.'
      });
    }

    return res.status(201).json({ id: data.id, status: data.status });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to reach the Replicate API. Please try again.' });
  }
}
