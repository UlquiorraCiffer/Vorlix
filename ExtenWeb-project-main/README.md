# Vorlix

AI image tools platform (vorlix.org) — pure HTML, CSS and vanilla JS with Vercel Serverless Functions.

## Tools

- **Background Remover** (`background-remover.html`) — uses the [Remove.bg](https://www.remove.bg/api) API directly from the browser.
- **Image Upscaler** (`image-upscaler.html`) — uses the [Replicate](https://replicate.com) API through Vercel Serverless Functions (`api/upscale.js`, `api/upscale-status.js`) to avoid CORS and keep the key secret.
  - Normal Image → `nightmareai/real-esrgan` (2x / 4x)
  - Anime Image → `jingyunliang/swinir` (real-world SR large)

## Setup

### 1. Remove.bg key (client-side)

Edit `config.js`:

```js
const REMOVEBG_API_KEY = "your-actual-key";
```

> ⚠️ This key is visible to anyone who inspects the site. Use a free-tier or restricted key.

### 2. Replicate key (server-side, never in the repo)

1. In Vercel, open your project → **Settings** → **Environment Variables**
2. Add `REPLICATE_API_KEY` = your Replicate API token (from replicate.com/account)
3. Redeploy

## Deploy to Vercel

1. Install the CLI: `npm i -g vercel`
2. From the repo root, run `vercel` and follow the prompts (or import the repo at vercel.com/new)
3. Vercel serves the static files and automatically deploys the `api/` directory as serverless functions

## Notes

- Upscaler uploads are capped at ~3 MB because Vercel serverless request bodies are limited to ~4.5 MB and base64 adds ~33% overhead.
- Model version hashes are pinned in `api/upscale.js`; see the comments there for how to update them.
- AdSense placeholder divs (`.ad-placeholder`) are ready — replace them with your AdSense snippets.
