// One page and the CV; lastmod is the date of the last commit that changed the site (SITE_UPDATED).
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const base = new URL(import.meta.env.BASE_URL, site);
  const lastmod = (process.env.SITE_UPDATED ?? new Date().toISOString()).slice(0, 10);
  const urls = ['', 'cv/Syed_Tariq_CV.pdf'].map((p) => `  <url><loc>${new URL(p, base)}</loc><lastmod>${lastmod}</lastmod></url>`);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
