import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import siteConfig from './site.config.js';
import { head, header, footer, BOOT_SCRIPT, LEGAL_PAGES } from './src/templates/layout.js';
import { home } from './src/templates/home.js';
import { legalPage, legalMeta } from './src/templates/legal.js';

// Set BASE_PATH when the site is served from a sub-path,
// e.g. https://<user>.github.io/<repo>/ (the Pages workflow sets this automatically).
const base = process.env.BASE_PATH || '/';
const root = fileURLToPath(new URL('.', import.meta.url));

const PAGE_META = {
  home: { path: '/' },
  404: { title: 'Page not found', path: '/404.html', noindex: true },
};

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'sha256-${createHash('sha256').update(BOOT_SCRIPT).digest('base64')}'`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "media-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  'upgrade-insecure-requests',
].join('; ');

/** Renders the HTML partials (<!--@head name-->, <!--@header-->, ...) from site.config.js. */
function sitePages() {
  let isBuild = false;
  return {
    name: 'soggybyte-pages',
    configResolved(c) {
      isBuild = c.command === 'build';
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const page = html.match(/<!--@page (\S+)-->/)?.[1] ?? 'home';
        const onHome = page === 'home';
        const legalSlug = page.startsWith('legal:') ? page.slice(6) : null;
        const meta = legalSlug ? legalMeta(legalSlug) : PAGE_META[page];
        let out = html
          .replace('<!--@head-->', head(siteConfig, base, meta))
          .replace('<!--@header-->', header(siteConfig, base, { onHome }))
          .replace('<!--@footer-->', footer(siteConfig, base, { onHome }));
        if (onHome) out = out.replace('<!--@page home-->', home(siteConfig));
        if (legalSlug) out = out.replace(`<!--@page ${page}-->`, legalPage(siteConfig, base, legalSlug));
        if (page === '404') out = out.replace('<!--@page 404-->', '');
        if (isBuild) {
          out = out.replace(
            '<meta charset="utf-8" />',
            `<meta charset="utf-8" />\n<meta http-equiv="Content-Security-Policy" content="${CSP}" />`,
          );
        }
        return out.replace(/\{\{base\}\}/g, base);
      },
    },
  };
}

export default defineConfig({
  base,
  plugins: [sitePages()],
  build: {
    target: 'es2020',
    sourcemap: false,
    // Never inline fonts as data: URIs (keeps the Content Security Policy strict).
    assetsInlineLimit: (file) => (file.endsWith('.woff2') ? false : undefined),
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        notFound: resolve(root, '404.html'),
        ...Object.fromEntries(
          LEGAL_PAGES.map((p) => [p.slug, resolve(root, `${p.slug}/index.html`)]),
        ),
      },
    },
  },
});
