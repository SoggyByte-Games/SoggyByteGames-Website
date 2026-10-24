/**
 * Legal pages: switch between legal pages in place (glide back to the top and
 * cross-fade the content) so the visitor never lands mid-page or in the footer.
 */
import { scrollToTop } from './scroll.js';

const LEGAL_PATH = /\/(privacy|terms|intellectual-property|cookies)\/(index\.html)?$/;

export function initLegal() {
  if (!document.querySelector('.legal')) return;
  const reduced = () => document.documentElement.classList.contains('reduced-motion');

  let busy = false;
  let shownPath = location.pathname;
  async function show(url, push) {
    if (busy) return;
    const current = document.querySelector('.legal');
    const title = () => document.getElementById('legal-title');
    const goTop = () => {
      scrollToTop(!reduced());
      title()?.focus({ preventScroll: true });
    };
    if (url.pathname === shownPath) {
      goTop();
      return;
    }
    busy = true;
    try {
      // Glide back to the top while the next page loads, then cross-fade the content in place.
      scrollToTop(!reduced());
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
      scrollToTop();
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
