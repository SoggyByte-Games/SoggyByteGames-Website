export function initNav() {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const label = document.querySelector('[data-menu-label]');
  const menu = document.querySelector('[data-menu]');
  if (!header || !toggle || !menu) return;

  let open = false;
  let closeTimer;

  const focusables = () => [toggle, ...menu.querySelectorAll('a')];

  function setOpen(next, { returnFocus = true } = {}) {
    if (next === open) return;
    open = next;
    clearTimeout(closeTimer);
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Close' : 'Menu';
    body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => {
        menu.classList.add('is-open');
        menu.querySelector('a')?.focus({ preventScroll: true });
      });
    } else {
      menu.classList.remove('is-open');
      closeTimer = setTimeout(() => (menu.hidden = true), 650);
      if (returnFocus) toggle.focus({ preventScroll: true });
    }
  }

  toggle.addEventListener('click', () => setOpen(!open));
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setOpen(false, { returnFocus: false });
  });
  document.addEventListener('keydown', (e) => {
    if (!open) return;
    if (e.key === 'Escape') setOpen(false);
    if (e.key === 'Tab') {
      // Keep keyboard focus inside the open menu.
      const items = focusables();
      const i = items.indexOf(document.activeElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i + 1) % items.length;
      e.preventDefault();
      items[next].focus();
    }
  });
  matchMedia('(min-width: 900px)').addEventListener?.('change', (e) => {
    if (e.matches) setOpen(false, { returnFocus: false });
  });

  // Hide the header while scrolling down, bring it back when scrolling up.
  let lastY = scrollY;
  let ticking = false;
  addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        const hide = y > lastY && y > innerHeight * 0.6 && !open;
        header.classList.toggle('is-hidden', hide);
        lastY = y;
        ticking = false;
      });
    },
    { passive: true },
  );
  // Never keep the header hidden while something inside it has keyboard focus.
  header.addEventListener('focusin', () => header.classList.remove('is-hidden'));

  // Highlight the section currently in view.
  const links = [...document.querySelectorAll('.site-nav a[href*="#"]')];
  const sections = links
    .map((a) => document.getElementById(a.hash.slice(1)))
    .filter(Boolean);
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const a of links) a.classList.toggle('is-active', a.hash === `#${entry.target.id}`);
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));
}
