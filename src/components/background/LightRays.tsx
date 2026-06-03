/** Soft god-rays descending from the top of the sky. One element, slow sweep. */
export function LightRays() {
  return (
    <div className="absolute inset-x-0 top-0 h-[85%] overflow-hidden">
      <div
        className="animate-ray absolute left-1/2 -top-1/3 h-[150%] w-[85%] -translate-x-1/2 opacity-30 mix-blend-screen"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgb(var(--sun-core) / 0.12) 10deg, transparent 24deg, rgb(var(--sun-core) / 0.08) 38deg, transparent 52deg, rgb(var(--sun-core) / 0.10) 66deg, transparent 80deg)',
          filter: 'blur(2px)',
        }}
      />
    </div>
  );
}
