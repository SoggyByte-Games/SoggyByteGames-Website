/**
 * Scroll behaviour shared by every page:
 * - a reload always starts at the top (browsers and embedded viewers otherwise restore the old position);
 * - a link opened with a #section still lands on that section;
 * - in-page links scroll smoothly without leaving #section in the address bar.
 */
const reduced = () => document.documentElement.classList.contains('reduced-motion');

/** Scrolling the root element into view also reaches an outer page that scrolls (embedded views). */
export function scrollToTop(smooth = false) {
  const behavior = smooth ? 'smooth' : 'auto';
  scrollTo({ top: 0, behavior });
  document.documentElement.scrollIntoView({ block: 'start', behavior });
}

export function startAtTop() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  const reload = nav?.type === 'reload';
  if (location.hash && !reload) return; // a shared link to a section
  if (location.hash) history.replaceState(null, '', location.pathname + location.search);

  scrollToTop();
  addEventListener('load', () => scrollToTop(), { once: true });
  addEventListener('pageshow', () => scrollToTop(), { once: true });
  // Late restorations: keep the page at the top until the visitor scrolls themselves.
  let interacted = false;
  for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
    addEventListener(type, () => (interacted = true), { once: true, passive: true });
  }
  const until = performance.now() + 1500;
  const guard = () => {
    if (interacted) return;
    if (scrollY > 0) scrollToTop();
    if (performance.now() < until) requestAnimationFrame(guard);
  };
  requestAnimationFrame(guard);
}

export function initAnchorLinks() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href*="#"]');
    if (!a || (a.target && a.target !== '_self')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const id = decodeURIComponent(url.hash.slice(1));
    const target = id === 'top' ? null : document.getElementById(id);
    if (id !== 'top' && !target) return;
    e.preventDefault();
    if (target) target.scrollIntoView({ block: 'start', behavior: reduced() ? 'auto' : 'smooth' });
    else scrollToTop(!reduced());
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
    // Move keyboard focus along with the scroll.
    const focusEl = target || document.getElementById('main');
    if (focusEl) {
      if (!focusEl.hasAttribute('tabindex')) focusEl.setAttribute('tabindex', '-1');
      focusEl.focus({ preventScroll: true });
    }
  });
}
