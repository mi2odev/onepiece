import { useMouseParallax } from '../../hooks/useMouseParallax';
import { OceanLayer } from './OceanLayer';
import { StarField } from './StarField';
import { LightRays } from './LightRays';
import { IslandSilhouettes } from './IslandSilhouettes';
import { FogLayer } from './FogLayer';
import { ParticleCanvas } from './ParticleCanvas';

/**
 * The living world. Mounted once at the app root so it persists (and keeps
 * animating) across every phase. Fixed, non-interactive, sits behind content.
 */
export function Background() {
  const { x, y } = useMouseParallax();

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <OceanLayer />
      <StarField />
      <LightRays />
      <IslandSilhouettes px={x} py={y} />
      <FogLayer />
      <ParticleCanvas />

      {/* Cinematic vignette to focus the centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 32%, transparent 52%, rgb(3 8 22 / 0.66) 100%)',
        }}
      />
    </div>
  );
}
