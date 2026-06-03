import type { ReactNode } from 'react';

/** Gold filigree for a corner (rotated per corner via the parent). */
function Corner({ className }: { className: string }) {
  return (
    <svg
      className={`pointer-events-none absolute h-8 w-8 text-amber-700/70 ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 14 Q2 2 14 2 M2 8 Q2 2 8 2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="6" cy="6" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Ancient pirate parchment: aged paper, scorched edges, gold corners, a soft
 *  tilt and depth shadow. Holds the question content (`children`). */
export function ParchmentCard({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-2xl" style={{ transform: 'rotate(-0.6deg)' }}>
      {/* Drop shadow / lift */}
      <div className="absolute inset-x-4 bottom-1 top-3 rounded-[1.6rem] bg-black/50 blur-2xl" aria-hidden />

      <div
        className="relative overflow-hidden rounded-[1.4rem] px-6 py-8 sm:px-10 sm:py-10"
        style={{
          backgroundImage:
            'radial-gradient(120% 130% at 28% 8%, #f7e7c2 0%, #efd9a8 42%, #e3c489 78%, #d2ad6e 100%)',
          boxShadow:
            'inset 0 0 0 2px rgba(120,72,24,0.35), inset 0 0 60px rgba(120,72,24,0.45), 0 24px 50px -18px rgba(0,0,0,0.7)',
        }}
      >
        {/* Scorched / aged edge vignette */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(100% 100% at 0% 0%, rgba(70,40,10,0.32), transparent 22%), radial-gradient(100% 100% at 100% 0%, rgba(70,40,10,0.30), transparent 22%), radial-gradient(100% 100% at 0% 100%, rgba(70,40,10,0.34), transparent 24%), radial-gradient(100% 100% at 100% 100%, rgba(70,40,10,0.30), transparent 22%)',
          }}
          aria-hidden
        />
        {/* Subtle fibre texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-multiply"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgba(120,80,30,0.5) 0 1px, transparent 1px 4px), repeating-linear-gradient(0deg, rgba(120,80,30,0.4) 0 1px, transparent 1px 5px)',
          }}
          aria-hidden
        />

        {/* Gold corners */}
        <Corner className="left-3 top-3" />
        <Corner className="right-3 top-3 rotate-90" />
        <Corner className="bottom-3 right-3 rotate-180" />
        <Corner className="bottom-3 left-3 -rotate-90" />

        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}
