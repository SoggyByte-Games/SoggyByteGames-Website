import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Liquid drips between sections (SVG path rebuilt from a 0..1 progress) ---------- */
function rand(seed) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

function makeDrips(el, seed) {
  const svg = $('svg', el);
  const path = $('path', el);
  let W = 0;
  let H = 0;
  let drips = [];
  let progress = 0;

  function layout() {
    W = el.clientWidth;
    H = el.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const r = rand(seed);
    const n = Math.max(4, Math.round(W / 170));
    drips = Array.from({ length: n }, (_, i) => {
      const neck = 5 + r() * 9;
      return {
        x: ((i + 0.2 + r() * 0.6) / n) * W,
        w: 26 + r() * 46,
        neck,
        bulb: neck + 4 + r() * 8,
        len: 0.25 + r() * 0.75,
        lag: r() * 0.25,
      };
    });
    render(progress);
  }

  function render(p) {
    progress = p;
    let d = `M0 -2 L0 0`;
    for (const k of drips) {
      const t = gsap.utils.clamp(0, 1, (p - k.lag) / (1 - k.lag));
      const L = Math.max(0, t * t * (3 - 2 * t)) * k.len * H;
      const x = k.x;
      if (L < 3) {
        d += ` L${x - k.w} 0 Q${x} ${L * 2} ${x + k.w} 0`;
        continue;
      }
      const r = Math.min(k.bulb, L * 0.42);
      const nk = Math.min(k.neck, r * 0.72);
      const cy = L - r;
      const ty = cy - Math.sqrt(Math.max(0, r * r - nk * nk));
      const mid = Math.min(ty, L * 0.45);
      d += ` L${x - k.w} 0 C${x - k.w * 0.35} 0 ${x - nk} ${mid * 0.35} ${x - nk} ${mid}`;
      d += ` L${x - nk} ${ty} A${r} ${r} 0 1 0 ${x + nk} ${ty} L${x + nk} ${mid}`;
      d += ` C${x + nk} ${mid * 0.35} ${x + k.w * 0.35} 0 ${x + k.w} 0`;
    }
    d += ` L${W} 0 L${W} -2 Z`;
    path.setAttribute('d', d);
  }

  new ResizeObserver(layout).observe(el);
  layout();
  return { render };
}

/* ---------- Liquid surface on top of the Games section ---------- */
function makeSurface(el, reduced) {
  const svg = $('svg', el);
  const path = $('path', el);
  let W = 0;
  let H = 0;
  let energy = 0;
  const resize = () => {
    W = el.clientWidth;
    H = el.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  };
  const draw = (t) => {
    const amp = H * (0.16 + Math.min(energy, 1) * 0.22);
    const pts = 24;
    let d = `M0 ${H + 2}`;
    for (let i = 0; i <= pts; i++) {
      const x = (i / pts) * W;
      const y =
        H * 0.55 +
        amp * Math.sin((x / W) * Math.PI * 2.2 + t * 0.9) * 0.6 +
        amp * Math.sin((x / W) * Math.PI * 4.7 - t * 1.4) * 0.4;
      d += ` L${x.toFixed(1)} ${y.toFixed(1)}`;
    }
    d += ` L${W} ${H + 2} Z`;
    path.setAttribute('d', d);
  };
  resize();
  new ResizeObserver(() => {
    resize();
    draw(0);
  }).observe(el);
  draw(0);
  if (reduced) return { stir() {} };

  let visible = false;
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(el);
  gsap.ticker.add((time) => {
    energy *= 0.95;
    if (visible) draw(time);
  });
  return {
    stir(v) {
      energy = Math.min(1.2, energy + Math.abs(v) * 0.00004);
    },
  };
}

/* ---------- Hero intro ---------- */
function heroIntro() {
  const lockup = $('.hero__lockup');
  if (!lockup) return;
  const b = $('.logo-mark__b', lockup);
  const splash = $('.logo-mark__splash', lockup);
  const dot = $('.logo-mark__dot', lockup);
  const letters = $$('.logo-word__l', lockup);
  const games = $$('.logo-games__l', lockup);
  const mid = (games.length - 1) / 2;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 });
  tl.fromTo(
    b,
    { opacity: 0, scaleY: 0.15, scaleX: 1.35, y: 40, transformOrigin: '50% 100%' },
    { opacity: 1, scaleY: 1, scaleX: 1, y: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)' },
  )
    .fromTo(
      splash,
      { opacity: 0, scale: 0.2, rotate: -30, x: 60, transformOrigin: '90% 50%' },
      { opacity: 1, scale: 1, rotate: 0, x: 0, duration: 1.4, ease: 'elastic.out(1, 0.55)' },
      0.18,
    )
    .fromTo(
      dot,
      { opacity: 0, y: -260, transformOrigin: '50% 100%' },
      { opacity: 1, y: 0, duration: 1.1, ease: 'bounce.out' },
      0.32,
    )
    .fromTo(
      letters,
      { opacity: 0, y: 70, scaleY: 1.5, transformOrigin: '50% 100%' },
      { opacity: 1, y: 0, scaleY: 1, duration: 0.9, stagger: 0.045, ease: 'back.out(2.2)' },
      0.55,
    )
    .fromTo(
      games,
      { opacity: 0, x: (i) => (mid - i) * 46 },
      { opacity: 1, x: 0, duration: 1.2, ease: 'expo.out' },
      1.0,
    )
    .fromTo(
      '[data-hero-fade]',
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.1 },
      1.15,
    )
    .from('[data-header]', { opacity: 0, y: -16, duration: 1 }, 1.2);
}

export function initMotion({ reduced, liquid, vessel }) {
  const dripEls = $$('[data-drips]').map((el, i) => ({ el, d: makeDrips(el, 97 + i * 53) }));
  const surfaceEl = $('[data-surface]');
  const surface = surfaceEl ? makeSurface(surfaceEl, reduced) : { stir() {} };

  if (reduced) {
    dripEls.forEach(({ d }) => d.render(0.6));
    return;
  }

  heroIntro();

  // Hero: title drifts back, blobs slide down towards the drips.
  gsap.to('.hero__inner', {
    yPercent: 16,
    scale: 0.94,
    opacity: 0.15,
    ease: 'none',
    scrollTrigger: {
      trigger: '[data-hero]',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (s) => liquid.setDrip(s.progress),
    },
  });

  // Drips grow as the next section scrolls in.
  dripEls.forEach(({ el, d }) =>
    ScrollTrigger.create({
      trigger: el.parentElement,
      start: 'top bottom',
      end: 'top 15%',
      scrub: 0.4,
      onUpdate: (s) => d.render(s.progress),
    }),
  );

  // Headlines fill with "ink" line by line.
  $$('[data-fill]').forEach((line) =>
    gsap.to(line, {
      backgroundPosition: '0% 100%',
      ease: 'none',
      scrollTrigger: { trigger: line, start: 'top 88%', end: 'top 45%', scrub: 0.5 },
    }),
  );

  // Generic reveals.
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out', overwrite: true }),
  });

  // Parallax layers.
  $$('[data-parallax]').forEach((el) =>
    gsap.to(el, {
      yPercent: Number(el.dataset.parallax) * 100,
      rotate: 8,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
    }),
  );

  // Team portraits drift at slightly different speeds.
  $$('[data-drift]').forEach((el) =>
    gsap.to(el.querySelector('.crew__figure') || el, {
      yPercent: Number(el.dataset.drift) * 100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    }),
  );

  // Liquid surface reacts to scroll speed.
  ScrollTrigger.create({
    trigger: '.games',
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (s) => {
      const v = s.getVelocity();
      surface.stir(v);
      vessel.kick(-v * 0.00006);
    },
  });

  // DoNOTSpill stage.
  const stage = $('[data-game-stage]');
  if (stage) {
    const words = $$('[data-word]', stage);
    const tagline = $('[data-game-tagline]', stage);
    gsap
      .timeline({ scrollTrigger: { trigger: stage, start: 'top 70%', once: true } })
      .fromTo(
        words,
        { opacity: 0, yPercent: 60, rotate: 5 },
        { opacity: 1, yPercent: 0, rotate: 0, duration: 1.2, stagger: 0.12, ease: 'expo.out' },
      )
      .fromTo(tagline, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }, 0.5);

    // Tilt choreography: tip, recover, tip the other way, almost spill, settle.
    const tilt = { v: 0 };
    const tiltTimeline = () =>
      gsap
        .timeline({ defaults: { ease: 'sine.inOut', onUpdate: () => vessel.setTilt(tilt.v) } })
        .to(tilt, { v: 0.32, duration: 1 })
        .to(tilt, { v: -0.26, duration: 1 })
        .to(tilt, { v: 0.5, duration: 1.2 })
        .to(tilt, { v: 0, duration: 1 });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px) and (min-height: 620px)', () => {
      const tl = tiltTimeline();
      tl.to(words[0], { xPercent: -6, duration: 4.2, ease: 'none' }, 0);
      if (words[2]) tl.to(words[2], { xPercent: 8, duration: 4.2, ease: 'none' }, 0);
      if (words[1]) {
        tl.to(words[1], { x: -6, duration: 0.08, repeat: 7, yoyo: true, ease: 'none' }, 2.6);
      }
      ScrollTrigger.create({
        animation: tl,
        trigger: stage,
        start: 'top top',
        end: '+=130%',
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
      });
    });
    mm.add('(max-width: 899px), (max-height: 619px)', () => {
      ScrollTrigger.create({
        animation: tiltTimeline(),
        trigger: '[data-vessel-wrap]',
        start: 'top 85%',
        end: 'bottom 10%',
        scrub: 0.8,
      });
    });
  }

  // Footer wordmark rises letter by letter.
  const footerLetters = $$('[data-footer-wordmark] path');
  if (footerLetters.length) {
    gsap.from(footerLetters, {
      y: 190,
      duration: 1.2,
      stagger: 0.05,
      ease: 'expo.out',
      scrollTrigger: { trigger: '[data-footer-wordmark]', start: 'top 92%', once: true },
    });
  }

  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}
