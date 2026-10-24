/**
 * DoNOTSpill title illustration: an open delivery box that tilts as you scroll.
 * The burger inside slides towards the edge, leans over the wall and wobbles,
 * but never falls out. A stylised take on the game's premise; no game assets used.
 * Canvas 2D with a few small springs.
 */

const PAPER = '241, 237, 230';
const INK = '#0b0b0c';

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

  // All lengths below are in units of the canvas width (u).
  const BOX_W = 0.7; // inner floor width
  const WALL = 0.15; // back wall height
  const BURGER_W = 0.36;
  const LAYERS = [
    // [height, kind]
    [0.055, 'bun-bottom'],
    [0.06, 'patty'],
    [0.018, 'cheese'],
    [0.024, 'sauce'],
    [0.1, 'bun-top'],
  ];
  const STACK = LAYERS.reduce((t, l) => t + l[0], 0);
  const LIMIT = BOX_W / 2 - BURGER_W / 2 - 0.006;

  // Box tilt spring (radians, positive tips to the right).
  let angle = reduced ? -0.14 : 0;
  let angVel = 0;
  let target = reduced ? -0.14 : 0;
  let pointerTilt = 0;

  // Burger state along the box floor, its tip over the wall, and per-layer jelly.
  let pos = reduced ? -LIMIT * 0.9 : 0;
  let vel = 0;
  let tip = reduced ? -0.12 : 0;
  let tipVel = 0;
  const lag = new Float32Array(LAYERS.length);
  const lagVel = new Float32Array(LAYERS.length);
  let time = 0;

  function step(dt) {
    time += dt;
    const goal = target + pointerTilt;
    const acc = (goal - angle) * 34 - angVel * 7;
    angVel += acc * dt;
    angle += angVel * dt;
    angle = Math.max(-0.5, Math.min(0.5, angle));

    // Slide: gravity along the tilted floor, plus a little friction.
    const slope = Math.sin(angle) * 2.4;
    const stuck = Math.abs(slope) < 0.08 && Math.abs(vel) < 0.02;
    const a = stuck ? -vel * 8 : slope - vel * 1.6;
    const before = vel;
    vel += a * dt;
    pos += vel * dt;
    let impact = 0;
    if (pos > LIMIT || pos < -LIMIT) {
      pos = Math.max(-LIMIT, Math.min(LIMIT, pos));
      impact = vel;
      vel = -vel * 0.28;
    }
    const burgerAcc = (vel - before) / Math.max(dt, 1e-4);

    // Tip over the wall while pressed against it, never past the point of falling.
    const atWall = Math.abs(pos) >= LIMIT - 0.002 && Math.sign(slope) === Math.sign(pos);
    const tipGoal = atWall ? Math.sign(pos) * Math.min(0.42, Math.max(0, Math.abs(slope) - 0.25) * 0.55) : 0;
    tipVel += impact * 7;
    tipVel += ((tipGoal - tip) * 70 - tipVel * 9) * dt;
    tip += tipVel * dt;
    tip = Math.max(-0.48, Math.min(0.48, tip));

    // Layers lag behind the base like soft food.
    for (let i = 0; i < LAYERS.length; i++) {
      const k = i / (LAYERS.length - 1);
      lagVel[i] += (-lag[i] * 140 - lagVel[i] * 11 - burgerAcc * k * 0.004) * dt;
      lag[i] += lagVel[i] * dt;
      lag[i] = Math.max(-0.035, Math.min(0.035, lag[i]));
    }
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.roundRect ? c.roundRect(x, y, w, h, r) : c.rect(x, y, w, h);
  }

  function drawLayer(c, kind, x, y, w, h) {
    // y is the layer's bottom edge (local coordinates, up is negative).
    switch (kind) {
      case 'bun-bottom': {
        const g = c.createLinearGradient(0, y - h, 0, y);
        g.addColorStop(0, '#ff7a45');
        g.addColorStop(1, '#c63a12');
        c.fillStyle = g;
        roundRect(c, x - w / 2, y - h, w, h, [h * 0.25, h * 0.25, h * 0.6, h * 0.6]);
        c.fill();
        break;
      }
      case 'patty': {
        c.fillStyle = '#2a1712';
        roundRect(c, x - w / 2 - w * 0.03, y - h, w * 1.06, h, h * 0.45);
        c.fill();
        c.strokeStyle = 'rgba(255, 140, 90, 0.25)';
        c.lineWidth = 0.004;
        for (let i = 0; i < 4; i++) {
          c.beginPath();
          c.moveTo(x - w * 0.35 + i * w * 0.2, y - h * 0.7);
          c.lineTo(x - w * 0.3 + i * w * 0.2, y - h * 0.3);
          c.stroke();
        }
        break;
      }
      case 'cheese': {
        c.fillStyle = '#ffc04a';
        c.beginPath();
        c.moveTo(x - w * 0.52, y - h);
        c.lineTo(x + w * 0.52, y - h);
        c.lineTo(x + w * 0.4, y + h * 0.9);
        c.lineTo(x + w * 0.3, y);
        c.lineTo(x - w * 0.12, y);
        c.lineTo(x - w * 0.2, y + h * 1.4);
        c.lineTo(x - w * 0.28, y);
        c.lineTo(x - w * 0.52, y - h * 0.2);
        c.closePath();
        c.fill();
        break;
      }
      case 'sauce': {
        c.fillStyle = `rgb(${PAPER})`;
        c.beginPath();
        c.moveTo(x - w * 0.5, y);
        for (let i = 0; i <= 8; i++) {
          const px = x - w * 0.5 + (w * i) / 8;
          c.lineTo(px, y - h * (i % 2 ? 1 : 0.35));
        }
        c.lineTo(x + w * 0.5, y);
        c.closePath();
        c.fill();
        break;
      }
      case 'bun-top': {
        const g = c.createLinearGradient(0, y - h, 0, y);
        g.addColorStop(0, '#ff8a55');
        g.addColorStop(1, '#e4471c');
        c.fillStyle = g;
        c.beginPath();
        c.moveTo(x - w * 0.52, y);
        c.bezierCurveTo(x - w * 0.52, y - h * 1.25, x + w * 0.52, y - h * 1.25, x + w * 0.52, y);
        c.closePath();
        c.fill();
        c.fillStyle = `rgba(${PAPER}, 0.9)`;
        const seeds = [
          [-0.26, 0.55], [-0.1, 0.78], [0.08, 0.7], [0.24, 0.5], [-0.02, 0.45], [0.16, 0.85],
        ];
        for (const [sx, sy] of seeds) {
          c.beginPath();
          c.ellipse(x + sx * w, y - sy * h, w * 0.018, w * 0.008, sx * 0.8, 0, Math.PI * 2);
          c.fill();
        }
        break;
      }
    }
  }

  function draw() {
    const c = ctx;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.clearRect(0, 0, W, H);
    const u = W;
    const cx = W / 2;
    const cy = H * 0.6;

    // Floor shadow stays level.
    const sy = cy + u * 0.075;
    const sh = c.createRadialGradient(cx, sy, 0, cx, sy, u * 0.4);
    sh.addColorStop(0, 'rgba(0,0,0,0.6)');
    sh.addColorStop(1, 'rgba(0,0,0,0)');
    c.fillStyle = sh;
    c.beginPath();
    c.ellipse(cx, sy, u * 0.4 * (1 - Math.abs(angle) * 0.3), u * 0.04, 0, 0, Math.PI * 2);
    c.fill();

    c.save();
    c.translate(cx, cy);
    c.rotate(angle);
    c.scale(u, u);
    c.lineJoin = 'round';
    c.lineCap = 'round';
    const line = 2 / u;

    // Back wall of the box.
    roundRect(c, -BOX_W / 2, -WALL, BOX_W, WALL, [0.018, 0.018, 0, 0]);
    const bg = c.createLinearGradient(0, -WALL, 0, 0);
    bg.addColorStop(0, '#202024');
    bg.addColorStop(1, '#141416');
    c.fillStyle = bg;
    c.fill();
    c.strokeStyle = `rgba(${PAPER}, 0.35)`;
    c.lineWidth = line;
    c.stroke();

    // Burger: slides, tips around the corner it leans on, layers wobble.
    c.save();
    const pivotX = pos + (tip >= 0 ? BURGER_W / 2 : -BURGER_W / 2);
    c.translate(pivotX, 0);
    c.rotate(tip);
    c.translate(-pivotX, 0);
    let y = 0;
    LAYERS.forEach(([h, kind], i) => {
      drawLayer(c, kind, pos + lag[i], y, BURGER_W, h);
      y -= h;
    });
    c.restore();

    // Front wall (drawn over the burger's base) and rim.
    roundRect(c, -BOX_W / 2 - 0.012, -WALL * 0.45, BOX_W + 0.024, WALL * 0.45 + 0.018, [0, 0, 0.02, 0.02]);
    const fg = c.createLinearGradient(0, -WALL * 0.45, 0, 0.018);
    fg.addColorStop(0, '#1c1c1f');
    fg.addColorStop(1, INK);
    c.fillStyle = fg;
    c.fill();
    c.strokeStyle = `rgba(${PAPER}, 0.85)`;
    c.lineWidth = line;
    c.stroke();
    c.beginPath();
    c.moveTo(-BOX_W / 2 - 0.012, -WALL);
    c.lineTo(-BOX_W / 2 - 0.012, -WALL * 0.45);
    c.moveTo(BOX_W / 2 + 0.012, -WALL);
    c.lineTo(BOX_W / 2 + 0.012, -WALL * 0.45);
    c.stroke();

    // Where the burger's top is, in screen space, for the steam.
    const m = c.getTransform();
    const top = new DOMPoint(pos, -STACK - 0.02).matrixTransform(m);
    c.restore();

    // Steam rises straight up regardless of tilt.
    if (!reduced) {
      const sx = top.x / dpr;
      const syTop = top.y / dpr;
      c.strokeStyle = `rgba(${PAPER}, 0.32)`;
      c.lineWidth = 2;
      for (let i = -1; i <= 1; i++) {
        const phase = time * 1.6 + i * 1.7;
        const fade = (Math.sin(time * 0.9 + i) + 1) / 2;
        c.globalAlpha = 0.35 + fade * 0.65;
        c.beginPath();
        for (let k = 0; k <= 12; k++) {
          const t = k / 12;
          const px = sx + i * u * 0.06 + Math.sin(phase + t * 5) * u * 0.012;
          const py = syTop - t * u * 0.14;
          k ? c.lineTo(px, py) : c.moveTo(px, py);
        }
        c.stroke();
      }
      c.globalAlpha = 1;
    }
  }

  let raf = 0;
  let last = 0;
  let visible = false;
  const loop = (now) => {
    const dt = Math.min(0.033, (now - (last || now)) / 1000);
    last = now;
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
      pointerTilt = ((e.clientX - r.left) / r.width - 0.5) * 0.3;
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
