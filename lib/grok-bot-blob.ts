/**
 * Grok Bot avatars: colored body + white capsule eyes.
 * Geometry, palette, rest gaze, and liveliness follow jeremy-prt/bloub (MIT).
 */

import { LISTING_FACE_SLUGS, type ListingFaceSlug } from "@/lib/faces";

export const PROFILE_SAMPLES = 64;
const TAU = Math.PI * 2;
const RAYON = 100;

export const EYE_SPLIT = 15.46;
export const EYE_W = 0.186;
export const EYE_H = 0.412;
export const REST_GAZE = { yaw: 28.49, pitch: 28.62, roll: -13 };

export type ShapeId =
  | "cercle"
  | "galet"
  | "squircle"
  | "capsule"
  | "triangle"
  | "hexagone"
  | "nuage"
  | "goutte";

export type ColorId =
  | "encre"
  | "creme"
  | "brun"
  | "rouge"
  | "orange"
  | "ambre"
  | "vert"
  | "turquoise"
  | "bleu"
  | "violet"
  | "rose"
  | "gris";

export type ExpressionId =
  | "neutre"
  | "attentif"
  | "excite"
  | "heureux"
  | "hilare"
  | "curieux"
  | "fier"
  | "mefiant";

export type BotSkin = {
  shape: ShapeId;
  color: ColorId;
  expression: ExpressionId;
};

type Point = { x: number; y: number };
type HeadGaze = { yaw: number; pitch: number; roll: number };
type EyeCfg = { w: number; h: number; tilt?: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const r2 = (v: number) => Math.round(v * 100) / 100;
const deg = (d: number) => (d * Math.PI) / 180;

const ANGLES = Array.from({ length: PROFILE_SAMPLES }, (_, i) => (i / PROFILE_SAMPLES) * TAU);
const COS = ANGLES.map(Math.cos);
const SIN = ANGLES.map(Math.sin);

function normalize(radii: number[], max = 1) {
  const peak = Math.max(...radii);
  if (peak <= 0) return radii;
  const k = max / peak;
  return radii.map((r) => r * k);
}

function profileFromPolygon(poly: Point[], cx: number, cy: number) {
  const radii = new Array<number>(PROFILE_SAMPLES).fill(0);
  for (let k = 0; k < PROFILE_SAMPLES; k++) {
    const dx = COS[k] ?? 0;
    const dy = SIN[k] ?? 0;
    let best = 0;
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i]!;
      const b = poly[(i + 1) % poly.length]!;
      const ex = b.x - a.x;
      const ey = b.y - a.y;
      const den = dx * ey - dy * ex;
      if (Math.abs(den) < 1e-9) continue;
      const px = a.x - cx;
      const py = a.y - cy;
      const t = (px * ey - py * ex) / den;
      const u = (px * dy - py * dx) / den;
      if (t > best && u >= 0 && u <= 1) best = t;
    }
    radii[k] = best;
  }
  return radii;
}

function hullOfCircles(x1: number, y1: number, r1: number, x2: number, y2: number, r2v: number, steps = 96) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.hypot(dx, dy) || 1e-6;
  const base = Math.atan2(dy, dx);
  const spread = Math.acos(Math.max(-1, Math.min(1, (r1 - r2v) / dist)));
  const pts: Point[] = [];
  for (let i = 0; i <= steps / 2; i++) {
    const a = base + spread + ((TAU - 2 * spread) * i) / (steps / 2);
    pts.push({ x: x1 + Math.cos(a) * r1, y: y1 + Math.sin(a) * r1 });
  }
  for (let i = 0; i <= steps / 2; i++) {
    const a = base - spread + (2 * spread * i) / (steps / 2);
    pts.push({ x: x2 + Math.cos(a) * r2v, y: y2 + Math.sin(a) * r2v });
  }
  return pts;
}

function unionOfCirclesProfile(circles: Array<{ x: number; y: number; r: number }>) {
  const out = new Array<number>(PROFILE_SAMPLES).fill(0);
  for (let i = 0; i < PROFILE_SAMPLES; i++) {
    const dx = COS[i] ?? 0;
    const dy = SIN[i] ?? 0;
    let best = 0;
    for (const c of circles) {
      const b = dx * c.x + dy * c.y;
      const disc = b * b - (c.x * c.x + c.y * c.y - c.r * c.r);
      if (disc < 0) continue;
      const t = b + Math.sqrt(disc);
      if (t > best) best = t;
    }
    out[i] = best;
  }
  return out;
}

function superellipseProfile(n: number, sx = 1, sy = 1) {
  return ANGLES.map((_, i) => {
    const c = Math.abs((COS[i] ?? 0) / sx) ** n;
    const s = Math.abs((SIN[i] ?? 0) / sy) ** n;
    return (c + s) ** (-1 / n);
  });
}

function roundedPolygon(verts: Point[], rc: number, arcSteps = 10) {
  const n = verts.length;
  const out: Point[] = [];
  const normal = (a: Point, b: Point) => {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    return Math.atan2(-dx / len, dy / len);
  };
  for (let i = 0; i < n; i++) {
    const prev = verts[(i - 1 + n) % n]!;
    const cur = verts[i]!;
    const next = verts[(i + 1) % n]!;
    const a0 = normal(prev, cur);
    const a1 = normal(cur, next);
    let d = a1 - a0;
    while (d > Math.PI) d -= TAU;
    while (d < -Math.PI) d += TAU;
    for (let k = 0; k <= arcSteps; k++) {
      const a = a0 + (d * k) / arcSteps;
      out.push({ x: cur.x + Math.cos(a) * rc, y: cur.y + Math.sin(a) * rc });
    }
  }
  return out;
}

function regularPolygonProfile(sides: number, radius: number, rc: number, rotationDeg = 0) {
  const rot = (rotationDeg * Math.PI) / 180;
  const verts = Array.from({ length: sides }, (_, i) => {
    const a = rot + (i / sides) * TAU;
    return { x: Math.cos(a) * (radius - rc), y: Math.sin(a) * (radius - rc) };
  });
  return profileFromPolygon(roundedPolygon(verts, rc), 0, 0);
}

function radiusAtAngle(radii: number[], angle: number) {
  const n = radii.length;
  const t = ((((angle / TAU) % 1) + 1) % 1) * n;
  const i = Math.floor(t);
  return lerp(radii[i % n] ?? 1, radii[(i + 1) % n] ?? 1, t - i);
}

function toPoints(radii: number[], scale: number) {
  return radii.map((r, i) => ({
    x: r * (COS[i] ?? 0) * scale,
    y: r * (SIN[i] ?? 0) * scale,
  }));
}

function closedPath(pts: Point[], tension = 1 / 6) {
  const n = pts.length;
  if (n < 3) return "";
  const first = pts[0]!;
  let d = `M${r2(first.x)} ${r2(first.y)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n]!;
    const p1 = pts[i]!;
    const p2 = pts[(i + 1) % n]!;
    const p3 = pts[(i + 2) % n]!;
    const c1x = p1.x + (p2.x - p0.x) * tension;
    const c1y = p1.y + (p2.y - p0.y) * tension;
    const c2x = p2.x - (p3.x - p1.x) * tension;
    const c2y = p2.y - (p3.y - p1.y) * tension;
    d += `C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(p2.x)} ${r2(p2.y)}`;
  }
  return `${d}Z`;
}

function capsulePath(w: number, h: number) {
  const hw = Math.max(w, 0.01) / 2;
  const hh = Math.max(h, 0.01) / 2;
  const r = Math.min(hw, hh);
  return (
    `M${r2(-hw)} ${r2(-hh + r)}` +
    `A${r2(r)} ${r2(r)} 0 0 1 ${r2(-hw + r)} ${r2(-hh)}` +
    `L${r2(hw - r)} ${r2(-hh)}` +
    `A${r2(r)} ${r2(r)} 0 0 1 ${r2(hw)} ${r2(-hh + r)}` +
    `L${r2(hw)} ${r2(hh - r)}` +
    `A${r2(r)} ${r2(r)} 0 0 1 ${r2(hw - r)} ${r2(hh)}` +
    `L${r2(-hw + r)} ${r2(hh)}` +
    `A${r2(r)} ${r2(r)} 0 0 1 ${r2(-hw)} ${r2(hh - r)}Z`
  );
}

type Vec3 = [number, number, number];

function spin(u: Vec3, v: Vec3, angle: number): [Vec3, Vec3] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    [u[0] * c + v[0] * s, u[1] * c + v[1] * s, u[2] * c + v[2] * s],
    [v[0] * c - u[0] * s, v[1] * c - u[1] * s, v[2] * c - u[2] * s],
  ];
}

function eyePoses(gaze: HeadGaze, scale: number, split = EYE_SPLIT) {
  let f: Vec3 = [0, 0, 1];
  let right: Vec3 = [1, 0, 0];
  let down: Vec3 = [0, 1, 0];
  [f, right] = spin(f, right, deg(gaze.yaw));
  [down, f] = spin(down, f, deg(gaze.pitch));
  [right, down] = spin(right, down, deg(gaze.roll));

  const build = (side: number) => {
    const [ef, er] = spin(f, right, deg(split * side));
    return {
      x: ef[0] * scale,
      y: ef[1] * scale,
      a: er[0],
      b: er[1],
      c: down[0],
      d: down[1],
      depth: ef[2],
    };
  };
  return [build(-1), build(1)] as const;
}

function loopNoise(t: number, period: number, seed = 0) {
  const p = (t / period) * TAU;
  return 0.55 * Math.sin(p + seed) + 0.3 * Math.sin(2 * p + seed * 1.7 + 1.1) + 0.15 * Math.sin(3 * p + seed * 2.3 + 2.4);
}

function blinkScale(lid: number) {
  const k = lid < 0 ? 0 : lid > 1 ? 1 : lid;
  return 0.06 + 0.94 * k;
}

function blinkLid(t: number) {
  const cycle = 3.8;
  const start = 1.45;
  const dur = 0.18;
  const u = ((t % cycle) + cycle) % cycle;
  if (u >= start && u < start + dur) {
    const k = (u - start) / dur;
    return k < 0.45 ? 1 - k / 0.45 : (k - 0.45) / 0.55;
  }
  return 1;
}

/** Bloub-style rest life: gaze wander, blink, breath. */
function liveliness(t: number, phase: number) {
  const p = t + phase;
  return {
    dYaw: loopNoise(p, 11.3, 0.4 + phase) * 5.5 + loopNoise(p, 3.7, 2.1 + phase) * 1.6,
    dPitch: loopNoise(p, 9.1, 1.3 + phase) * 4.2 + loopNoise(p, 4.3, 0.7 + phase) * 1.3,
    dRoll: loopNoise(p, 13.7, 3.2 + phase) * 2.2,
    lid: blinkLid(p),
    driftX: loopNoise(p, 7.9, 1.9 + phase) * 0.008,
    driftY: loopNoise(p, 5.3, 0.3 + phase) * 0.01,
    breath: 1 + Math.sin((p / 3.4) * TAU) * 0.012,
  };
}

const pebble = normalize(
  ANGLES.map((a) => 1 + 0.075 * Math.cos(2 * a + 0.5) + 0.035 * Math.cos(3 * a + 2.1)),
  1.02,
);

const cloud = normalize(
  unionOfCirclesProfile([
    { x: -0.44, y: 0.2, r: 0.54 },
    { x: 0.46, y: 0.2, r: 0.5 },
    { x: 0.02, y: 0.3, r: 0.6 },
    { x: -0.24, y: -0.3, r: 0.48 },
    { x: 0.3, y: -0.24, r: 0.44 },
  ]),
  1.02,
);

const droplet = normalize(profileFromPolygon(hullOfCircles(0, 0.28, 0.66, 0, -0.96, 0.05), 0, 0), 1.04);
const capsule = profileFromPolygon(hullOfCircles(-0.42, 0, 0.62, 0.42, 0, 0.62), 0, 0);

export const SHAPE_RADII: Record<ShapeId, number[]> = {
  cercle: new Array(PROFILE_SAMPLES).fill(1),
  galet: pebble,
  squircle: normalize(superellipseProfile(4.2), 1.15),
  capsule,
  triangle: regularPolygonProfile(3, 1.12, 0.34, -90),
  hexagone: regularPolygonProfile(6, 1.04, 0.26, 0),
  nuage: cloud,
  goutte: droplet,
};

export const SHAPE_IDS = Object.keys(SHAPE_RADII) as ShapeId[];

export const COLORS: Record<ColorId, string> = {
  encre: "#0a0a0c",
  brun: "#8b5e3c",
  rouge: "#e8483f",
  orange: "#f08a24",
  ambre: "#f0b429",
  vert: "#3ecf8e",
  turquoise: "#2fbfa0",
  bleu: "#3b93f0",
  violet: "#8b5cf6",
  rose: "#e152b0",
  gris: "#a3a3a3",
  creme: "#f1efe9",
};

export const COLOR_IDS = Object.keys(COLORS) as ColorId[];

const PAPER = "#f1efe9";
const INK = "#0a0a0c";

function pair(w: number, h: number, tilt = 0): [EyeCfg, EyeCfg] {
  return [
    { w, h, tilt },
    { w, h, tilt: -tilt },
  ];
}

const EXPRESSIONS: Record<ExpressionId, { gaze: HeadGaze; split: number; eyes: [EyeCfg, EyeCfg] }> = {
  neutre: {
    gaze: { ...REST_GAZE },
    split: EYE_SPLIT,
    eyes: [
      { w: EYE_W, h: EYE_H },
      { w: EYE_W, h: EYE_H },
    ],
  },
  attentif: { gaze: { yaw: 4, pitch: 5, roll: -4 }, split: 16, eyes: pair(0.21, 0.44) },
  excite: { gaze: { yaw: 6, pitch: -14, roll: 0 }, split: 19.5, eyes: pair(0.4, 0.56, -10) },
  heureux: { gaze: { yaw: 5, pitch: 9, roll: 0 }, split: 17, eyes: pair(0.27, 0.17, 14) },
  hilare: { gaze: { yaw: 4, pitch: 14, roll: 0 }, split: 18, eyes: pair(0.34, 0.13, 20) },
  curieux: {
    gaze: { yaw: 16, pitch: -9, roll: -15 },
    split: 16.5,
    eyes: [
      { w: 0.24, h: 0.46, tilt: -8 },
      { w: 0.2, h: 0.38, tilt: -8 },
    ],
  },
  fier: { gaze: { yaw: 5, pitch: 17, roll: 0 }, split: 17, eyes: pair(0.3, 0.15, 18) },
  mefiant: {
    gaze: { yaw: 12, pitch: 6, roll: -6 },
    split: 16,
    eyes: [
      { w: 0.21, h: 0.4 },
      { w: 0.22, h: 0.15 },
    ],
  },
};

const EXPRESSION_IDS = Object.keys(EXPRESSIONS) as ExpressionId[];

/** Keep faces inside pointed / flat silhouettes. */
const EYE_NUDGE: Partial<Record<ShapeId, Point>> = {
  triangle: { x: 0, y: 0.12 },
  goutte: { x: 0, y: 0.16 },
  capsule: { x: 0, y: 0.05 },
  nuage: { x: 0, y: 0.08 },
  hexagone: { x: 0, y: 0.04 },
  galet: { x: 0, y: 0.03 },
};

export type RenderedBlob = {
  bodyPath: string;
  bodyFill: string;
  eyeFill: string;
  eyes: Array<{ d: string; matrix: string }>;
  viewBox: string;
};

function luminance(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16);
  if (!Number.isFinite(n)) return 0;
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

export function renderBlob(skin: BotSkin, t?: number, phase = 0): RenderedBlob {
  const radii = SHAPE_RADII[skin.shape] ?? SHAPE_RADII.cercle;
  const bodyFill = COLORS[skin.color] ?? COLORS.bleu;
  const expr = EXPRESSIONS[skin.expression] ?? EXPRESSIONS.neutre;
  const nudge = EYE_NUDGE[skin.shape] ?? { x: 0, y: 0 };
  const life = t === undefined ? null : liveliness(t, phase);
  const breath = life?.breath ?? 1;
  const pts = toPoints(radii, RAYON).map((p) => ({
    x: p.x + (life?.driftX ?? 0) * RAYON,
    y: p.y * breath + (life?.driftY ?? 0) * RAYON,
  }));
  const gaze = life
    ? {
        yaw: expr.gaze.yaw + life.dYaw,
        pitch: expr.gaze.pitch + life.dPitch,
        roll: expr.gaze.roll + life.dRoll,
      }
    : expr.gaze;
  const poses = eyePoses(gaze, RAYON, expr.split);
  const lid = blinkScale(life?.lid ?? 1);
  const eyes: RenderedBlob["eyes"] = [];

  for (let i = 0; i < 2; i++) {
    const e = poses[i]!;
    if (e.depth <= 0.02) continue;
    const cfg = expr.eyes[i]!;
    const fit = radiusAtAngle(radii, Math.atan2(e.y, e.x));
    const phi = ((cfg.tilt ?? 0) * Math.PI) / 180;
    const cp = Math.cos(phi);
    const sp = Math.sin(phi);
    const ax = e.a * cp + e.c * sp;
    const ay = (e.b * cp + e.d * sp) * lid;
    const cx2 = -e.a * sp + e.c * cp;
    const cy2 = (-e.b * sp + e.d * cp) * lid;
    eyes.push({
      d: capsulePath(cfg.w * RAYON, cfg.h * RAYON),
      matrix: `matrix(${r2(ax)},${r2(ay)},${r2(cx2)},${r2(cy2)},${r2(e.x * fit + nudge.x * RAYON + (life?.driftX ?? 0) * RAYON)},${r2(e.y * fit * breath + nudge.y * RAYON + (life?.driftY ?? 0) * RAYON)})`,
    });
  }

  return {
    bodyPath: closedPath(pts),
    bodyFill,
    eyeFill: luminance(bodyFill) > 0.68 ? INK : PAPER,
    eyes,
    viewBox: "-118 -118 236 236",
  };
}

export const LISTING_SKINS: Record<ListingFaceSlug, BotSkin> = {
  "inbox-chief": { shape: "cercle", color: "bleu", expression: "neutre" },
  "gtm-table": { shape: "squircle", color: "violet", expression: "fier" },
  "launch-desk": { shape: "triangle", color: "orange", expression: "excite" },
  "ops-pulse": { shape: "hexagone", color: "turquoise", expression: "attentif" },
  "customer-keep": { shape: "galet", color: "rose", expression: "heureux" },
  "life-admin": { shape: "goutte", color: "ambre", expression: "curieux" },
  "research-scout": { shape: "capsule", color: "vert", expression: "mefiant" },
  "content-crew": { shape: "nuage", color: "rouge", expression: "hilare" },
};

const EXTRA_SKINS: Record<string, BotSkin> = {
  "floor-nexus": { shape: "hexagone", color: "encre", expression: "attentif" },
  "run-orchestrator": { shape: "squircle", color: "encre", expression: "fier" },
  "bug-desk": { shape: "triangle", color: "gris", expression: "mefiant" },
  "elon-brief": { shape: "cercle", color: "encre", expression: "fier" },
  "jy-brief": { shape: "galet", color: "bleu", expression: "attentif" },
  "figure-voice": { shape: "nuage", color: "violet", expression: "curieux" },
  "one-machine": { shape: "capsule", color: "encre", expression: "attentif" },
  "video-editor": { shape: "triangle", color: "orange", expression: "attentif" },
  "x-top-fans": { shape: "cercle", color: "bleu", expression: "heureux" },
  jess: { shape: "galet", color: "ambre", expression: "attentif" },
  sanity: { shape: "squircle", color: "gris", expression: "attentif" },
  "eng-table": { shape: "hexagone", color: "encre", expression: "attentif" },
};

function hash32(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(items: readonly T[], n: number) {
  const i = ((n % items.length) + items.length) % items.length;
  return items[i]!;
}

function skinFromHash(input: string, avoid?: BotSkin): BotSkin {
  let n = hash32(input);
  const shape = pick(SHAPE_IDS, n);
  n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
  let color = pick(COLOR_IDS, n);
  n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
  let expression = pick(EXPRESSION_IDS, n);
  if (avoid && shape === avoid.shape && color === avoid.color) {
    color = COLOR_IDS[(COLOR_IDS.indexOf(color) + 3) % COLOR_IDS.length]!;
    expression = EXPRESSION_IDS[(EXPRESSION_IDS.indexOf(expression) + 2) % EXPRESSION_IDS.length]!;
  }
  return { shape, color, expression };
}

export function skinForFace(slug?: string, seed?: string): BotSkin | null {
  const listing =
    slug && (LISTING_FACE_SLUGS as readonly string[]).includes(slug)
      ? LISTING_SKINS[slug as ListingFaceSlug]
      : slug
        ? (EXTRA_SKINS[slug] ?? null)
        : null;
  if (listing && !seed) return listing;
  if (listing && seed) return skinFromHash(`${slug}:${seed}`, listing);
  if (seed) return skinFromHash(seed);
  if (slug) return skinFromHash(slug);
  return null;
}
