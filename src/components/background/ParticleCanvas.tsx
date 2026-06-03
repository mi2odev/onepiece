import { useRef } from 'react';
import { useParticles } from '../../hooks/useParticles';

/** The single JS-animated layer: rising bubbles + drifting treasure dust. */
export function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useParticles(ref, { maxCount: 120 });
  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
