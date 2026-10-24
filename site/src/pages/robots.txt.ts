// The live site invites indexing and names the sitemap; the /v2/ preview asks crawlers to stay out.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const live = import.meta.env.BASE_URL === '/';
  const body = live ? `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap.xml', site)}\n` : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
