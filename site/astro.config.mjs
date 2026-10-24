// SITE_BASE switches between preview (/v2) and live (/) without touching content.
import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://ssmtariq.github.io',
  base: process.env.SITE_BASE ?? '/',
  trailingSlash: 'always',
});
