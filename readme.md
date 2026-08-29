# PatternX

AI-powered digital tailoring for Myanmar. Describe what you want to wear in natural language; PatternX matches you with the right atelier.

> Tell us what you want to wear.

## Stack

- Vite + React + React Router (JavaScript)
- Plain CSS design system
- Netlify Functions for server-side AI
- localStorage for MVP orders

## Local development

```bash
cd PatternX_Cursor
npm install
npm run dev
```

Open http://localhost:5173

The parse-request function is a placeholder until you run the Netlify CLI (`netlify dev`) or deploy. The frontend mock parser still works without an API key.

## Build

```bash
npm run build
npm run preview
```

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Functions: `netlify/functions`
- SPA redirects are in `netlify.toml`

Set `OPENAI_API_KEY` (and optional `AI_MODEL`) in Netlify environment variables. Never commit secrets. See `.env.example`.

## Routes

| Path | Purpose |
|---|---|
| `/` | Landing |
| `/assistant` | Conversational request |
| `/requirements` | Editable extracted requirements |
| `/recommendations` | Tailor matches |
| `/tailor/:id` | Tailor details |
| `/customize` | Order customization |
| `/review` | Order summary |
| `/order-confirmed` | Confirmation |
| `/orders` | Tracking |

## Demo prompt

`I want a suit for my friend's wedding next week, budget range is MMK 100000-300000.`
