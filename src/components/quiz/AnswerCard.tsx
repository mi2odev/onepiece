import { useState, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { easeOutSoft } from '../../lib/motion';

const ICONS = ['⚔️', '🧭', '🗺️', '💰', '🏴‍☠️', '⚓'];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Deterministic gold embers that drift up off the chosen card, like sparks
// rising from struck treasure. Spread across the card width, varied heights.
const EMBERS = Array.from({ length: 7 }, (_, i) => ({
  x: (i / 6 - 0.5) * 220,
  rise: 46 + ((i * 13) % 28),
  delay: (i % 4) * 0.05,
  size: i % 2 ? 3 : 5,
}));

interface Props {
  index: number;
  text: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

export function AnswerCard({ index, text, selected, disabled, onSelect }: Props) {
  const reduce = useReducedMotionSafe();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hovered: false });
  const [pressed, setPressed] = useState(false);

  // When another card was chosen, this one fades back so the eye stays on the pick.
  const dimmed = disabled && !selected;

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * 8, ry: (px - 0.5) * 10, hovered: true });
  };
  const reset = () => {
    setTilt({ rx: 0, ry: 0, hovered: false });
    setPressed(false);
  };

  const scale = pressed ? 0.97 : tilt.hovered ? 1.02 : 1;

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      aria-label={`${LETTERS[index]}: ${text}`}
      style={{ transformPerspective: 800 }}
      animate={
        reduce
          ? { scale: pressed ? 0.98 : 1, opacity: dimmed ? 0.4 : 1 }
          : {
              rotateX: dimmed ? 0 : tilt.rx,
              rotateY: dimmed ? 0 : tilt.ry,
              scale: dimmed ? 0.96 : selected ? 1.03 : scale,
              opacity: dimmed ? 0.4 : 1,
              filter: dimmed ? 'saturate(0.55)' : 'saturate(1)',
            }
      }
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`glass group relative overflow-hidden rounded-2xl border p-4 text-start transition-shadow duration-300 disabled:cursor-default sm:p-5 ${
        selected
          ? 'border-gold/80 shadow-[0_0_0_1px_rgb(var(--gold)/0.5),0_14px_40px_-8px_rgb(var(--sunset)/0.55)]'
          : 'border-white/[0.12] hover:border-gold/40 hover:shadow-[0_12px_34px_-8px_rgba(0,0,0,0.6)]'
      }`}
    >
      {/* Hover sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(130deg, rgb(var(--gold) / 0.12), transparent 42%, rgb(var(--sunset) / 0.10))',
        }}
      />

      {/* Treasure-gold sheen that sweeps across the chosen card */}
      {selected && !reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/2 rounded-2xl"
          style={{
            background:
              'linear-gradient(105deg, transparent, rgb(var(--gold) / 0.45), transparent)',
          }}
          initial={{ x: '-130%' }}
          animate={{ x: '260%' }}
          transition={{ duration: 0.7, ease: easeOutSoft }}
        />
      )}

      <div className="relative z-10 flex items-start gap-3">
        <motion.span
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-sunset text-sm font-bold text-ocean-deep shadow-md"
          animate={selected && !reduce ? { scale: [1, 1.28, 1] } : { scale: 1 }}
          transition={{ duration: 0.45, ease: easeOutSoft }}
        >
          {selected ? '✓' : LETTERS[index]}
        </motion.span>
        <p className="pt-1 text-sm font-medium leading-relaxed text-cloud sm:text-base">{text}</p>
        <span
          aria-hidden
          className="ml-auto self-center text-xl opacity-40 transition-opacity duration-300 group-hover:opacity-90"
        >
          {ICONS[index % ICONS.length]}
        </span>
      </div>

      {/* Selection flourish: one clean Haki ring, then gold treasure embers rise. */}
      {selected && !reduce && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ border: '2px solid rgb(var(--haki) / 0.85)' }}
            initial={{ scale: 0.3, opacity: 0.9 }}
            animate={{ scale: 7, opacity: 0 }}
            transition={{ duration: 0.7, ease: easeOutSoft }}
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{ background: 'radial-gradient(circle at 50% 60%, rgb(var(--gold) / 0.28), transparent 70%)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.55, ease: easeOutSoft }}
          />
          {EMBERS.map((e, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute bottom-3 left-1/2 rounded-full bg-gold"
              style={{ height: e.size, width: e.size, boxShadow: '0 0 8px rgb(var(--gold) / 0.95)' }}
              initial={{ x: e.x, y: 0, opacity: 0, scale: 0.6 }}
              animate={{ y: -e.rise, opacity: [0, 1, 0], scale: 1 }}
              transition={{ duration: 0.7, delay: e.delay, ease: easeOutSoft }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
}
