/** Two large blurred banks drifting horizontally across the mid-sea. */
export function FogLayer() {
  return (
    <div className="absolute inset-x-0 bottom-[20%] h-[40%] overflow-hidden">
      <div
        className="animate-fog absolute -inset-x-1/4 top-0 h-[60%] opacity-50 blur-2xl"
        style={{
          background:
            'radial-gradient(60% 100% at 30% 50%, rgb(220 235 255 / 0.14), transparent 70%), radial-gradient(50% 100% at 70% 60%, rgb(200 225 255 / 0.10), transparent 70%)',
        }}
      />
      <div
        className="animate-fog absolute -inset-x-1/4 bottom-0 h-[55%] opacity-40 blur-3xl"
        style={{
          animationDirection: 'alternate-reverse',
          animationDuration: '46s',
          background:
            'radial-gradient(55% 100% at 60% 40%, rgb(180 210 245 / 0.12), transparent 72%)',
        }}
      />
    </div>
  );
}
