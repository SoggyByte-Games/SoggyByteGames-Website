/**
 * Legal pages: always start at the top, and switch between legal pages in place
 * (fade + scroll back to the title) so the visitor never lands mid-page or in the footer.
 */
const LEGAL_PATH = /\/(privacy|terms|intellectual-property|cookies)\/(index\.html)?$/;

export function initLegal() {
  if (!document.querySelector('.legal')) return;
  const reduced = () => document.documentElement.classList.contains('reduced-motion');

  // Scrolling the root element into view also reaches an outer page that scrolls
  // (e.g. when the site is shown embedded), not just this window.
  const scrollTop = (smooth = false) => {
    scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    document.documentElement.scrollIntoView({ block: 'start', behavior: smooth ? 'smooth' : 'auto' });
  };

  // Some browsers and embedded viewers restore the previous page's scroll position.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const toTop = () => {
    if (!location.hash) scrollTop();
  };
  toTop();
  addEventListener('load', toTop);
  addEventListener('pageshow', toTop);
  // Late restorations: keep the page at the top until the visitor scrolls themselves.
  let interacted = false;
  for (const type of ['wheel', 'touchstart', 'keydown', 'pointerdown']) {
    addEventListener(type, () => (interacted = true), { once: true, passive: true });
  }
  const until = performance.now() + 1500;
  const guard = () => {
    if (interacted || location.hash) return;
    if (scrollY > 0) scrollTop();
    if (performance.now() < until) requestAnimationFrame(guard);
  };
  requestAnimationFrame(guard);

  let busy = false;
  let shownPath = location.pathname;
  async function show(url, push) {
    if (busy) return;
    const current = document.querySelector('.legal');
    const title = () => document.getElementById('legal-title');
    const goTop = () => {
      scrollTop(!reduced());
      title()?.focus({ preventScroll: true });
    };
    if (url.pathname === shownPath) {
      goTop();
      return;
    }
    busy = true;
    try {
      // Glide back to the top while the next page loads, then cross-fade the content in place.
      scrollTop(!reduced());
      const settled = new Promise((resolve) => {
        const t0 = performance.now();
        const tick = () =>
          scrollY < 2 || performance.now() - t0 > 1100 ? resolve() : requestAnimationFrame(tick);
        tick();
      });
      const [res] = await Promise.all([fetch(url.href, { credentials: 'same-origin' }), settled]);
      if (!res.ok) throw new Error(String(res.status));
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      const next = doc.querySelector('.legal');
      if (!next) throw new Error('no legal content');
      current.classList.add('is-leaving');
      await new Promise((r) => setTimeout(r, reduced() ? 0 : 200));
      next.classList.add('is-entering');
      current.replaceWith(next);
      document.title = doc.title;
      for (const el of next.querySelectorAll('[data-year]')) el.textContent = String(new Date().getFullYear());
      shownPath = url.pathname;
      if (push) history.pushState({ legal: true }, '', url.href);
      title()?.setAttribute('tabindex', '-1');
      scrollTop();
      title()?.focus({ preventScroll: true });
      requestAnimationFrame(() => requestAnimationFrame(() => next.classList.remove('is-entering')));
    } catch {
      location.href = url.href; // fall back to a normal page load
    } finally {
      busy = false;
    }
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target && a.target !== '_self') return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.hash || !LEGAL_PATH.test(url.pathname)) return;
    e.preventDefault();
    show(url, true);
  });
  addEventListener('popstate', () => {
    if (LEGAL_PATH.test(location.pathname)) show(new URL(location.href), false);
  });
  document.getElementById('legal-title')?.setAttribute('tabindex', '-1');
}
