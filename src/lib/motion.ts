import type { Transition, Variants } from 'framer-motion';

// ─────────────────────────────────────────────────────────────────────────────
// Shared motion language. Import these everywhere so the whole experience
// breathes with one rhythm. All durations assume motion is allowed; components
// gate them with `useReducedMotionSafe()`.
// ─────────────────────────────────────────────────────────────────────────────

export const spring: Record<'soft' | 'bouncy' | 'heavy', Transition> = {
  soft: { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 },
  bouncy: { type: 'spring', stiffness: 320, damping: 18, mass: 0.7 },
  heavy: { type: 'spring', stiffness: 90, damping: 22, mass: 1.4 },
};

export const easeOutSoft: Transition['ease'] = [0.22, 1, 0.36, 1];

/** Fade up with a soft overshoot. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutSoft },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: easeOutSoft } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: spring.soft },
};

/** Parent that staggers its children's `show` state. */
export const stagger = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren, delayChildren },
  },
});

/** Full-screen phase crossfade (used by AnimatePresence between hero/quiz/result). */
export const phaseTransition: Variants = {
  initial: { opacity: 0, scale: 1.02 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: easeOutSoft } },
  exit: { opacity: 0, scale: 0.985, transition: { duration: 0.4, ease: easeOutSoft } },
};

/** Treasure-chest opening burst (scale punch + settle). */
export const chestOpen: Variants = {
  closed: { scale: 1, rotate: 0 },
  open: {
    scale: [1, 1.16, 0.96, 1],
    transition: { duration: 0.7, ease: easeOutSoft },
  },
};

/** Conqueror's Haki pulse ring. */
export const hakiPulse: Variants = {
  rest: { opacity: 0, scale: 0.6 },
  burst: {
    opacity: [0, 0.85, 0],
    scale: [0.6, 1.6, 2.1],
    transition: { duration: 0.85, ease: easeOutSoft },
  },
};

/** Reduced-motion-safe variant set: same keys, no movement. */
export const still: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
  closed: {},
  open: {},
  rest: { opacity: 0 },
  burst: { opacity: 0 },
};
