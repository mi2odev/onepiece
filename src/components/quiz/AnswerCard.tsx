import { useState, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

const ICONS = ['⚔️', '🧭', '🗺️', '💰', '🏴‍☠️', '⚓'];
const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

// Deterministic Haki spark vectors.
const SPARKS = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return { x: Math.cos(a) * 42, y: Math.sin(a) * 42 };
});

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
      animate={reduce ? { scale: pressed ? 0.98 : 1 } : { rotateX: tilt.rx, rotateY: tilt.ry, scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`glass group relative overflow-hidden rounded-2xl border p-4 text-start transition-shadow duration-300 disabled:cursor-default sm:p-5 ${
        selected
          ? 'border-haki/70 shadow-haki'
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

      <div className="relative z-10 flex items-start gap-3">
        <span
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-md ${
            selected
              ? 'bg-haki text-white'
              : 'bg-gradient-to-br from-gold to-sunset text-ocean-deep'
          }`}
        >
          {LETTERS[index]}
        </span>
        <p className="pt-1 text-sm font-medium leading-relaxed text-cloud sm:text-base">{text}</p>
        <span
          aria-hidden
          className="ml-auto self-center text-xl opacity-40 transition-opacity duration-300 group-hover:opacity-90"
        >
          {ICONS[index % ICONS.length]}
        </span>
      </div>

      {/* Haki selection burst */}
      {selected && !reduce && (
        <>
          <motion.span
            aria-hidden
            className="pointer-events-none absolute left-7 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgb(var(--haki) / 0.55), transparent 70%)' }}
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
          />
          {SPARKS.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute left-7 top-1/2 h-1 w-1 rounded-full bg-haki"
              style={{ boxShadow: '0 0 6px rgb(var(--haki) / 0.9)' }}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{ x: s.x, y: s.y, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}
        </>
      )}
    </motion.button>
  );
}
