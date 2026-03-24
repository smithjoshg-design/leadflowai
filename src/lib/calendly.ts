const raw = import.meta.env.VITE_CALENDLY_URL?.trim() ?? "";

/**
 * Your public Calendly event or scheduling URL.
 * Set `VITE_CALENDLY_URL` in `.env` locally and in your host’s env (Vercel, Netlify, etc.) for production.
 */
export const CALENDLY_BOOKING_URL: string =
  raw && /^https?:\/\//i.test(raw) ? raw : "";

/** Short label for inline text (e.g. calendly.com/you/roof-inspection). */
export function formatCalendlyDisplay(url: string): string {
  if (!url) return "";
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.replace(/\/$/, "");
    const short = path && path !== "/" ? `${host}${path}` : host;
    return short.length > 44 ? `${short.slice(0, 42)}…` : short;
  } catch {
    return "Calendly";
  }
}
