/**
 * Hero background: glossy black liquid blobs (metaballs) lit like studio product shots.
 * Plain WebGL, no libraries. Renders below native resolution, pauses when off-screen
 * or when the tab is hidden, and draws a single still frame for reduced motion.
 */

const COUNT = 10;

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec3 uBalls[${COUNT}];

void main() {
  vec2 p = gl_FragCoord.xy / uRes.y;
  float f = 0.0;
  vec2 g = vec2(0.0);
  for (int i = 0; i < ${COUNT}; i++) {
    vec2 d = p - uBalls[i].xy;
    float r2 = uBalls[i].z * uBalls[i].z;
    float l2 = dot(d, d) + 1e-5;
    f += r2 / l2;
    g += -2.0 * r2 * d / (l2 * l2);
  }
  // Slow surface wobble so the blobs never look rigid.
  f += 0.035 * sin(p.x * 9.0 + uTime * 0.7) * sin(p.y * 7.0 - uTime * 0.55);

  vec3 ink = vec3(0.043, 0.043, 0.047);
  vec3 paper = vec3(0.945, 0.929, 0.902);
  vec3 accent = vec3(1.0, 0.357, 0.18);

  // Background with a soft contact shadow around each blob.
  vec3 bg = ink * (1.0 - 0.5 * smoothstep(0.3, 1.0, f));

  // Height h = 1 - 1/f  ->  slope = grad f / f^2 (steep at the rim, flat in the middle).
  vec2 slope = g / max(f * f, 1e-3);
  vec3 n = normalize(vec3(-slope * 0.12, 1.0));
  vec3 v = vec3(0.0, 0.0, 1.0);

  vec3 key = normalize(vec3(-0.55, 0.65, 0.75));
  vec3 rim = normalize(vec3(0.75, -0.45, 0.45));
  float spec = pow(max(dot(n, normalize(key + v)), 0.0), 90.0);
  float soft = pow(max(dot(n, normalize(key + v)), 0.0), 12.0);
  float warm = pow(max(dot(n, normalize(rim + v)), 0.0), 28.0);
  float fres = pow(1.0 - clamp(n.z, 0.0, 1.0), 2.5);
  vec3 r = reflect(-v, n);
  float box = smoothstep(0.35, 0.9, r.y) * smoothstep(-0.2, 0.4, -r.x); // softbox reflection

  vec3 blob = vec3(0.02, 0.02, 0.022);
  blob += paper * (spec * 0.9 + soft * 0.04 + box * 0.16);
  blob += accent * warm * 0.22;
  blob += mix(paper, accent, 0.35) * fres * 0.14;

  // Anti-aliased edge without derivatives: pixel width in field units.
  float w = length(g) / uRes.y * 1.25 + 1e-4;
  float a = smoothstep(1.0 - w, 1.0 + w, f);
  gl_FragColor = vec4(mix(bg, blob, a), 1.0);
}`;

// Anchor layout (fractions of width/height) keeps the centre clear for the logo.
const BALLS = [
  { x: 0.08, y: 0.18, r: 0.17, ax: 0.03, ay: 0.04, s: 0.21, ph: 0.0 },
  { x: 0.2, y: 0.05, r: 0.1, ax: 0.06, ay: 0.03, s: 0.33, ph: 1.7 },
  { x: 0.03, y: 0.5, r: 0.07, ax: 0.03, ay: 0.08, s: 0.27, ph: 3.1 },
  { x: 0.9, y: 0.85, r: 0.18, ax: 0.03, ay: 0.03, s: 0.19, ph: 0.9 },
  { x: 0.98, y: 0.6, r: 0.1, ax: 0.03, ay: 0.08, s: 0.29, ph: 2.4 },
  { x: 0.74, y: 1.0, r: 0.1, ax: 0.07, ay: 0.03, s: 0.24, ph: 4.2 },
  { x: 0.93, y: 0.2, r: 0.08, ax: 0.04, ay: 0.06, s: 0.31, ph: 5.0 },
  { x: 0.33, y: -0.02, r: 0.06, ax: 0.08, ay: 0.03, s: 0.37, ph: 2.0 },
  { x: 0.62, y: 0.04, r: 0.045, ax: 0.1, ay: 0.03, s: 0.41, ph: 0.4 },
];

export function initLiquid(canvas, { reduced = false } = {}) {
  const noop = { setDrip() {} };
  if (!canvas) return noop;
  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
    preserveDrawingBuffer: false,
  });
  if (!gl) return noop;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return noop;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return noop;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'uRes');
  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uBalls = gl.getUniformLocation(prog, 'uBalls');
  const data = new Float32Array(COUNT * 3);

  const coarse = matchMedia('(pointer: coarse)').matches;
  let w = 0;
  let h = 0;
  function resize() {
    const rect = canvas.getBoundingClientRect();
    const q = Math.min(devicePixelRatio || 1, 2) * (coarse ? 0.5 : 0.6);
    w = Math.max(2, Math.round(rect.width * q));
    h = Math.max(2, Math.round(rect.height * q));
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
  }

  // Pointer drop: follows the cursor softly and merges with the blobs it touches.
  const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, r: 0, tr: 0 };
  if (!coarse && !reduced) {
    canvas.parentElement.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.tx = (e.clientX - rect.left) / rect.width;
      pointer.ty = 1 - (e.clientY - rect.top) / rect.height;
      pointer.tr = 0.055;
    });
    canvas.parentElement.addEventListener('pointerleave', () => (pointer.tr = 0));
  }

  let drip = 0;
  let intro = reduced ? 1 : 0;
  const start = performance.now();

  function draw(now) {
    const t = (now - start) / 1000;
    const aspect = w / h;
    // Portrait screens: pull blobs inward a little so they stay visible.
    const portrait = aspect < 1 ? 1.25 : 1;
    intro = Math.min(1, intro + 0.012);
    const grow = 1 - Math.pow(1 - intro, 3);
    BALLS.forEach((b, i) => {
      const x = b.x + b.ax * Math.sin(t * b.s + b.ph);
      const y = b.y + b.ay * Math.cos(t * b.s * 1.3 + b.ph) - drip * (0.35 + (i % 3) * 0.22);
      data[i * 3] = x * aspect;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = b.r * portrait * grow;
    });
    pointer.x += (pointer.tx - pointer.x) * 0.08;
    pointer.y += (pointer.ty - pointer.y) * 0.08;
    pointer.r += (pointer.tr - pointer.r) * 0.06;
    const k = (COUNT - 1) * 3;
    data[k] = pointer.x * aspect;
    data[k + 1] = pointer.y;
    data[k + 2] = pointer.r;

    gl.uniform1f(uTime, t);
    gl.uniform3fv(uBalls, data);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let raf = 0;
  let visible = true;
  const loop = (now) => {
    draw(now);
    raf = requestAnimationFrame(loop);
  };
  const run = () => {
    if (!raf && visible && !document.hidden && !reduced) raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };

  resize();
  if (reduced) draw(start + 4000);
  else run();

  new ResizeObserver(() => {
    resize();
    if (reduced) draw(start + 4000);
  }).observe(canvas);
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    visible ? run() : stop();
  }).observe(canvas);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : run()));
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    stop();
    canvas.style.display = 'none';
  });

  return {
    /** 0..1 as the hero scrolls away: blobs slide downwards towards the drips. */
    setDrip(v) {
      drip = v;
    },
  };
}
