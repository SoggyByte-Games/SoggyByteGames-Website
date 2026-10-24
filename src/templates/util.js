export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Only http(s) and mailto URLs are ever rendered as links. */
export const safeUrl = (url = '') =>
  /^(https:\/\/|http:\/\/|mailto:)/i.test(String(url).trim()) ? String(url).trim() : '';

export const SOCIAL_LABELS = {
  youtube: 'YouTube',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
};

/** Configured social links only, in a stable order. */
export function socialLinks(cfg) {
  return Object.entries(SOCIAL_LABELS)
    .map(([key, label]) => ({ key, label, url: safeUrl(cfg.social?.[key]) }))
    .filter((s) => s.url);
}

export const arrowIcon = `<svg class="icon icon--arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const externalIcon = `<svg class="icon icon--ext" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M7 17 17 7M9 7h8v8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const lockIcon = `<svg class="icon icon--lock" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="10.5" width="14" height="10" rx="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>`;

/** Opens in a new tab without leaking the opener or referrer details. */
export const extAttrs = 'target="_blank" rel="noopener noreferrer"';
