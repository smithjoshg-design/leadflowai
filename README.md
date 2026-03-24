# LeadFlow AI — marketing site

Static marketing landing page (Vite + React + TypeScript + Tailwind).

## Local

```bash
cd leadflow-marketing-site
npm install
npm run dev
```

Open the URL shown (usually http://localhost:5173).

## Calendly booking link

The phone demo’s calendar preview opens your real Calendly page.

1. Copy `.env.example` to `.env`.
2. Set your event URL (from Calendly → **Share** → copy link):

   ```bash
   VITE_CALENDLY_URL=https://calendly.com/your-handle/meeting-type
   ```

3. Restart `npm run dev`.

For **Vercel / Netlify**, add the same variable in project **Environment Variables** (name: `VITE_CALENDLY_URL`) and redeploy.

## Production build

```bash
npm run build
npm run preview
```

## Deploy on Vercel

1. Push this folder to a GitHub repo (or use Vercel CLI).
2. In [Vercel](https://vercel.com) → **Add New Project** → import the repo.
3. Vercel usually auto-detects **Vite**. If not: **Build Command** `npm run build`, **Output Directory** `dist`.
4. Deploy.

If you deploy only this subfolder from a monorepo, set **Root Directory** to `leadflow-marketing-site`.

## Deploy on Netlify

- Build command: `npm run build`
- Publish directory: `dist`
