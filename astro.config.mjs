import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// Pages are prerendered (static) by default. Server-only routes, such as the one that will
// receive the contact form, opt out with `export const prerender = false`. See docs/adr/.
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
});
