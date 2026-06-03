/** A calm ocean at dusk: deep sky-to-sea gradient, a glowing moon with its
 *  shimmering reflection on the water, a warm horizon bloom and soft drifting
 *  wave glints. Pure CSS — compositor only. (No diagonal streaks.) */
export function OceanLayer() {
  return (
    <div className="absolute inset-0">
      {/* Base sky → sea gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgb(var(--sky-top)) 0%, #12204a 34%, rgb(var(--sky-horizon)) 52%, rgb(var(--ocean-grand)) 66%, rgb(var(--ocean-deep)) 100%)',
        }}
      />

      {/* Aurora-ish wash for depth */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 opacity-50"
        style={{
          background:
            'radial-gradient(60% 80% at 20% 20%, rgba(90,70,170,0.25), transparent 60%), radial-gradient(60% 80% at 85% 10%, rgba(40,120,150,0.22), transparent 60%)',
        }}
      />

      {/* Moon + halo */}
      <div
        className="absolute left-[76%] top-[12%] h-20 w-20 rounded-full sm:h-24 sm:w-24"
        style={{
          background: 'radial-gradient(circle at 38% 34%, #fdf6e3 0%, #efe3bf 52%, #cdbf94 100%)',
          boxShadow:
            '0 0 50px 14px rgba(253,246,227,0.28), 0 0 120px 50px rgba(255,224,150,0.12)',
        }}
      />
      <div
        className="absolute left-[76%] top-[12%] h-20 w-20 rounded-full opacity-70 blur-2xl sm:h-24 sm:w-24"
        style={{ background: 'radial-gradient(circle, rgba(255,240,200,0.55), transparent 70%)' }}
      />

      {/* Warm horizon bloom */}
      <div
        className="absolute left-1/2 top-[54%] h-[42vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 rounded-[50%] opacity-50 blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgb(var(--sunset) / 0.16) 0%, rgb(var(--sunset) / 0.05) 45%, transparent 70%)',
        }}
      />

      {/* Sea surface */}
      <div className="absolute inset-x-0 bottom-0 h-[46%] overflow-hidden">
        {/* Moonlight reflection path */}
        <div
          className="animate-caustic absolute bottom-0 left-[76%] top-0 w-28 -translate-x-1/2 opacity-60 mix-blend-screen"
          style={{
            background:
              'linear-gradient(180deg, rgba(253,246,227,0.4) 0%, rgba(253,246,227,0.12) 45%, transparent 85%)',
            filter: 'blur(7px)',
          }}
        />
        {/* Drifting wave glints (thin, soft, not a repeating pattern) */}
        {[18, 38, 60].map((top, i) => (
          <div
            key={top}
            className="animate-ocean-shimmer absolute inset-x-0 opacity-25 mix-blend-screen"
            style={{
              top: `${top}%`,
              height: 2,
              background:
                'linear-gradient(90deg, transparent, rgb(var(--sea-foam) / 0.5) 40%, rgb(var(--sea-foam) / 0.5) 60%, transparent)',
              filter: 'blur(1.5px)',
              animationDelay: `${i * 2}s`,
              backgroundSize: '180% 100%',
            }}
          />
        ))}
        {/* Foam glow rising from the bottom */}
        <div
          className="animate-caustic absolute inset-0 opacity-40 mix-blend-screen"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 120%, rgb(var(--sea-foam) / 0.16), transparent 60%)',
          }}
        />
      </div>
    </div>
  );
}
