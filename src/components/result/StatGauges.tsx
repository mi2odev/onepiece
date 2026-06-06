import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useCountUp } from '../../hooks/useCountUp';
import { easeOutSoft } from '../../lib/motion';

interface GaugeData {
  value: number; // 0–100
  label: string;
}

interface Props {
  haki: GaugeData;
  devilFruit: GaugeData;
  crew: GaugeData;
  adventure: GaugeData;
  start: boolean;
}

const SIZE = 132;
const R = 52;
const CX = SIZE / 2;
const SWEEP = 270; // degrees of arc (gap at bottom)
const START = -135;

function polar(cx: number, cy: number, r: number, deg: number) {
  const a = (deg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}
function arc(startDeg: number, endDeg: number) {
  const s = polar(CX, CX, R, endDeg);
  const e = polar(CX, CX, R, startDeg);
  const large = endDeg - startDeg <= 180 ? 0 : 1;
  return `M ${s.x.toFixed(1)} ${s.y.toFixed(1)} A ${R} ${R} 0 ${large} 0 ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
}

const TRACK = arc(START, START + SWEEP);

/** Themed One Piece stat instruments — not generic progress bars. */
export function StatGauges({ haki, devilFruit, crew, adventure, start }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
      <RadialGauge data={haki} color="#9d6bff" icon="⚡" delay={0} start={start} />
      <RadialGauge data={devilFruit} color="#ff8a00" icon="🍎" delay={0.1} start={start} />
      <CompassGauge data={crew} color="#7ee7c1" delay={0.2} start={start} />
      <RadialGauge data={adventure} color="#ffd54a" icon="⛵" delay={0.3} start={start} />
    </div>
  );
}

function GaugeShell({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="glass flex flex-col items-center rounded-2xl p-3 sm:p-4">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {children}
      </div>
      <span className="mt-1 text-center text-[0.68rem] font-semibold uppercase leading-tight tracking-wide text-cloud/70">
        {label}
      </span>
    </div>
  );
}

function RadialGauge({ data, color, icon, delay, start }: { data: GaugeData; color: string; icon: string; delay: number; start: boolean }) {
  const reduce = useReducedMotionSafe();
  const v = useCountUp(data.value, 1400, start);
  const shown = reduce || start;

  return (
    <GaugeShell label={data.label}>
      <svg width={SIZE} height={SIZE} className="absolute inset-0">
        <path d={TRACK} fill="none" stroke="rgb(255 255 255 / 0.09)" strokeWidth="9" strokeLinecap="round" />
        <motion.path
          d={TRACK}
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={shown ? { pathLength: data.value / 100 } : undefined}
          transition={{ duration: 1.3, ease: easeOutSoft, delay }}
          style={{ filter: `drop-shadow(0 0 5px ${color}aa)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl" aria-hidden style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
          {icon}
        </span>
        <span className="font-display text-2xl font-black tabular-nums" style={{ color, textShadow: `0 0 16px ${color}66` }}>
          {v}
          <span className="text-sm">%</span>
        </span>
      </div>
    </GaugeShell>
  );
}

/** Crew compatibility as a true compass: a needle swings to the reading. */
function CompassGauge({ data, color, delay, start }: { data: GaugeData; color: string; delay: number; start: boolean }) {
  const reduce = useReducedMotionSafe();
  const v = useCountUp(data.value, 1400, start);
  const shown = reduce || start;
  const angle = START + (data.value / 100) * SWEEP;

  return (
    <GaugeShell label={data.label}>
      {/* dial */}
      <div
        className="absolute inset-2 rounded-full"
        style={{
          background: 'radial-gradient(circle at 38% 30%, rgb(255 255 255 / 0.1), rgb(8 18 44 / 0.6) 70%)',
          border: '1px solid rgb(255 255 255 / 0.12)',
          boxShadow: `inset 0 0 18px ${color}33`,
        }}
      />
      {/* tick ring */}
      <div
        className="absolute inset-2 rounded-full opacity-60"
        style={{
          background:
            'repeating-conic-gradient(from 0deg, rgb(255 255 255 / 0.35) 0deg 1.5deg, transparent 1.5deg 30deg)',
          WebkitMask: 'radial-gradient(circle, transparent 44px, #000 45px)',
          mask: 'radial-gradient(circle, transparent 44px, #000 45px)',
        }}
      />
      {/* needle */}
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ width: 4, height: R - 6, transformOrigin: '50% 100%', translateX: '-50%', translateY: '-100%' }}
        initial={reduce ? false : { rotate: START }}
        animate={shown ? { rotate: angle } : undefined}
        transition={{ type: 'spring', stiffness: 70, damping: 11, delay }}
      >
        <div className="mx-auto h-1/2 w-full rounded-t-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
        <div className="mx-auto h-1/2 w-full rounded-b-full bg-cloud/30" />
      </motion.div>
      {/* hub + value */}
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: color, boxShadow: `0 0 10px ${color}` }} />
      <div className="absolute inset-x-0 bottom-3 text-center">
        <span className="font-display text-lg font-black tabular-nums" style={{ color, textShadow: `0 0 14px ${color}66` }}>
          {v}%
        </span>
      </div>
    </GaugeShell>
  );
}
