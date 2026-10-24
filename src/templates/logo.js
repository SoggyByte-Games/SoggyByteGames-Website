import { readFileSync } from 'node:fs';

const logo = JSON.parse(
  readFileSync(new URL('../brand/logo-paths.json', import.meta.url), 'utf8'),
);

/** The three-piece mark (B, splash, dot). Pieces are separate so they can be animated. */
export function markSvg({ className = '', title = '' } = {}) {
  const a11y = title
    ? `role="img" aria-label="${title}"`
    : 'aria-hidden="true" focusable="false"';
  return `<svg class="logo-mark ${className}" fill-rule="evenodd" viewBox="${logo.markViewBox}" ${a11y}>
  <path class="logo-mark__b" d="${logo.mark.b}"/>
  <path class="logo-mark__splash" d="${logo.mark.splash}"/>
  <path class="logo-mark__dot" d="${logo.mark.dot}"/>
</svg>`;
}

/** Full vertical lockup: mark + SoggyByte wordmark + GAMES. */
export function lockupSvg({ className = '' } = {}) {
  const letters = logo.word
    .map((d, i) => `<path class="logo-word__l" data-i="${i}" d="${d}"/>`)
    .join('');
  const games = logo.games
    .map((d, i) => `<path class="logo-games__l" data-i="${i}" d="${d}"/>`)
    .join('');
  return `<svg class="logo-lockup ${className}" fill-rule="evenodd" viewBox="${logo.lockupViewBox}" aria-hidden="true" focusable="false">
  <g class="logo-mark">
    <path class="logo-mark__b" d="${logo.mark.b}"/>
    <path class="logo-mark__splash" d="${logo.mark.splash}"/>
    <path class="logo-mark__dot" d="${logo.mark.dot}"/>
  </g>
  <g class="logo-word">${letters}</g>
  <g class="logo-games">${games}</g>
</svg>`;
}

/** Wordmark only ("SoggyByte"), used large in the footer. */
export function wordmarkSvg({ className = '' } = {}) {
  return `<svg class="logo-wordmark ${className}" fill-rule="evenodd" viewBox="${logo.wordViewBox}" aria-hidden="true" focusable="false">
  ${logo.word.map((d) => `<path d="${d}"/>`).join('')}
</svg>`;
}
