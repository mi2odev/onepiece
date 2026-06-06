import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useMouseParallax } from '../../hooks/useMouseParallax';
import { useSound } from '../../hooks/useSound';

// ─────────────────────────────────────────────────────────────────────────────
// Legendary Chest CTA.
//
// A cinematic Grand-Line treasure chest. Three animation engines, never fighting
// over the same node:
//   • CSS keyframes  → always-on idle loops (breathe, seam pulse, motes, sparkle)
//   • Framer Motion  → idle float + the `arousal` hover state machine + pointer tilt
//   • GSAP           → the one-shot "unlock" timeline on click (shake/burst/spray)
//
// The lid is the only conceptually-shared part, so it is split into three nested
// wrappers — `.lid-idle` (CSS sway) → `.lid-crack` (Framer hover) → `.lid-burst`
// (GSAP open) — each owning a single transform. Reduced motion renders a calm,
// still chest and commits to `onBegin()` synchronously.
// ─────────────────────────────────────────────────────────────────────────────

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Coins sprayed on unlock — deterministic upward fan (origin = chest mouth).
const BURST = Array.from({ length: 12 }, (_, i) => {
  const ang = -Math.PI / 2 + (i / 11 - 0.5) * Math.PI * 1.55;
  const dist = 70 + (i % 4) * 20;
  return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, spin: (i % 2 ? 1 : -1) * (420 + (i % 3) * 120) };
});

// Treasure mound revealed inside the open chest (stage coords, 240×200).
// 'c' coin · faceted gems · 'crown' jewelry · 'goblet' relic · 'orb' glowing artifact.
type TreasureType = 'c' | 'ruby' | 'emerald' | 'sapphire' | 'crown' | 'goblet' | 'orb';
const TREASURE: { x: number; y: number; r: number; t: TreasureType }[] = [
  // back row, sunk deep
  { x: 64, y: 115, r: 11, t: 'c' },
  { x: 88, y: 117, r: 12, t: 'c' },
  { x: 152, y: 117, r: 12, t: 'c' },
  { x: 176, y: 115, r: 11, t: 'c' },
  // relics flanking the mound
  { x: 58, y: 103, r: 13, t: 'goblet' },
  { x: 184, y: 104, r: 12, t: 'orb' },
  // mid coins
  { x: 82, y: 105, r: 10, t: 'c' },
  { x: 104, y: 107, r: 11, t: 'c' },
  { x: 120, y: 108, r: 12, t: 'c' },
  { x: 138, y: 107, r: 11, t: 'c' },
  { x: 160, y: 105, r: 10, t: 'c' },
  // gems catching the light
  { x: 99, y: 97, r: 9, t: 'ruby' },
  { x: 143, y: 97, r: 9, t: 'sapphire' },
  { x: 121, y: 96, r: 10, t: 'emerald' },
  // top coins + crown centrepiece
  { x: 108, y: 89, r: 8, t: 'c' },
  { x: 134, y: 89, r: 8, t: 'c' },
  { x: 121, y: 79, r: 15, t: 'crown' },
];

const COIN = 'radial-gradient(circle at 38% 30%, #fff3c8 0%, #f0c452 46%, #c0892a 100%)';
const GOLD_METAL = 'linear-gradient(155deg,#fff3c0 0%,#f0c452 36%,#d49a2e 62%,#9a6a1c 100%)';
// Faceted cut-gem silhouettes (clip-path) so they read as gems, not spheres.
const GEM: Record<'ruby' | 'emerald' | 'sapphire', { bg: string; clip: string }> = {
  ruby: {
    bg: 'linear-gradient(150deg,#ffd6d6 0%,#f05a5a 42%,#9b1c1c 100%)',
    clip: 'polygon(50% 2%, 85% 30%, 72% 98%, 28% 98%, 15% 30%)',
  },
  emerald: {
    bg: 'linear-gradient(150deg,#d6ffe9 0%,#27c884 44%,#0c5c38 100%)',
    clip: 'polygon(20% 6%, 80% 6%, 96% 50%, 80% 94%, 20% 94%, 4% 50%)',
  },
  sapphire: {
    bg: 'linear-gradient(150deg,#dbe8ff 0%,#4d8bf7 44%,#16306e 100%)',
    clip: 'polygon(50% 0, 90% 38%, 50% 100%, 10% 38%)',
  },
};
const CROWN_CLIP = 'polygon(0% 100%, 0% 46%, 16% 72%, 34% 26%, 50% 64%, 66% 26%, 84% 72%, 100% 46%, 100% 100%)';
const GOBLET_CLIP =
  'polygon(28% 0, 72% 0, 69% 12%, 59% 40%, 59% 66%, 74% 70%, 74% 88%, 26% 88%, 26% 70%, 41% 66%, 41% 40%, 31% 12%)';

// Idle particle field — gold dust, teal motes, warm embers — rising off the mouth.
const MOTE_COLOR = {
  gold: { c: 'rgb(var(--gold))', glow: '0 0 7px rgba(255,213,74,0.95)' },
  teal: { c: 'rgb(var(--sea-foam))', glow: '0 0 7px rgba(126,231,193,0.85)' },
  ember: { c: '#ffb066', glow: '0 0 8px rgba(255,150,60,0.95)' },
} as const;
const MOTES: { left: number; delay: number; kind: keyof typeof MOTE_COLOR; drift: number; peak: number; size: number }[] = [
  { left: 40, delay: 0, kind: 'gold', drift: 6, peak: 0.85, size: 6 },
  { left: 70, delay: 1.4, kind: 'teal', drift: -5, peak: 0.7, size: 5 },
  { left: 100, delay: 0.7, kind: 'gold', drift: 4, peak: 0.9, size: 7 },
  { left: 130, delay: 2.1, kind: 'ember', drift: 6, peak: 0.8, size: 5 },
  { left: 160, delay: 1.0, kind: 'gold', drift: -6, peak: 0.8, size: 6 },
  { left: 192, delay: 2.6, kind: 'teal', drift: 3, peak: 0.6, size: 5 },
  { left: 54, delay: 3.3, kind: 'ember', drift: -4, peak: 0.7, size: 4 },
  { left: 146, delay: 0.4, kind: 'gold', drift: 5, peak: 0.85, size: 5 },
  { left: 118, delay: 1.9, kind: 'gold', drift: -3, peak: 0.9, size: 7 },
  { left: 206, delay: 3.7, kind: 'teal', drift: 4, peak: 0.55, size: 4 },
];

// Tiny glowing stars twinkling around the chest.
const STARS = [
  { left: 26, top: 40, size: 3, delay: 0.5 },
  { left: 212, top: 54, size: 4, delay: 2.2 },
  { left: 48, top: 22, size: 2.5, delay: 3.4 },
  { left: 192, top: 26, size: 3, delay: 1.1 },
  { left: 120, top: 14, size: 3.5, delay: 4.2 },
];

// Idle sparkles winking on the metalwork.
const SPARKLES = [
  { left: 60, top: 70, size: 9, delay: 0.4 },
  { left: 176, top: 64, size: 7, delay: 3.1 },
  { left: 120, top: 50, size: 8, delay: 5.4 },
];

/** Renders one treasure piece (its bounding box + shaped face). The wrapping
 *  `.js-treasure` span owns position + the GSAP reveal; this owns the look. */
function treasurePiece(t: TreasureType, r: number): { w: number; h: number; node: React.ReactNode } {
  const d = 2 * r;
  if (t === 'crown') {
    return {
      w: 2.4 * r,
      h: 1.7 * r,
      node: (
        <span className="relative block h-full w-full" style={{ background: GOLD_METAL, clipPath: CROWN_CLIP, boxShadow: 'inset 0 -2px 3px rgba(120,70,15,0.5)' }}>
          <span className="absolute inset-x-0 top-[18%] h-[7%]" style={{ background: 'rgba(255,255,255,0.45)' }} />
          <span className="absolute left-[15%] top-[56%] h-[17%] w-[13%] rounded-full" style={{ background: '#ef4444', boxShadow: '0 0 3px rgba(255,90,90,0.9)' }} />
          <span className="absolute left-[43%] top-[58%] h-[19%] w-[13%] rounded-full" style={{ background: '#3b82f6', boxShadow: '0 0 3px rgba(90,150,255,0.9)' }} />
          <span className="absolute left-[72%] top-[56%] h-[17%] w-[13%] rounded-full" style={{ background: '#22c07a', boxShadow: '0 0 3px rgba(60,220,150,0.9)' }} />
        </span>
      ),
    };
  }
  if (t === 'goblet') {
    return {
      w: 1.7 * r,
      h: 2.3 * r,
      node: (
        <span className="relative block h-full w-full" style={{ background: GOLD_METAL, clipPath: GOBLET_CLIP, boxShadow: 'inset 0 -2px 3px rgba(120,70,15,0.5)' }}>
          <span className="absolute left-[20%] top-[4%] h-[34%] w-[16%]" style={{ background: 'rgba(255,255,255,0.5)' }} />
        </span>
      ),
    };
  }
  if (t === 'orb') {
    return {
      w: d,
      h: d,
      node: (
        <span
          className="relative block h-full w-full rounded-full animate-chest-orb"
          style={{
            background: 'radial-gradient(circle at 38% 32%, #eafff7 0%, #6fe6c8 36%, #2aa7d6 66%, #5b6bd6 100%)',
            boxShadow: '0 0 9px rgba(90,200,220,0.9), inset 0 -2px 4px rgba(20,40,90,0.5)',
          }}
        >
          <span className="absolute left-[26%] top-[22%] h-[26%] w-[26%] rounded-full bg-white/80 blur-[1px]" />
        </span>
      ),
    };
  }
  if (t === 'ruby' || t === 'emerald' || t === 'sapphire') {
    const g = GEM[t];
    return {
      w: d,
      h: d,
      node: (
        <span className="relative block h-full w-full" style={{ background: g.bg, clipPath: g.clip, boxShadow: 'inset 0 -2px 3px rgba(0,0,0,0.4)' }}>
          <span className="absolute left-[24%] top-[14%] h-[30%] w-[34%]" style={{ background: 'rgba(255,255,255,0.75)', clipPath: g.clip, filter: 'blur(0.4px)' }} />
          <span className="absolute left-1/2 top-[8%] h-[84%] w-px -translate-x-1/2" style={{ background: 'rgba(255,255,255,0.35)' }} />
        </span>
      ),
    };
  }
  // gold coin
  return {
    w: d,
    h: d,
    node: (
      <span
        className="relative block h-full w-full rounded-full"
        style={{ background: COIN, boxShadow: 'inset 0 0 0 1.5px rgba(140,85,20,0.5), inset 0 2px 2px rgba(255,255,255,0.7), inset 0 -2px 3px rgba(120,70,15,0.55), 0 2px 3px rgba(0,0,0,0.4)' }}
      >
        <span className="absolute inset-[30%] rounded-full" style={{ boxShadow: 'inset 0 0 0 1px rgba(140,85,20,0.5)' }} />
        <span className="absolute left-1/2 top-[20%] h-[60%] w-px -translate-x-1/2" style={{ background: 'rgba(140,85,20,0.4)' }} />
      </span>
    ),
  };
}

interface Props {
  label: string;
  onBegin: () => void;
}

export function TreasureChestButton({ label, onBegin }: Props) {
  const reduce = useReducedMotionSafe();
  const { play, unlock } = useSound();
  const { x: pointerX, y: pointerY } = useMouseParallax();
  const [opening, setOpening] = useState(false);

  const rootRef = useRef<HTMLButtonElement | null>(null);
  const firedRef = useRef(false); // guards the click handler
  const beganRef = useRef(false); // guards onBegin (GSAP onComplete + safety net)
  const timers = useRef<number[]>([]);

  // ── Hover "arousal" state machine (0 → 1 across three dwell-gated stages) ──
  const arousal = useMotionValue(0);
  const arousalS = useSpring(arousal, { stiffness: 150, damping: 22, mass: 0.6 });

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const arouse = () => {
    if (reduce || opening) return;
    arousal.set(0.4); // Stage 1 — physical
    timers.current.push(window.setTimeout(() => arousal.set(0.7), 260)); // Stage 2 — energy
    timers.current.push(window.setTimeout(() => arousal.set(1), 620)); // Stage 3 — reward
  };
  const relax = () => {
    clearTimers();
    arousal.set(0);
  };

  // Derived hover values (opacity/transform only — all GPU-composited).
  const auraHot = useTransform(arousalS, [0, 1], [0, 0.7]);
  const auraScale = useTransform(arousalS, [0, 1], [1, 1.14]);
  const seamHot = useTransform(arousalS, [0.15, 1], [0, 1]);
  const rayHover = useTransform(arousalS, [0.4, 0.85], [0, 0.5]);
  const rayScaleY = useTransform(arousalS, [0.4, 1], [0.4, 1]);
  const coinPeek = useTransform(arousalS, [0.7, 1], [0, 1]);
  const coinPeekY = useTransform(arousalS, [0.7, 1], [0, -7]);
  const liftY = useTransform(arousalS, [0, 1], [0, -4]);
  // Reactive lighting: warm rim + brighter ocean reflection + deeper, wider shadow.
  const rimHot = useTransform(arousalS, [0.2, 1], [0, 0.85]);
  const reflHot = useTransform(arousalS, [0, 1], [0, 0.6]);
  const reflScale = useTransform(arousalS, [0, 1], [1, 1.18]);
  const shadowScale = useTransform(arousalS, [0, 1], [1, 1.22]);
  const shadowOpacity = useTransform(arousalS, [0, 1], [0.55, 0.8]);

  // Pointer-tracking lid tilt (viewport-relative; no-ops on touch/coarse/reduced),
  // scaled by arousal so a calm chest stays still. Includes the hover "crack".
  const lidRX = useTransform([arousalS, pointerY], ([a, py]: number[]) => a * -14 + clamp(-py * 7, -7, 7) * a);
  const lidRY = useTransform([arousalS, pointerX], ([a, px]: number[]) => clamp(px * 10, -10, 10) * a);

  const fireBegin = () => {
    if (beganRef.current) return;
    beganRef.current = true;
    onBegin();
  };

  const handleClick = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    unlock();
    play('chestOpen');
    if (reduce) {
      fireBegin();
      return;
    }
    relax();
    setOpening(true); // GSAP timeline is built in the effect below
  };

  // ── GSAP "unlock" master timeline ──────────────────────────────────────────
  useEffect(() => {
    if (!opening || reduce) return;
    const root = rootRef.current;
    if (!root) {
      fireBegin();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { force3D: true }, onComplete: fireBegin });

      // Anticipation — the chest coils before it bursts.
      tl.to('.js-coil', { scale: 0.94, y: 3, duration: 0.12, ease: 'power3.in' }, 0);

      // Violent shake (amplitude-decaying), on its own dedicated wrapper.
      tl.to(
        '.js-shake',
        {
          keyframes: {
            x: [0, 7, -6, 5, -3.5, 2, -1, 0],
            rotation: [0, 1.4, -1.2, 1, -0.6, 0.3, 0],
          },
          duration: 0.34,
          ease: 'power1.out',
        },
        0.09,
      );

      // Lock breaks apart.
      tl.to('.js-shackle', { rotation: -62, y: 16, opacity: 0, duration: 0.22, ease: 'power4.out' }, 0.14);
      tl.to('.js-plate-l', { x: -20, y: 24, rotation: -42, opacity: 0, duration: 0.32, ease: 'power3.out' }, 0.14);
      tl.to('.js-plate-r', { x: 20, y: 24, rotation: 42, opacity: 0, duration: 0.32, ease: 'power3.out' }, 0.14);

      // The dark interior hollow appears as the lid lifts (depth behind treasure).
      tl.to('.js-maw', { opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.16);

      // Lid bursts open (squash→stretch volume preservation), then settles.
      tl.fromTo(
        '.js-lid-burst',
        { rotationX: 0, scaleY: 0.9, scaleX: 1.06 },
        { rotationX: -118, scaleY: 1.16, scaleX: 0.97, duration: 0.5, ease: 'back.out(1.5)' },
        0.17,
      );
      tl.to('.js-lid-burst', { rotationX: -112, scaleY: 1, scaleX: 1, duration: 0.26, ease: 'power2.inOut' }, 0.56);

      // Light explosion — bloom + volumetric god-rays escaping the lid.
      tl.fromTo('.js-bloom', { scale: 0.4, opacity: 0 }, { scale: 2.4, opacity: 0.95, duration: 0.32, ease: 'expo.out' }, 0.21);
      tl.to('.js-bloom', { opacity: 0.28, scale: 2.1, duration: 0.42, ease: 'power2.out' }, 0.5);
      tl.fromTo(
        '.js-rayburst',
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 0.8, duration: 0.34, ease: 'expo.out', stagger: 0.03 },
        0.21,
      );
      tl.to('.js-rayburst', { opacity: 0, duration: 0.4, ease: 'power1.in' }, 0.55);

      // Screen flash veil (clamped ≤0.6 for photosensitivity), masks the route swap.
      tl.fromTo('.js-flash', { opacity: 0 }, { opacity: 0.6, duration: 0.14, ease: 'power2.out' }, 0.3);
      tl.to('.js-flash', { opacity: 0, duration: 0.4, ease: 'power1.in' }, 0.46);

      // Treasure mound rises inside the open chest.
      tl.set('.js-treasure', { willChange: 'transform' }, 0.24);
      tl.fromTo(
        '.js-treasure',
        { scale: 0, y: 8, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.7)', stagger: 0.018 },
        0.26,
      );

      // Coins + sparks spray outward.
      tl.set('.js-coin', { willChange: 'transform' }, 0.22);
      tl.fromTo(
        '.js-coin',
        { x: 0, y: 0, scale: 0.5, opacity: 0, rotation: 0 },
        {
          x: (i: number) => BURST[i].x * 1.5,
          y: (i: number) => BURST[i].y * 1.5,
          rotation: (i: number) => BURST[i].spin,
          scale: 1.1,
          opacity: 0,
          keyframes: { opacity: [0, 1, 1, 0] },
          duration: 0.62,
          ease: 'power2.out',
          stagger: 0.014,
        },
        0.23,
      );

      // Strip the will-change hints once the heavy frames are done.
      tl.set(['.js-coin', '.js-treasure'], { willChange: 'auto' });
    }, root);

    // Safety net in case a target is missing and onComplete never fires.
    const safety = window.setTimeout(fireBegin, 1200);
    return () => {
      window.clearTimeout(safety);
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opening, reduce]);

  useEffect(() => () => clearTimers(), []);

  const idle = !opening && !reduce;

  return (
    <motion.button
      ref={rootRef}
      type="button"
      onClick={handleClick}
      onPointerEnter={(e) => e.pointerType !== 'touch' && arouse()}
      onPointerLeave={(e) => e.pointerType !== 'touch' && relax()}
      onFocus={arouse}
      onBlur={relax}
      aria-label={label}
      aria-busy={opening}
      className="group relative mx-auto flex select-none flex-col items-center rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-4 focus-visible:ring-offset-ocean-deep"
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      initial={false}
      animate={idle ? { y: [0, -7, 0] } : { y: 0 }}
      transition={idle ? { duration: 5.2, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.2 }}
      whileTap={reduce ? undefined : { scale: 0.985 }}
    >
      {/* Presence sizing: the reserved box scales with --cs so the (much larger)
          chest claims real layout space instead of overflowing its neighbours;
          the inner is the fixed 240-wide design scaled uniformly by the same var,
          so every pixel-pinned 3D/seam/lock/treasure coordinate stays aligned. */}
      <div
        className="relative [--cs:1.15] xs:[--cs:1.4] sm:[--cs:1.6] lg:[--cs:1.8]"
        style={{ width: 'calc(var(--cs) * 240px)', height: 'calc(var(--cs) * 252px)' }}
      >
        <div
          className="absolute left-1/2 top-0 isolate flex w-[240px] flex-col items-center"
          style={{ transformOrigin: 'top center', transform: 'translateX(-50%) scale(var(--cs))' }}
        >
        {/* ── Ambient aura (behind everything) ───────────────────────────── */}
        <span
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[360px] w-[360px] rounded-full ${idle ? 'animate-glow-pulse' : ''}`}
          style={{
            // Centred with margins (not translate) so the glow-pulse keyframe,
            // which owns this node's `transform`, can't knock it off-centre.
            marginLeft: -180,
            marginTop: -180,
            background:
              'radial-gradient(ellipse at 50% 56%, rgb(var(--gold) / 0.40), rgb(var(--sunset) / 0.20) 44%, rgb(var(--haki) / 0.12) 66%, transparent 78%)',
            filter: 'blur(28px)',
            mixBlendMode: 'screen',
            opacity: reduce ? 0.5 : undefined,
          }}
        />
        <motion.span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[340px] w-[340px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at 50% 56%, rgb(255 226 156 / 0.6), rgb(var(--sunset) / 0.3) 45%, transparent 70%)',
            filter: 'blur(26px)',
            mixBlendMode: 'screen',
            // Framer owns the whole transform here (centering + scale).
            x: '-50%',
            y: '-50%',
            opacity: reduce ? 0 : auraHot,
            scale: reduce ? 1 : auraScale,
          }}
        />

        {/* ── 3D stage (lifts gently on hover — Framer-only transform) ────── */}
        <motion.div
          className="relative h-[200px] w-[240px]"
          style={{ perspective: 760, isolation: 'isolate', y: reduce ? 0 : liftY }}
        >
          {/* Water reflection on the night sea */}
          <div
            aria-hidden
            className={`pointer-events-none absolute left-[30px] bottom-1 h-12 w-[180px] ${idle ? 'animate-chest-refl' : ''}`}
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgb(var(--gold) / 0.45), rgb(var(--sunset) / 0.22) 40%, rgb(var(--sea-foam) / 0.16) 64%, transparent 80%)',
              transform: 'scaleY(-1)',
              filter: 'blur(5px)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 78%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 78%)',
              opacity: reduce ? 0.22 : undefined,
            }}
          />
          {/* hover: the treasure's gold light spills brighter onto the water */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 bottom-1 h-12 w-[190px]"
            style={{
              background:
                'radial-gradient(ellipse at 50% 0%, rgb(255 226 156 / 0.6), rgb(var(--gold) / 0.3) 42%, transparent 74%)',
              filter: 'blur(6px)',
              mixBlendMode: 'screen',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 78%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent 78%)',
              x: '-50%',
              scaleY: -1,
              scaleX: reduce ? 1 : reflScale,
              opacity: reduce ? 0 : reflHot,
            }}
          />

          {/* GSAP shake wrapper (never touched by Framer) */}
          <div className="js-shake absolute inset-0">
            {/* Breathing wrapper — CSS at idle, GSAP `coil` on click. Owns the
                lid's `perspective` directly (its flat ancestors above would
                otherwise collapse the stage's 3D context before it reaches the
                lid); the lid wrapper is a direct child, so this is all it needs. */}
            <div
              className={`js-coil absolute inset-0 ${idle ? 'animate-chest-breathe' : ''}`}
              style={{ transformOrigin: '50% 70%', perspective: 760 }}
            >
              {/* Ground contact shadow — deepens & spreads as the chest rises */}
              <motion.span
                aria-hidden
                className="absolute bottom-[6px] left-1/2 h-3.5 w-40 rounded-[50%] bg-black blur-md"
                style={{ x: '-50%', scaleX: reduce ? 1 : shadowScale, opacity: reduce ? 0.55 : shadowOpacity }}
              />

              {/* ── BODY ───────────────────────────────────────────────── */}
              <svg
                viewBox="0 0 240 200"
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden
              >
                <defs>
                  <linearGradient id="lc-wood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6b4422" />
                    <stop offset="22%" stopColor="#5a3318" />
                    <stop offset="60%" stopColor="#41260f" />
                    <stop offset="100%" stopColor="#2c1809" />
                  </linearGradient>
                  <linearGradient id="lc-wood-lid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7a4f29" />
                    <stop offset="45%" stopColor="#5c3717" />
                    <stop offset="100%" stopColor="#36200e" />
                  </linearGradient>
                  <linearGradient id="lc-iron" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#71717a" />
                    <stop offset="18%" stopColor="#4b4b54" />
                    <stop offset="55%" stopColor="#2a2a31" />
                    <stop offset="82%" stopColor="#14141a" />
                    <stop offset="100%" stopColor="#25252c" />
                  </linearGradient>
                  <linearGradient id="lc-brass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffe9a8" />
                    <stop offset="30%" stopColor="#e8b94e" />
                    <stop offset="55%" stopColor="#b9842c" />
                    <stop offset="100%" stopColor="#7c5417" />
                  </linearGradient>
                  <radialGradient id="lc-rivet" cx="35%" cy="30%" r="75%">
                    <stop offset="0%" stopColor="#e9e3d6" />
                    <stop offset="55%" stopColor="#8d8678" />
                    <stop offset="100%" stopColor="#3a352d" />
                  </radialGradient>
                  <radialGradient id="lc-maw" cx="50%" cy="0%" r="100%">
                    <stop offset="0%" stopColor="#3a2410" />
                    <stop offset="60%" stopColor="#1a0e05" />
                    <stop offset="100%" stopColor="#0c0703" />
                  </radialGradient>
                  <linearGradient id="lc-moon" x1="0" y1="0" x2="0.6" y2="0.5">
                    <stop offset="0%" stopColor="#e8f0ff" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#bcd2ff" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="lc-body-clip">
                    <path d="M22 100 H218 C223 100 224 103 224 108 C226 125 226 152 222 172 C220 182 214 186 206 186 H34 C26 186 20 182 18 172 C14 152 14 125 16 108 C16 103 17 100 22 100 Z" />
                  </clipPath>
                </defs>

                {/* interior maw (visible once the lid opens) */}
                <rect x="26" y="98" width="188" height="26" rx="8" fill="url(#lc-maw)" />

                {/* body shell */}
                <g clipPath="url(#lc-body-clip)">
                  <path
                    d="M22 100 H218 C223 100 224 103 224 108 C226 125 226 152 222 172 C220 182 214 186 206 186 H34 C26 186 20 182 18 172 C14 152 14 125 16 108 C16 103 17 100 22 100 Z"
                    fill="url(#lc-wood)"
                  />
                  {/* plank seams */}
                  {[64, 104, 144, 184].map((x) => (
                    <g key={x}>
                      <line x1={x} y1="112" x2={x} y2="184" stroke="#1c0f06" strokeWidth="1.4" />
                      <line x1={x - 1.2} y1="112" x2={x - 1.2} y2="184" stroke="#9a6a38" strokeWidth="0.8" opacity="0.5" />
                    </g>
                  ))}
                  {/* ambient occlusion at the rim + base */}
                  <rect x="14" y="110" width="212" height="80" fill="black" opacity="0.18" style={{ mixBlendMode: 'multiply' }} />
                  <rect x="14" y="100" width="212" height="9" fill="#000" opacity="0.4" />
                  {/* metal bands */}
                  {[
                    { x: 50, w: 16 },
                    { x: 158, w: 16 },
                  ].map((b) => (
                    <g key={b.x}>
                      <rect x={b.x} y="100" width={b.w} height="86" fill="url(#lc-iron)" />
                      <rect x={b.x} y="100" width="1" height="86" fill="#8a8a95" opacity="0.6" />
                      <rect x={b.x + b.w - 1} y="100" width="1" height="86" fill="#000" opacity="0.5" />
                      {[116, 140, 164, 178].map((cy) => (
                        <g key={cy}>
                          <circle cx={b.x + b.w / 2 + 0.6} cy={cy + 0.6} r="2.6" fill="#000" opacity="0.45" />
                          <circle cx={b.x + b.w / 2} cy={cy} r="2.6" fill="url(#lc-rivet)" />
                        </g>
                      ))}
                    </g>
                  ))}
                  {/* bottom band */}
                  <rect x="14" y="174" width="212" height="12" fill="url(#lc-iron)" />
                  {[40, 120, 200].map((cx) => (
                    <circle key={cx} cx={cx} cy="180" r="2.4" fill="url(#lc-rivet)" />
                  ))}

                  {/* engraved anchor (left) */}
                  <g stroke="#1a0e05" strokeWidth="1.2" fill="none" opacity="0.85" strokeLinecap="round" transform="translate(92 150)">
                    <circle cx="0" cy="-12" r="3" />
                    <line x1="0" y1="-9" x2="0" y2="8" />
                    <line x1="-7" y1="-4" x2="7" y2="-4" />
                    <path d="M-8 4 C-8 11 -3 13 0 13 C3 13 8 11 8 4" />
                  </g>
                  <g stroke="#b98a4e" strokeWidth="0.7" fill="none" opacity="0.4" strokeLinecap="round" transform="translate(91.4 149.4)">
                    <circle cx="0" cy="-12" r="3" />
                    <path d="M-8 4 C-8 11 -3 13 0 13 C3 13 8 11 8 4" />
                  </g>
                  {/* engraved ship's wheel (right) */}
                  <g stroke="#1a0e05" strokeWidth="1.2" fill="none" opacity="0.85" transform="translate(148 150)">
                    <circle cx="0" cy="0" r="9" />
                    <circle cx="0" cy="0" r="3.4" />
                    {[0, 45, 90, 135].map((a) => {
                      const r = (a * Math.PI) / 180;
                      return <line key={a} x1={-12 * Math.cos(r)} y1={-12 * Math.sin(r)} x2={12 * Math.cos(r)} y2={12 * Math.sin(r)} />;
                    })}
                  </g>
                </g>

                {/* moonlight rim — top-left silhouette only */}
                <path
                  d="M22 100 C17 100 16 103 16 108 C14 125 14 150 17 170"
                  fill="none"
                  stroke="url(#lc-moon)"
                  strokeWidth="1.6"
                  opacity="0.7"
                  style={{ mixBlendMode: 'screen' }}
                />
              </svg>

              {/* interior hollow — dark cavity behind the treasure, faded in by
                  GSAP as the lid opens (hidden behind the closed lid at rest) */}
              <span
                aria-hidden
                className="js-maw pointer-events-none absolute opacity-0"
                style={{
                  left: 28,
                  top: 98,
                  width: 184,
                  height: 34,
                  borderRadius: '6px 6px 12px 12px',
                  background: 'linear-gradient(180deg,#0c0703 0%,#1a0e05 55%,#2a1808 100%)',
                  boxShadow: 'inset 0 7px 11px rgba(0,0,0,0.85), inset 0 -3px 6px rgba(120,70,15,0.4)',
                }}
              />

              {/* hover god-rays (subtle, escape the seam) */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[58px] h-[60px] w-[150px]"
                style={{
                  background:
                    'conic-gradient(from 180deg at 50% 100%, transparent 0deg, rgb(var(--gold) / 0.55) 16deg, transparent 30deg, transparent 60deg, rgb(255 245 200 / 0.5) 76deg, transparent 90deg, transparent 130deg, rgb(var(--gold) / 0.5) 150deg, transparent 168deg)',
                  transformOrigin: '50% 100%',
                  filter: 'blur(3px)',
                  mixBlendMode: 'screen',
                  // Framer owns the transform (centering + scaleY).
                  x: '-50%',
                  opacity: reduce ? 0 : rayHover,
                  scaleY: reduce ? 1 : rayScaleY,
                }}
              />

              {/* treasure hoard (revealed on open) — coins, faceted gems,
                  crown, goblet relic, glowing artifact */}
              {TREASURE.map((it, i) => {
                const piece = treasurePiece(it.t, it.r);
                return (
                  <span
                    key={i}
                    aria-hidden
                    className="js-treasure absolute"
                    style={{
                      left: it.x - piece.w / 2,
                      top: it.y - piece.h / 2,
                      width: piece.w,
                      height: piece.h,
                      opacity: 0,
                      transform: 'scale(0)',
                    }}
                  >
                    {piece.node}
                  </span>
                );
              })}

              {/* hover coin-peek — three coins crest the seam before you click */}
              {[100, 120, 140].map((cx, i) => (
                <motion.span
                  key={cx}
                  aria-hidden
                  className="pointer-events-none absolute h-3.5 w-3.5 rounded-full"
                  style={{
                    left: cx - 7,
                    top: 92,
                    background: COIN,
                    boxShadow: '0 0 6px rgba(255,200,80,0.8)',
                    opacity: reduce ? 0 : coinPeek,
                    y: reduce ? 0 : coinPeekY,
                    scale: 0.9 + i * 0.05,
                  }}
                />
              ))}

              {/* ── LID — nested wrappers: CSS sway → Framer crack → GSAP burst */}
              <div
                className={`absolute left-[4px] top-[36px] h-[64px] w-[232px] ${idle ? 'animate-chest-lid-idle' : ''}`}
                style={{ transformOrigin: '50% 100%', transformStyle: 'preserve-3d' }}
              >
                <motion.div
                  className="h-full w-full"
                  style={{
                    transformOrigin: '50% 100%',
                    transformStyle: 'preserve-3d',
                    rotateX: reduce ? 0 : lidRX,
                    rotateY: reduce ? 0 : lidRY,
                  }}
                >
                  <div className="js-lid-burst h-full w-full" style={{ transformOrigin: '50% 100%' }}>
                    <svg viewBox="0 0 232 64" className="h-full w-full overflow-visible" aria-hidden>
                      <defs>
                        <clipPath id="lc-lid-clip">
                          <path d="M6 62 C6 16 40 6 116 6 C192 6 226 16 226 62 L226 64 L6 64 Z" />
                        </clipPath>
                        <radialGradient id="lc-lid-spec" cx="40%" cy="20%" r="60%">
                          <stop offset="0%" stopColor="#fff" stopOpacity="0.32" />
                          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <g clipPath="url(#lc-lid-clip)">
                        <path d="M6 62 C6 16 40 6 116 6 C192 6 226 16 226 62 L226 64 L6 64 Z" fill="url(#lc-wood-lid)" />
                        {/* lid plank seams */}
                        {[70, 116, 162].map((x) => (
                          <line key={x} x1={x} y1="10" x2={x} y2="62" stroke="#1c0f06" strokeWidth="1.2" opacity="0.7" />
                        ))}
                        {/* lid metal bands */}
                        {[70, 162].map((x) => (
                          <g key={x}>
                            <rect x={x - 8} y="0" width="16" height="64" fill="url(#lc-iron)" />
                            <rect x={x - 8} y="0" width="1" height="64" fill="#8a8a95" opacity="0.6" />
                            {[22, 42].map((cy) => (
                              <circle key={cy} cx={x} cy={cy} r="2.6" fill="url(#lc-rivet)" />
                            ))}
                          </g>
                        ))}
                        {/* bottom rail */}
                        <rect x="0" y="56" width="232" height="8" fill="url(#lc-iron)" />
                        {/* engraved compass rosette */}
                        <g transform="translate(116 34)">
                          <circle r="15" fill="none" stroke="#1a0e05" strokeWidth="1.2" opacity="0.8" />
                          <circle r="11.5" fill="none" stroke="#b98a4e" strokeWidth="0.7" opacity="0.4" />
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
                            const r = (a * Math.PI) / 180;
                            const long = a % 90 === 0;
                            const len = long ? 14 : 8;
                            return (
                              <g key={a}>
                                <line x1="0" y1="0" x2={len * Math.cos(r)} y2={len * Math.sin(r)} stroke="#1a0e05" strokeWidth={long ? 1.4 : 0.9} opacity="0.8" />
                              </g>
                            );
                          })}
                          <circle r="2.2" fill="#1a0e05" opacity="0.85" />
                        </g>
                        {/* specular sheen */}
                        <ellipse cx="92" cy="22" rx="40" ry="14" fill="url(#lc-lid-spec)" />
                        {/* moonlight rim on the lid crown */}
                        <path d="M6 62 C6 16 40 6 116 6" fill="none" stroke="url(#lc-moon)" strokeWidth="1.6" opacity="0.7" style={{ mixBlendMode: 'screen' }} />
                      </g>
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* seam glow — golden light leaking where lid meets body. Rendered
                  AFTER the lid so it paints over the lid's opaque bottom rail
                  (otherwise the always-on light-leak is occluded at the joint). */}
              <span
                aria-hidden
                className={`pointer-events-none absolute left-[26px] top-[96px] h-[5px] w-[188px] rounded-full ${idle ? 'animate-chest-seam' : ''}`}
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgb(var(--gold) / 0.9), rgb(255 245 200 / 1), rgb(var(--gold) / 0.9), transparent)',
                  filter: 'blur(2px)',
                  mixBlendMode: 'screen',
                  opacity: reduce ? 0.5 : undefined,
                }}
              />
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-[26px] top-[94px] h-[7px] w-[188px] rounded-full"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgb(255 245 200 / 1), #ffffff, rgb(255 245 200 / 1), transparent)',
                  filter: 'blur(2.5px)',
                  mixBlendMode: 'screen',
                  opacity: reduce ? 0 : seamHot,
                }}
              />

              {/* warm rim light washing the gold edges — intensifies on hover */}
              <motion.span
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[66px] h-20 w-[210px] -translate-x-1/2 rounded-[50%]"
                style={{
                  background: 'radial-gradient(ellipse at 50% 45%, rgb(255 230 165 / 0.5), rgb(var(--sunset) / 0.18) 55%, transparent 74%)',
                  filter: 'blur(9px)',
                  mixBlendMode: 'screen',
                  opacity: reduce ? 0 : rimHot,
                }}
              />

              {/* ── LOCK (breakable) — straddles the seam, on top of the lid ── */}
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-[80px] h-9 w-10 -translate-x-1/2" style={{ transformStyle: 'preserve-3d' }}>
                {/* shackle */}
                <span
                  className="js-shackle absolute left-1/2 top-0 h-4 w-6 -translate-x-1/2 rounded-t-full border-[3px] border-b-0"
                  style={{ borderColor: '#cda23f', transformOrigin: '50% 100%' }}
                />
                {/* plate halves */}
                <span
                  className="js-plate-l absolute bottom-0 left-0 h-7 w-1/2 rounded-l-sm"
                  style={{ background: 'linear-gradient(180deg,#ffe9a8,#b9842c 60%,#7c5417)', boxShadow: 'inset 0 1px 0 rgba(255,246,207,0.6)' }}
                />
                <span
                  className="js-plate-r absolute bottom-0 right-0 h-7 w-1/2 rounded-r-sm"
                  style={{ background: 'linear-gradient(180deg,#f5dd9a,#a8762340 60%,#6e4a14)', boxShadow: 'inset 0 1px 0 rgba(255,246,207,0.5)' }}
                >
                  <span className="absolute -left-px bottom-2 top-1 w-px bg-black/40" />
                </span>
                {/* keyhole */}
                <span className="absolute bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-950">
                  <span className="absolute left-1/2 top-1 h-1.5 w-[2px] -translate-x-1/2 bg-amber-950" />
                </span>
              </div>
            </div>
          </div>

          {/* idle particle field — gold dust, teal motes, warm embers */}
          {!reduce &&
            MOTES.map((m, i) => (
              <span
                key={i}
                aria-hidden
                className={`pointer-events-none absolute bottom-[80px] rounded-full ${idle ? 'animate-chest-mote' : ''}`}
                style={
                  {
                    left: m.left,
                    width: m.size,
                    height: m.size,
                    background: MOTE_COLOR[m.kind].c,
                    boxShadow: MOTE_COLOR[m.kind].glow,
                    animationDelay: `${m.delay}s`,
                    '--mote-drift': `${m.drift}px`,
                    '--mote-peak': m.peak,
                  } as React.CSSProperties
                }
              />
            ))}

          {/* twinkling stars drifting around the chest */}
          {!reduce &&
            STARS.map((s, i) => (
              <span
                key={i}
                aria-hidden
                className={`pointer-events-none absolute rounded-full bg-white ${idle ? 'animate-twinkle' : ''}`}
                style={{ left: s.left, top: s.top, width: s.size, height: s.size, boxShadow: '0 0 6px rgba(255,240,200,0.9)', animationDelay: `${s.delay}s` }}
              />
            ))}

          {/* idle sparkles winking on the metalwork */}
          {!reduce &&
            SPARKLES.map((s, i) => (
              <span
                key={i}
                aria-hidden
                className={`pointer-events-none absolute ${idle ? 'animate-chest-sparkle' : ''}`}
                style={{ left: s.left, top: s.top, animationDelay: `${s.delay}s` }}
              >
                <span
                  className="block"
                  style={{
                    width: s.size,
                    height: s.size,
                    background:
                      'conic-gradient(from 0deg, transparent, rgba(255,245,200,0.95), transparent 25%, transparent 50%, rgba(255,245,200,0.95) 50%, transparent 75%)',
                    clipPath:
                      'polygon(50% 0, 58% 42%, 100% 50%, 58% 58%, 50% 100%, 42% 58%, 0 50%, 42% 42%)',
                  }}
                />
              </span>
            ))}

          {/* click god-ray burst */}
          {!reduce &&
            [-28, -14, 0, 14, 28].map((deg, i) => (
              <span
                key={i}
                aria-hidden
                className="js-rayburst pointer-events-none absolute left-1/2 top-[20px] h-[80px] w-[26px] opacity-0"
                style={{
                  background: 'linear-gradient(to top, rgb(255 245 200 / 0.85), rgb(var(--gold) / 0.4) 50%, transparent)',
                  transform: `translateX(-50%) rotate(${deg}deg)`,
                  transformOrigin: '50% 100%',
                  filter: 'blur(2px)',
                  mixBlendMode: 'screen',
                }}
              />
            ))}

          {/* click bloom */}
          <span
            aria-hidden
            className="js-bloom pointer-events-none absolute left-1/2 top-[78px] h-24 w-24 -translate-x-1/2 rounded-full opacity-0"
            style={{
              background: 'radial-gradient(circle, #fff 0%, rgb(255 226 156 / 0.9) 28%, rgb(var(--sunset) / 0.5) 55%, rgb(var(--haki) / 0.25) 72%, transparent 80%)',
              mixBlendMode: 'screen',
            }}
          />

          {/* click coin spray */}
          {!reduce &&
            BURST.map((_, i) => (
              <span
                key={i}
                aria-hidden
                className="js-coin pointer-events-none absolute left-[114px] top-[78px] h-3 w-3 rounded-full opacity-0"
                style={{ background: COIN, boxShadow: '0 0 8px rgba(255,200,80,0.9)' }}
              />
            ))}

          {/* click screen-flash veil (kept inside the isolate stage) */}
          <span
            aria-hidden
            className="js-flash pointer-events-none absolute -inset-10 opacity-0"
            style={{ background: 'radial-gradient(circle at 50% 45%, #fff, rgb(255 226 156 / 0.7) 40%, transparent 72%)', mixBlendMode: 'screen' }}
          />
        </motion.div>

        {/* ── Label plaque ─────────────────────────────────────────────────── */}
        <div
          className="mt-1 w-max rounded-lg px-7 py-2 font-display text-base font-extrabold uppercase tracking-wider text-amber-950 transition-transform duration-300 group-hover:-translate-y-0.5 sm:text-lg"
          style={{
            background: 'linear-gradient(180deg,#ffe9a8 0%,#e0a83a 48%,#a9701c 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 4px 12px rgba(0,0,0,0.45), 0 0 18px rgba(255,160,40,0.3)',
            textShadow: '0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {label}
        </div>
        </div>
      </div>
    </motion.button>
  );
}
