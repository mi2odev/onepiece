import { useEffect, useState } from 'react';

const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

/** Animate a number from 0 → target. Honours reduced motion (snaps instantly).
 *  Pass `start=false` to defer until the reveal beat is ready. */
export function useCountUp(target: number, duration = 1400, start = true): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const step = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      setValue(Math.round(target * easeOutCubic(p)));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}
