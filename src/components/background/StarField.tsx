import { useMemo } from 'react';

/** Twinkling stars confined to the upper sky. Cheap CSS opacity loops. */
export function StarField({ count = 64 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 52,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        dur: 3 + Math.random() * 4,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="animate-twinkle absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
            boxShadow: '0 0 6px rgb(255 255 255 / 0.85)',
          }}
        />
      ))}
    </div>
  );
}
