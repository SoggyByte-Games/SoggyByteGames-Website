import { markSvg, wordmarkSvg } from './logo.js';
import { esc, safeUrl, socialLinks, extAttrs, externalIcon, arrowIcon } from './util.js';

export const LEGAL_PAGES = [
  { slug: 'privacy', label: 'Privacy Policy' },
  { slug: 'terms', label: 'Terms of Use' },
  { slug: 'intellectual-property', label: 'IP & Copyright' },
  { slug: 'cookies', label: 'Cookie Policy' },
];

/** Inline boot script: marks JS support before first paint so reveal states never flash. */
export const BOOT_SCRIPT =
  "(function(d){var c=d.classList;c.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)c.add('reduced-motion');setTimeout(function(){if(!window.__sb)c.remove('js')},4000)})(document.documentElement);";

function navItems(cfg, base, onHome) {
  const p = onHome ? '' : base;
  const items = [{ href: `${p}#studio`, label: 'Studio' }];
  if (cfg.team.length) items.push({ href: `${p}#team`, label: 'Team' });
  items.push({ href: `${p}#games`, label: 'Games' });
  if (cfg.news.length) items.push({ href: `${p}#news`, label: 'News' });
  items.push({ href: `${p}#contact`, label: 'Contact' });
  return items;
}

export function head(cfg, base, page) {
  const { studio } = cfg;
  const title = page.title ? `${page.title} — ${studio.name}` : `${studio.name} — Game Studio`;
  const description = page.description || studio.description;
  const site = safeUrl(studio.siteUrl).replace(/\/$/, '');
  const url = site ? `${site}${page.path || '/'}` : '';
  const ogImage = site ? `${site}/og-image.png` : '';
  return `<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<meta name="theme-color" content="#0b0b0c" />
<meta name="color-scheme" content="dark" />
${page.noindex ? '<meta name="robots" content="noindex" />' : ''}
${url ? `<link rel="canonical" href="${esc(url)}" />` : ''}
<meta property="og:type" content="website" />
<meta property="og:site_name" content="${esc(studio.name)}" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
${url ? `<meta property="og:url" content="${esc(url)}" />` : ''}
${ogImage ? `<meta property="og:image" content="${esc(ogImage)}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="${esc(studio.name)} logo" />` : ''}
<meta name="twitter:card" content="summary_large_image" />
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<script>${BOOT_SCRIPT}</script>`;
}

export function header(cfg, base, { onHome = false } = {}) {
  const items = navItems(cfg, base, onHome);
  const links = items
    .map((i) => `<li><a class="nav-link" href="${i.href}"><span>${i.label}</span></a></li>`)
    .join('');
  const mobileLinks = items
    .map(
      (i, n) =>
        `<li><a class="mobile-menu__link" href="${i.href}"><span class="mobile-menu__num">0${n + 1}</span><span class="mobile-menu__label">${i.label}</span></a></li>`,
    )
    .join('');
  return `<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header" data-header>
  <a class="brand" href="${onHome ? '#top' : base}" aria-label="${esc(cfg.studio.name)} — home">
    ${markSvg({ className: 'brand__mark' })}
    <span class="brand__name">${esc(cfg.studio.shortName)}</span>
  </a>
  <nav class="site-nav" aria-label="Primary">
    <ul>${links}</ul>
  </nav>
  <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
    <span class="menu-toggle__label" data-menu-label>Menu</span>
    <span class="menu-toggle__icon" aria-hidden="true"><i></i><i></i></span>
  </button>
</header>
<div class="mobile-menu" id="mobile-menu" data-menu hidden>
  <nav aria-label="Mobile">
    <ul>${mobileLinks}</ul>
  </nav>
</div>`;
}

export function footer(cfg, base, { onHome = false } = {}) {
  const socials = socialLinks(cfg);
  const year = new Date().getFullYear();
  const legal = LEGAL_PAGES.map(
    (l) => `<li><a class="footer-link" href="${base}${l.slug}/">${l.label}</a></li>`,
  ).join('');
  const social = socials.length
    ? `<ul class="footer__social" aria-label="Social media">${socials
        .map(
          (s) =>
            `<li><a class="footer-link" href="${esc(s.url)}" ${extAttrs}>${s.label}${externalIcon}<span class="visually-hidden"> (opens in a new tab)</span></a></li>`,
        )
        .join('')}</ul>`
    : '';
  return `<footer class="site-footer" data-footer>
  <div class="footer__wordmark" data-footer-wordmark>${wordmarkSvg()}</div>
  <div class="footer__grid">
    <nav class="footer__legal" aria-label="Legal">
      <p class="footer__heading">Legal</p>
      <ul>${legal}</ul>
    </nav>
    <div class="footer__aside">
      ${social}
      <a class="footer__top" href="${onHome ? '#top' : base}">${onHome ? 'Back to top' : 'Home'}${arrowIcon}</a>
    </div>
  </div>
  <p class="footer__copy">© <span data-year>${year}</span> ${esc(cfg.studio.name)}. All rights reserved.</p>
</footer>`;
}
