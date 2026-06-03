import { useEffect } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';
import { useReducedMotionSafe } from './useReducedMotionSafe';

export interface Parallax {
  /** Normalised pointer offset from viewport centre, range [-1, 1]. */
  x: MotionValue<number>;
  y: MotionValue<number>;
}

/**
 * Springy, normalised pointer position for parallax layers. No-ops on touch
 * devices and when the user prefers reduced motion. Map with `useTransform`,
 * e.g. `useTransform(x, [-1, 1], [-18, 18])`.
 */
export function useMouseParallax(stiffness = 55, damping = 16): Parallax {
  const reduce = useReducedMotionSafe();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness, damping });
  const y = useSpring(rawY, { stiffness, damping });

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, rawX, rawY]);

  return { x, y };
}
