/**
 * DoNOTSpill title illustration: a glass of liquid that tilts and sloshes towards
 * the rim as you scroll, but never spills. A stylised take on the title only; it does
 * not depict gameplay. Canvas 2D with a small spring-column wave simulation.
 */

const COLS = 40;
const PAPER = '241, 237, 230';

export function initVessel(canvas, { reduced = false } = {}) {
  const noop = { setTilt() {}, kick() {} };
  if (!canvas) return noop;
  const ctx = canvas.getContext('2d');
  if (!ctx) return noop;

  let W = 0;
  let H = 0;
  let dpr = 1;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = rect.width;
    H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
  }

  // Wave state (local surface displacement per column).
  const hgt = new Float32Array(COLS);
  const vel = new Float32Array(COLS);

  // Tilt spring (radians).
  let angle = reduced ? -0.12 : 0;
  let angVel = 0;
  let target = reduced ? -0.12 : 0;
  let pointerTilt = 0;
  let lastAcc = 0;

  const bubbles = Array.from({ length: 9 }, (_, i) => ({
    x: ((i * 37) % 100) / 100 - 0.5,
    y: Math.random(),
    r: 1.5 + ((i * 13) % 5) * 0.6,
    s: 0.03 + ((i * 7) % 5) * 0.012,
  }));

  function glassPath(g) {
    // Local coords: origin at the base centre, y up is negative.
    const { hb, ht, gh, rb } = g;
    ctx.beginPath();
    ctx.moveTo(-ht, -gh);
    ctx.lineTo(-hb, -rb);
    ctx.quadraticCurveTo(-hb, 0, -hb + rb, 0);
    ctx.lineTo(hb - rb, 0);
    ctx.quadraticCurveTo(hb, 0, hb, -rb);
    ctx.lineTo(ht, -gh);
  }

  function step(dt) {
    // Tilt spring towards the target plus pointer influence.
    const goal = target + pointerTilt;
    const acc = (goal - angle) * 38 - angVel * 7.5;
    angVel += acc * dt;
    angle += angVel * dt;
    // Clamp so the liquid can reach the rim but never cross it.
    angle = Math.max(-0.56, Math.min(0.56, angle));
    const jerk = acc - lastAcc;
    lastAcc = acc;

    // Waves: angular acceleration pushes liquid across the glass.
    for (let i = 0; i < COLS; i++) {
      const x = i / (COLS - 1) - 0.5;
      vel[i] += (acc * 0.0009 + jerk * 0.00002) * x * 60 * dt * 60;
      vel[i] += -hgt[i] * 120 * dt - vel[i] * 2.6 * dt;
    }
    // Spread to neighbours.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < COLS; i++) {
        const l = hgt[Math.max(0, i - 1)];
        const r = hgt[Math.min(COLS - 1, i + 1)];
        vel[i] += (l + r - 2 * hgt[i]) * 260 * dt;
      }
    }
    for (let i = 0; i < COLS; i++) {
      hgt[i] += vel[i] * dt;
      hgt[i] = Math.max(-0.07, Math.min(0.07, hgt[i]));
    }
    for (const b of bubbles) {
      b.y += b.s * dt;
      if (b.y > 1) b.y = 0;
    }
  }

  function draw() {
    const c = ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);

    const u = W;
    const g = { hb: u * 0.19, ht: u * 0.255, gh: H * 0.6, rb: u * 0.06 };
    const fill = g.gh * 0.7;
    const px = W / 2;
    const py = H * 0.82;
    // Rotate around the middle of the glass so the tilted glass stays inside the canvas.
    const pivot = -g.gh / 2;

    // Floor shadow (world space, stays flat).
    const sy = py + u * 0.06;
    const sh = c.createRadialGradient(px, sy, 0, px, sy, u * 0.34);
    sh.addColorStop(0, 'rgba(0,0,0,0.6)');
    sh.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sh;
    c.beginPath();
    c.ellipse(px, sy, u * 0.34 * (1 - Math.abs(angle) * 0.4), u * 0.045, 0, 0, Math.PI * 2);
    c.fill();

    c.save();
    c.translate(px, py + pivot);
    c.rotate(angle);
    c.translate(0, -pivot);

    // Liquid: clipped to the glass, surface stays level with the world.
    c.save();
    glassPath(g);
    c.closePath();
    c.clip();
    const tan = Math.tan(angle);
    const span = g.ht * 1.05;
    // A level world surface seen in the glass's rotated frame: y = -fill - x·tanθ.
    const surfY = (x, i) => -fill - x * tan + hgt[i] * u;
    c.beginPath();
    for (let i = 0; i < COLS; i++) {
      const x = -span + (2 * span * i) / (COLS - 1);
      const y = surfY(x, i);
      i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    c.lineTo(span, u);
    c.lineTo(-span, u);
    c.closePath();
    const lg = c.createLinearGradient(0, -fill - u * 0.1, 0, 0);
    lg.addColorStop(0, '#ff6a3d');
    lg.addColorStop(0.55, '#e4471c');
    lg.addColorStop(1, '#8f2508');
    c.fillStyle = lg;
    c.fill();

    // Bubbles rising inside the liquid.
    if (!reduced) {
      c.fillStyle = `rgba(${PAPER}, 0.22)`;
      for (const b of bubbles) {
        const x = b.x * g.hb * 1.6;
        const y = -b.y * (fill - u * 0.04);
        if (y > surfY(x, Math.round((x / span + 1) * 0.5 * (COLS - 1))) + 4) {
          c.beginPath();
          c.arc(x, y, b.r, 0, Math.PI * 2);
          c.fill();
        }
      }
    }

    // Meniscus highlight.
    c.beginPath();
    for (let i = 0; i < COLS; i++) {
      const x = -span + (2 * span * i) / (COLS - 1);
      const y = surfY(x, i);
      i === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
    }
    c.strokeStyle = `rgba(${PAPER}, 0.75)`;
    c.lineWidth = 2;
    c.stroke();
    c.restore();

    // Glass body.
    c.lineJoin = 'round';
    c.lineCap = 'round';
    glassPath(g);
    c.strokeStyle = `rgba(${PAPER}, 0.85)`;
    c.lineWidth = 2;
    c.stroke();
    // Thick base.
    c.beginPath();
    c.moveTo(-g.hb + g.rb * 0.9, -u * 0.035);
    c.lineTo(g.hb - g.rb * 0.9, -u * 0.035);
    c.strokeStyle = `rgba(${PAPER}, 0.35)`;
    c.lineWidth = 1.5;
    c.stroke();
    // Rim.
    c.beginPath();
    c.moveTo(-g.ht - 3, -g.gh);
    c.lineTo(g.ht + 3, -g.gh);
    c.strokeStyle = `rgba(${PAPER}, 0.9)`;
    c.lineWidth = 2.5;
    c.stroke();
    // Reflection streaks.
    const hl = c.createLinearGradient(0, -g.gh, 0, 0);
    hl.addColorStop(0, `rgba(${PAPER}, 0)`);
    hl.addColorStop(0.3, `rgba(${PAPER}, 0.38)`);
    hl.addColorStop(1, `rgba(${PAPER}, 0)`);
    c.strokeStyle = hl;
    c.lineWidth = u * 0.018;
    c.beginPath();
    c.moveTo(-g.ht * 0.8, -g.gh * 0.88);
    c.lineTo(-g.hb * 0.78, -g.gh * 0.12);
    c.stroke();
    c.lineWidth = u * 0.006;
    c.beginPath();
    c.moveTo(-g.ht * 0.62, -g.gh * 0.8);
    c.lineTo(-g.hb * 0.62, -g.gh * 0.42);
    c.stroke();
    c.restore();
  }

  let raf = 0;
  let last = 0;
  let visible = false;
  const loop = (now) => {
    const dt = Math.min(0.033, (now - (last || now)) / 1000);
    last = now;
    // Two sub-steps keep the springs stable on slow frames.
    step(dt / 2);
    step(dt / 2);
    draw();
    raf = requestAnimationFrame(loop);
  };
  const run = () => {
    if (!raf && visible && !document.hidden && !reduced) {
      last = 0;
      raf = requestAnimationFrame(loop);
    }
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  resize();
  draw();
  new ResizeObserver(() => {
    resize();
    draw();
  }).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible ? run() : stop();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : run()));

  if (!reduced && matchMedia('(pointer: fine)').matches) {
    const stage = canvas.closest('[data-game-stage]') || canvas;
    stage.addEventListener('pointermove', (e) => {
      const r = stage.getBoundingClientRect();
      pointerTilt = ((e.clientX - r.left) / r.width - 0.5) * 0.35;
    });
    stage.addEventListener('pointerleave', () => (pointerTilt = 0));
  }

  return {
    /** Target tilt in radians (positive tips to the right). */
    setTilt(rad) {
      target = rad;
    },
    /** Impulse from scroll speed. */
    kick(v) {
      if (reduced) return;
      angVel += Math.max(-1.6, Math.min(1.6, v));
    },
  };
}
