import { useReducedMotion } from 'framer-motion';

/**
 * Framer's `useReducedMotion` can return `null` before hydration; this coerces
 * to a stable boolean so callers can branch simply.
 */
export function useReducedMotionSafe(): boolean {
  return useReducedMotion() ?? false;
}
