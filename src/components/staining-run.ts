/**
 * <staining-run>: a drawn tissue section being stained, first with hematoxylin, then eosin.
 * The tissue is generated from a seed, so it is an illustration, not a real sample.
 *
 * Markup (rendered by StainingRun.astro):
 *   <staining-run data-seed>
 *     <canvas role="img" aria-label>   the section
 *
 * Colours come from CSS custom properties:
 *   --hero-bg           the glass behind the section
 *   --hero-hematoxylin  nuclei
 *   --hero-eosin        cytoplasm and stroma (lighter shades are mixed from it)
 *   --hero-unstained    the section before staining
 */

const W = 686;
const H = 300;
/** Loop length in seconds, and the moment that shows the fully stained section. */
const LOOP = 14;
const STAINED = 11;
/** Nucleus shape [rx, ry] per cell kind. */
const SH: [number, number][] = [
  [2.5, 1.15],
  [2.2, 1.4],
  [3.0, 0.75],
  [1.5, 1.5],
  [3.6, 0.8],
  [2.6, 1.0],
];
const DEFAULTS = {
  bg: '#fbf7f8',
  hematoxylin: '#47378a',
  eosin: '#db5b8a',
  unstained: '#a0968a',
};

interface Palette {
  glass: string;
  stroma: string;
  fiber: string;
  muscle: string;
  epi: string;
  lumen: string;
  goblet: string;
  nuc: string;
  nucImm: string;
  rbc: string;
  vwall: string;
}
interface Cell {
  x: number;
  y: number;
  t: number;
  a: number;
  j: number;
  sz: number;
}
interface Crypt {
  x: number;
  depth: number;
}
interface Tissue {
  cells: Cell[];
  crypts: Crypt[];
  ys: (x: number) => number;
  musTop: (x: number) => number;
  vessels: [number, number, number][];
}
type RGB = [number, number, number];

const rng = (seed: number) => {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ------------------------------------------------------------- colours */

/** Resolve any CSS colour to RGB by letting a canvas parse it. */
function toRGB(ctx: CanvasRenderingContext2D, value: string, fallback: string): RGB {
  ctx.fillStyle = fallback;
  if (value) ctx.fillStyle = value;
  const c = String(ctx.fillStyle);
  if (c.startsWith('#')) return [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as RGB;
  const m = c.match(/[\d.]+/g) ?? ['0', '0', '0'];
  return [Number(m[0]), Number(m[1]), Number(m[2])];
}
const mix = (a: RGB, b: RGB, t: number) =>
  `rgb(${a.map((v, i) => Math.round(v + (b[i]! - v) * t)).join(',')})`;
const alpha = (c: RGB, a: number) => `rgba(${c.join(',')},${a})`;
const WHITE: RGB = [255, 255, 255];
const BLACK: RGB = [0, 0, 0];

function palettes(el: HTMLElement): { layers: [Palette, Palette, Palette]; wet: [string, string] } {
  const css = getComputedStyle(el);
  const ctx = document.createElement('canvas').getContext('2d')!;
  const get = (k: keyof typeof DEFAULTS) =>
    toRGB(ctx, css.getPropertyValue(`--hero-${k}`).trim(), DEFAULTS[k]);
  const bg = get('bg');
  const hx = get('hematoxylin');
  const eo = get('eosin');
  const un = get('unstained');
  const glass = mix(bg, bg, 0);
  const goblet = alpha(toRGB(ctx, mix(bg, WHITE, 0.6), DEFAULTS.bg), 0.85);
  const none: Palette = {
    glass,
    stroma: mix(bg, un, 0.2),
    fiber: alpha(un, 0.1),
    muscle: alpha(un, 0.14),
    epi: mix(bg, un, 0.25),
    lumen: glass,
    goblet,
    nuc: mix(bg, un, 0.45),
    nucImm: mix(bg, un, 0.5),
    rbc: mix(bg, un, 0.3),
    vwall: mix(bg, un, 0.33),
  };
  const hema: Palette = {
    glass,
    stroma: mix(bg, hx, 0.07),
    fiber: alpha(hx, 0.08),
    muscle: alpha(hx, 0.12),
    epi: mix(bg, hx, 0.12),
    lumen: glass,
    goblet: alpha(hx, 0.18),
    nuc: mix(hx, hx, 0),
    nucImm: mix(hx, BLACK, 0.4),
    rbc: mix(bg, hx, 0.08),
    vwall: mix(bg, hx, 0.14),
  };
  const he: Palette = {
    glass,
    stroma: mix(bg, eo, 0.3),
    fiber: alpha(eo, 0.16),
    muscle: alpha(eo, 0.42),
    epi: mix(bg, eo, 0.55),
    lumen: glass,
    goblet,
    nuc: hema.nuc,
    nucImm: hema.nucImm,
    rbc: mix(eo, eo, 0),
    vwall: mix(bg, eo, 0.65),
  };
  return { layers: [none, hema, he], wet: [alpha(hx, 0.14), alpha(eo, 0.18)] };
}

/* -------------------------------------------------------------- tissue */

function makeTissue(n: number, seed: number): Tissue {
  const r = rng(seed);
  const g = () => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(6.2832 * r());
  const ys = (x: number) => 26 + 4 * Math.sin(x / 23) + 2 * Math.sin(x / 7.3);
  const musTop = (x: number) => 248 + 3 * Math.sin(x / 40);
  const crypts: Crypt[] = [];
  for (let x = 20; x < W + 10; x += 44)
    crypts.push({ x: x + (r() - 0.5) * 10, depth: 150 + r() * 28 });
  const agg = [430, 188] as const;
  const vessels: [number, number, number][] = [
    [150, 226, 10],
    [610, 222, 8],
  ];
  const cells: Cell[] = [];
  const grid = new Map<string, Cell[]>();
  const G = 4;
  const MD = 3.1;
  const near = (x: number, y: number) => {
    const gx = Math.floor(x / G);
    const gy = Math.floor(y / G);
    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++) {
        const a = grid.get(`${gx + i},${gy + j}`);
        if (a) for (const c of a) if ((c.x - x) ** 2 + (c.y - y) ** 2 < MD * MD) return true;
      }
    return false;
  };
  let tries = 0;
  while (cells.length < n && tries < n * 32) {
    tries++;
    const x = r() * W;
    const y = r() * H;
    const s0 = ys(x);
    if (y < s0) continue;
    let d = 1e9;
    let cy = 0;
    let cx = 0;
    let cd = 0;
    for (const c of crypts) {
      const yy = Math.min(Math.max(y, ys(c.x)), c.depth);
      const dd = Math.hypot(x - c.x, y - yy);
      if (dd < d) [d, cy, cx, cd] = [dd, yy, c.x, c.depth];
    }
    let vd = 1e9;
    let vv = vessels[0]!;
    for (const v of vessels) {
      const dd = Math.hypot(x - v[0], y - v[1]) - v[2];
      if (dd < vd) [vd, vv] = [dd, v];
    }
    if (d < 4.5 || vd < 0) continue;
    let t: number;
    let acc: number;
    let a = r() * Math.PI;
    if (d < 14) {
      t = y > cd - 26 ? 1 : 0;
      acc = 1;
      a = Math.atan2(y - cy, x - cx);
    } else if (y < s0 + 11) {
      t = 0;
      acc = 1;
      a = Math.PI / 2 + (r() - 0.5) * 0.3;
    } else if (vd < 3) {
      t = 2;
      acc = 0.9;
      a = Math.atan2(y - vv[1], x - vv[0]) + Math.PI / 2;
    } else if (y < 200) {
      const da = Math.hypot(x - agg[0], y - agg[1]);
      if (da < 30) [t, acc] = [3, 0.95];
      else if (da < 72) [t, acc] = [r() < 0.5 ? 5 : 3, 0.55];
      else [t, acc] = [r() < 0.7 ? 2 : 3, 0.38];
    } else if (y < musTop(x)) {
      t = 2;
      acc = 0.14;
    } else {
      t = 4;
      acc = 0.85;
      a = g() * 0.12;
    }
    if (r() > acc || near(x, y)) continue;
    const c: Cell = { x, y, t, a, j: r(), sz: 0.85 + 0.3 * r() };
    cells.push(c);
    const k = `${Math.floor(x / G)},${Math.floor(y / G)}`;
    const list = grid.get(k);
    if (list) list.push(c);
    else grid.set(k, [c]);
  }
  return { cells, crypts, ys, musTop, vessels };
}

function render(ctx: CanvasRenderingContext2D, T: Tissue, s: number, pal: Palette) {
  const r = rng(5);
  ctx.setTransform(s, 0, 0, s, 0, 0);
  ctx.fillStyle = pal.glass;
  ctx.fillRect(0, 0, W, H);
  const band = (f: (x: number) => number, close: () => void) => {
    ctx.beginPath();
    ctx.moveTo(0, f(0));
    for (let x = 2; x <= W; x += 2) ctx.lineTo(x, f(x));
    close();
    ctx.closePath();
  };
  const below = () => {
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
  };
  band(T.ys, below);
  ctx.fillStyle = pal.stroma;
  ctx.fill();
  ctx.strokeStyle = pal.fiber;
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 2600; i++) {
    const x = r() * W;
    const y0 = T.ys(x) + 12;
    const y = y0 + r() * (H - y0);
    const ang = y > T.musTop(x) ? (r() - 0.5) * 0.3 : r() * Math.PI;
    const L = 5 + r() * 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + (Math.cos(ang) * L) / 2 + (r() - 0.5) * 3,
      y + (Math.sin(ang) * L) / 2 + (r() - 0.5) * 3,
      x + Math.cos(ang) * L,
      y + Math.sin(ang) * L,
    );
    ctx.stroke();
  }
  band(T.musTop, below);
  ctx.fillStyle = pal.muscle;
  ctx.fill();
  ctx.lineCap = 'round';
  ctx.strokeStyle = pal.epi;
  ctx.lineWidth = 27;
  for (const c of T.crypts) {
    ctx.beginPath();
    ctx.moveTo(c.x, T.ys(c.x) + 4);
    ctx.lineTo(c.x, c.depth);
    ctx.stroke();
  }
  ctx.lineWidth = 22;
  ctx.beginPath();
  ctx.moveTo(0, T.ys(0));
  for (let x = 2; x <= W; x += 2) ctx.lineTo(x, T.ys(x));
  ctx.stroke();
  band(T.ys, () => {
    ctx.lineTo(W, 0);
    ctx.lineTo(0, 0);
  });
  ctx.fillStyle = pal.glass;
  ctx.fill();
  ctx.fillStyle = pal.goblet;
  for (const c of T.crypts)
    for (let k = 0; k < 9; k++) {
      const sd = r() < 0.5 ? -1 : 1;
      const top = T.ys(c.x);
      const y = top + 14 + r() * (c.depth - top - 34);
      ctx.beginPath();
      ctx.ellipse(c.x + sd * (8.5 + r() * 2), y, 1.4, 2.2, 0, 0, 6.283);
      ctx.fill();
    }
  ctx.strokeStyle = pal.lumen;
  ctx.lineWidth = 7;
  for (const c of T.crypts) {
    ctx.beginPath();
    ctx.moveTo(c.x, T.ys(c.x) - 8);
    ctx.lineTo(c.x, c.depth);
    ctx.stroke();
  }
  for (const v of T.vessels) {
    ctx.fillStyle = pal.vwall;
    ctx.beginPath();
    ctx.arc(v[0], v[1], v[2] + 3.5, 0, 6.283);
    ctx.fill();
    ctx.fillStyle = pal.lumen;
    ctx.beginPath();
    ctx.arc(v[0], v[1], v[2], 0, 6.283);
    ctx.fill();
    ctx.fillStyle = pal.rbc;
    for (let k = 0; k < 8; k++) {
      const an = r() * 6.283;
      const rd = v[2] * 0.65 * Math.sqrt(r());
      ctx.beginPath();
      ctx.arc(v[0] + Math.cos(an) * rd, v[1] + Math.sin(an) * rd, 2, 0, 6.283);
      ctx.fill();
    }
  }
  // Stains absorb light, so nuclei darken what is under them, like overprinted ink.
  ctx.globalCompositeOperation = 'multiply';
  for (const c of T.cells) {
    const sh = SH[c.t]!;
    ctx.globalAlpha = 0.72 + 0.25 * c.j;
    ctx.fillStyle = c.t === 3 ? pal.nucImm : pal.nuc;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, sh[0] * c.sz, sh[1] * c.sz, c.a, 0, 6.283);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
}

/* ------------------------------------------------------------- element */

class StainingRun extends HTMLElement {
  private cv!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private tissue!: Tissue;
  private layers: HTMLCanvasElement[] | null = null;
  private wet: [string, string] = ['transparent', 'transparent'];
  private pw = 0;
  private s = 1;
  private elapsed = 0;
  private playing = false;
  private visible = true;
  private raf = 0;
  private prev = 0;
  private resizeTimer = 0;
  private io?: IntersectionObserver;
  private ro?: ResizeObserver;
  private onVisibility = () => this.loop();

  connectedCallback() {
    if (this.layers || this.cv) return;
    const cv = this.querySelector('canvas');
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    this.cv = cv;
    this.ctx = ctx;
    this.tissue = makeTissue(7000, Number(this.dataset.seed) || 11);

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.elapsed = reduced ? STAINED : 0;
    this.playing = !reduced;

    this.io = new IntersectionObserver((e) => {
      this.visible = e[0]!.isIntersecting;
      this.loop();
    });
    this.io.observe(this);
    this.ro = new ResizeObserver(() => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.build(), 120);
    });
    this.ro.observe(this.cv);
    document.addEventListener('visibilitychange', this.onVisibility);
    this.build();
    this.loop();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.io?.disconnect();
    this.ro?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  /** Run the frame loop only while playing and on screen. */
  private loop() {
    const run = this.playing && this.visible && !document.hidden;
    if (run && !this.raf) {
      this.prev = performance.now();
      const frame = (now: number) => {
        this.elapsed += Math.min(0.1, (now - this.prev) / 1000);
        this.prev = now;
        this.draw();
        this.raf = requestAnimationFrame(frame);
      };
      this.raf = requestAnimationFrame(frame);
    } else if (!run && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  }

  private build() {
    const cw = this.cv.clientWidth;
    if (!cw) return;
    const pw = Math.round(cw * (devicePixelRatio || 1));
    if (pw === this.pw) return;
    const ph = Math.round((pw * H) / W);
    this.pw = pw;
    this.cv.width = pw;
    this.cv.height = ph;
    this.s = pw / W;
    const { layers, wet } = palettes(this);
    this.wet = wet;
    this.layers = layers.map((pal) => {
      const c = document.createElement('canvas');
      c.width = pw;
      c.height = ph;
      render(c.getContext('2d')!, this.tissue, this.s, pal);
      return c;
    });
    this.draw();
  }

  /** Reveal `over` on top of `under` behind a wavy wet edge at fraction f. */
  private wash(under: HTMLCanvasElement, over: HTMLCanvasElement, f: number, wet: string) {
    const { ctx, s } = this;
    const T = this.elapsed;
    const X = f * 766 - 40;
    const pts: [number, number][] = [];
    for (let y = -10; y <= 310; y += 4)
      pts.push([X + 12 * Math.sin(y / 19 + T * 1.3) + 5 * Math.sin(y / 6.1 - T * 2), y]);
    ctx.drawImage(under, 0, 0);
    ctx.save();
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    pts.forEach((p) => ctx.lineTo(p[0], p[1]));
    ctx.lineTo(-10, 310);
    ctx.closePath();
    ctx.clip();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(over, 0, 0);
    ctx.restore();
    ctx.save();
    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.strokeStyle = wet;
    ctx.lineWidth = 9;
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0] - 3, p[1]) : ctx.moveTo(p[0] - 3, p[1])));
    ctx.stroke();
    ctx.restore();
  }

  private draw() {
    if (!this.layers) return;
    const { ctx } = this;
    const [L0, L1, L2] = this.layers as [HTMLCanvasElement, HTMLCanvasElement, HTMLCanvasElement];
    const t = this.elapsed % LOOP;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    if (t < 1.5) {
      ctx.drawImage(L0, 0, 0);
    } else if (t < 5) {
      this.wash(L0, L1, ease((t - 1.5) / 3.5), this.wet[0]);
    } else if (t < 6) {
      ctx.drawImage(L1, 0, 0);
    } else if (t < 9.5) {
      this.wash(L1, L2, ease((t - 6) / 3.5), this.wet[1]);
    } else if (t < 13) {
      ctx.drawImage(L2, 0, 0);
    } else {
      ctx.drawImage(L2, 0, 0);
      ctx.globalAlpha = t - 13;
      ctx.drawImage(L0, 0, 0);
      ctx.globalAlpha = 1;
    }
  }
}

if (!customElements.get('staining-run')) customElements.define('staining-run', StainingRun);
