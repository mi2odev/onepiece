import { useCallback, useRef } from 'react';
import gsap from 'gsap';

/**
 * Cinematic "camera shake" for a poster/impact beat, powered by GSAP.
 *
 * Attach `ref` to a WRAPPER that Framer Motion is NOT animating (so the two
 * engines never fight over the same transform). Call `shake()` on impact.
 * Honours reduced-motion (no-op). Translate/rotate only — compositor-friendly.
 */
export function useCameraShake<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  const shake = useCallback((intensity = 12) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.killTweensOf(el);
    const i = intensity;
    gsap.fromTo(
      el,
      { x: 0, y: 0, rotate: 0 },
      {
        keyframes: [
          { x: -i, y: i * 0.5, rotate: -0.8, duration: 0.05 },
          { x: i * 0.85, y: -i * 0.6, rotate: 0.7, duration: 0.06 },
          { x: -i * 0.6, y: i * 0.4, rotate: -0.5, duration: 0.06 },
          { x: i * 0.4, y: -i * 0.25, rotate: 0.3, duration: 0.06 },
          { x: 0, y: 0, rotate: 0, duration: 0.12 },
        ],
        ease: 'power2.out',
      },
    );
  }, []);

  return { ref, shake };
}
