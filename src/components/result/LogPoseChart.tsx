import { motion } from 'framer-motion';
import type { TraitValue } from '../../lib/traits';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { easeOutSoft } from '../../lib/motion';

interface Props {
  traits: TraitValue[]; // 8 dimensions, value 0–100
  color: string;
  start: boolean;
}

const C = 180; // centre
const INNER = 44;
const OUTER = 118;
const LABEL_R = 150;
const VIEW = 360;

const polar = (angRad: number, r: number) => ({
  x: C + r * Math.cos(angRad),
  y: C + r * Math.sin(angRad),
});

/**
 * The personality "Log Pose" — a Grand Line chart. Each trait is an island
 * plotted at a distance from the compass core scaled by its strength, linked by
 * the dotted Grand Line route. A rotating compass bezel frames it; the core
 * needle locks onto your strongest trait. Themed, not a generic radar.
 */
export function LogPoseChart({ traits, color, start }: Props) {
  const reduce = useReducedMotionSafe();
  const shown = reduce || start;

  const nodes = traits.map((t, i) => {
    const ang = (-90 + i * 45) * (Math.PI / 180);
    const r = INNER + (t.value / 100) * (OUTER - INNER);
    const p = polar(ang, r);
    const axis = polar(ang, OUTER);
    const labelPos = polar(ang, LABEL_R);
    const cos = Math.cos(ang);
    const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle';
    return { ...t, ang, ...p, axis, labelPos, anchor };
  });

  const polyPoints = nodes.map((n) => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' ');

  // Strongest trait → where the core needle points.
  const top = nodes.reduce((a, b) => (b.value > a.value ? b : a), nodes[0]);
  const needle = polar(top.ang, INNER + 26);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[360px]">
      {/* Rotating compass bezel (CSS spin → respects reduced motion globally) */}
      <svg
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        className="animate-spin-slow absolute inset-0 h-full w-full"
        aria-hidden
      >
        <circle cx={C} cy={C} r={OUTER + 22} fill="none" stroke="rgb(255 213 74 / 0.22)" strokeWidth="1.5" />
        <circle cx={C} cy={C} r={OUTER + 14} fill="none" stroke="rgb(255 213 74 / 0.14)" strokeWidth="6" strokeDasharray="2 7" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i * 15) * (Math.PI / 180);
          const o = polar(a, OUTER + 22);
          const inn = polar(a, OUTER + (i % 6 === 0 ? 11 : 16));
          return <line key={i} x1={o.x} y1={o.y} x2={inn.x} y2={inn.y} stroke="rgb(255 213 74 / 0.4)" strokeWidth={i % 6 === 0 ? 2 : 1} />;
        })}
        {[['N', -90], ['E', 0], ['S', 90], ['W', 180]].map(([d, deg]) => {
          const p = polar((deg as number) * (Math.PI / 180), OUTER + 2);
          return (
            <text key={d as string} x={p.x} y={p.y} dy="4" textAnchor="middle" fontSize="13" fontWeight="800" fill="rgb(255 213 74 / 0.65)" fontFamily="Cinzel, serif">
              {d}
            </text>
          );
        })}
      </svg>

      {/* Data layer (static — does not spin) */}
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="absolute inset-0 h-full w-full overflow-visible">
        {/* concentric guide rings */}
        {[0.33, 0.66, 1].map((f) => (
          <circle key={f} cx={C} cy={C} r={INNER + f * (OUTER - INNER)} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth="1" />
        ))}
        {/* spokes */}
        {nodes.map((n, i) => (
          <line key={i} x1={C} y1={C} x2={n.axis.x} y2={n.axis.y} stroke="rgb(255 255 255 / 0.08)" strokeWidth="1" />
        ))}

        {/* filled territory */}
        <motion.polygon
          points={polyPoints}
          fill={`${color}26`}
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
          initial={reduce ? false : { opacity: 0 }}
          animate={shown ? { opacity: 1 } : undefined}
          transition={{ duration: 0.6, ease: easeOutSoft, delay: 0.25 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
        {/* Grand Line route draws itself on */}
        <motion.polygon
          points={polyPoints}
          fill="none"
          stroke="rgb(255 213 74 / 0.85)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          animate={shown ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 1.1, ease: easeOutSoft, delay: 0.3 }}
        />

        {/* island nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            <motion.circle
              cx={n.x}
              cy={n.y}
              fill={color}
              stroke="#fff"
              strokeWidth="1.5"
              initial={reduce ? false : { r: 0, opacity: 0 }}
              animate={shown ? { r: 4.5, opacity: 1 } : undefined}
              transition={{ duration: 0.4, ease: easeOutSoft, delay: 0.5 + i * 0.07 }}
              style={{ filter: `drop-shadow(0 0 5px ${color})` }}
            />
          </g>
        ))}

        {/* core Log Pose */}
        <circle cx={C} cy={C} r="20" fill="rgb(8 18 44 / 0.85)" stroke="rgb(255 213 74 / 0.5)" strokeWidth="1.5" />
        <circle cx={C} cy={C} r="20" fill="url(#lp-dome)" />
        <defs>
          <radialGradient id="lp-dome" cx="40%" cy="32%">
            <stop offset="0%" stopColor="rgb(255 255 255 / 0.5)" />
            <stop offset="55%" stopColor="rgb(255 255 255 / 0.05)" />
            <stop offset="100%" stopColor="rgb(255 255 255 / 0)" />
          </radialGradient>
        </defs>
        {/* needle locks onto strongest trait */}
        <motion.line
          x1={C}
          y1={C}
          x2={needle.x}
          y2={needle.y}
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          initial={reduce ? false : { opacity: 0 }}
          animate={shown ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: 1.0 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
        <circle cx={C} cy={C} r="3.5" fill="#ffd54a" />

        {/* labels + values */}
        {nodes.map((n, i) => (
          <motion.g
            key={i}
            initial={reduce ? false : { opacity: 0 }}
            animate={shown ? { opacity: 1 } : undefined}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.07 }}
          >
            <text x={n.labelPos.x} y={n.labelPos.y} textAnchor={n.anchor} dy="-2" fontSize="11" fontWeight="700" fill="rgb(245 245 245 / 0.9)">
              {n.label}
            </text>
            <text x={n.labelPos.x} y={n.labelPos.y} textAnchor={n.anchor} dy="12" fontSize="11" fontWeight="800" fill={color}>
              {n.value}
            </text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
