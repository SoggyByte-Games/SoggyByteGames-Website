import '@fontsource-variable/unbounded/wght.css';
import '@fontsource-variable/manrope/wght.css';
import '../styles/base.css';
import '../styles/layout.css';
import '../styles/sections.css';
import { initNav } from './nav.js';

window.__sb = true; // tells the boot script that JS started correctly

const root = document.documentElement;
const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => reducedQuery.matches;
reducedQuery.addEventListener?.('change', () => root.classList.toggle('reduced-motion', reduced()));

// Copyright year always reflects the visitor's current year.
for (const el of document.querySelectorAll('[data-year]')) el.textContent = String(new Date().getFullYear());

initNav();

async function initHome() {
  const [{ initLiquid }, { initVessel }, { initMotion }] = await Promise.all([
    import('./liquid.js'),
    import('./vessel.js'),
    import('./motion.js'),
  ]);
  const liquid = initLiquid(document.querySelector('[data-liquid]'), { reduced: reduced() });
  const vessel = initVessel(document.querySelector('[data-vessel]'), { reduced: reduced() });
  initMotion({ reduced: reduced(), liquid, vessel });
}

if (document.querySelector('[data-hero]')) {
  initHome().catch((err) => {
    // Never leave content hidden if an effect fails to load.
    root.classList.add('reduced-motion');
    console.warn(err);
  });
}
