import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import type { TraitValue } from '../../lib/traits';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

interface Props {
  traits: TraitValue[];
  color: string;
}

/** Animated personality radar across the 8 trait dimensions. */
export function TraitRadar({ traits, color }: Props) {
  const reduce = useReducedMotionSafe();
  const data = traits.map((t) => ({ trait: t.label, value: t.value }));

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="rgba(255,255,255,0.15)" />
          <PolarAngleAxis
            dataKey="trait"
            tick={{ fill: 'rgba(245,245,245,0.82)', fontSize: 11 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.35}
            isAnimationActive={!reduce}
            animationDuration={900}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
