// Vorlix configuration
//
// Remove.bg is called directly from the browser, so its key lives here.
// WARNING: any key placed in this file is visible to every visitor of the
// site (browser DevTools > Sources). Use a restricted/free-tier key only.
const REMOVEBG_API_KEY = "AT5Z58yTotNvxJ9moQh7qqNY";

// NOTE: The Replicate API key is intentionally NOT in this file.
// Replicate blocks direct browser calls (CORS) and the key must stay secret,
// so the Image Upscaler calls Vercel Serverless Functions (/api/upscale and
// /api/upscale-status) which read the key server-side.
//
// To set it up:
//   1. Go to your Vercel project > Settings > Environment Variables
//   2. Add: Name = REPLICATE_API_KEY, Value = <your Replicate API token>
//   3. Redeploy the project
