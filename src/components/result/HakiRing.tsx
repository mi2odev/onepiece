import { useCountUp } from '../../hooks/useCountUp';

const SIZE = 200;
const STROKE = 13;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

interface Props {
  value: number; // 0–100
  color: string; // character accent
  start: boolean;
  matchLabel: string;
}

/** Conqueror's-Haki energy ring that fills 0 → value, with a glowing dot riding
 *  the leading edge of the arc and the live count in the centre. */
export function HakiRing({ value, color, start, matchLabel }: Props) {
  const count = useCountUp(value, 1500, start);
  const f = Math.max(0, Math.min(1, count / 100));
  const offset = C * (1 - f);

  // Leading-edge dot (screen coords: top = -90°, sweeping clockwise).
  const angle = (-90 + f * 360) * (Math.PI / 180);
  const tipX = SIZE / 2 + R * Math.cos(angle);
  const tipY = SIZE / 2 + R * Math.sin(angle);

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE }}>
      {/* Pulsing aura */}
      <div
        className="animate-glow-pulse absolute inset-3 rounded-full blur-2xl"
        style={{ background: `radial-gradient(circle, ${color}44, transparent 70%)` }}
      />

      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <defs>
          <linearGradient id="haki-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="55%" stopColor={color} />
            <stop offset="100%" stopColor="#9d6bff" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="rgba(255,255,255,0.09)"
          strokeWidth={STROKE}
        />
        {/* Progress */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="url(#haki-grad)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      </svg>

      {/* Leading-edge glow dot */}
      {f > 0.01 && (
        <span
          className="absolute h-3.5 w-3.5 rounded-full"
          style={{
            left: tipX,
            top: tipY,
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            boxShadow: `0 0 12px 3px ${color}, 0 0 4px 1px #fff`,
          }}
        />
      )}

      {/* Centre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-black" style={{ color, textShadow: `0 0 22px ${color}88` }}>
          {count}%
        </span>
        <span className="text-[0.65rem] uppercase tracking-[0.25em] text-cloud/70">{matchLabel}</span>
      </div>
    </div>
  );
}
