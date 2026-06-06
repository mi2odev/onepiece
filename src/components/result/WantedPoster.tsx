import { useState, type PointerEvent } from 'react';
import { motion } from 'framer-motion';
import type { Character } from '../../types';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { easeOutSoft } from '../../lib/motion';

interface Props {
  character: Character;
  /** Flips true once the cinematic curtain clears — triggers the drop. */
  reveal: boolean;
  /** Fired the moment the poster lands (drive camera-shake + impact SFX). */
  onImpact?: () => void;
}

/**
 * The character art is already an in-universe wanted poster, so we simply
 * present it in a premium gold frame that falls from the sky, lands with an
 * impact, then breathes with a slow 3D tilt. A rotating character-tinted aura
 * glows behind it and a gold shimmer sweeps across on reveal.
 */
export function WantedPoster({ character, reveal, onImpact }: Props) {
  const reduce = useReducedMotionSafe();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, active: false });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - py) * 12, ry: (px - 0.5) * 14, active: true });
  };
  const reset = () => setTilt({ rx: 0, ry: 0, active: false });

  const shown = reduce || reveal;

  return (
    <motion.div
      className="relative"
      initial={reduce ? false : { y: '-118vh', opacity: 0, rotate: -5 }}
      animate={shown ? { y: 0, opacity: 1, rotate: 0 } : undefined}
      transition={{ duration: 0.62, ease: [0.55, 0.06, 0.68, 0.19] }} // accelerating fall
      onAnimationComplete={() => reveal && onImpact?.()}
      style={{ perspective: 1100 }}
    >
      {/* Soft base glow — gently breathing, tied to the poster shape */}
      <motion.div
        aria-hidden
        className="absolute -inset-7 -z-20 rounded-[28px] blur-3xl"
        style={{ background: `radial-gradient(60% 55% at 50% 45%, ${character.color}66, transparent 72%)` }}
        animate={reduce ? {} : { opacity: [0.5, 0.85, 0.5], scale: [1, 1.05, 1] }}
        transition={reduce ? undefined : { duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Rotating legendary aura halo */}
      <motion.div
        aria-hidden
        className="absolute -inset-3 -z-10 rounded-[20px] opacity-60 blur-xl"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${character.color} 70deg, #ffd54a 140deg, transparent 200deg, ${character.color} 290deg, transparent 360deg)`,
        }}
        animate={reduce ? {} : { rotate: 360 }}
        transition={reduce ? undefined : { duration: 14, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        animate={
          reduce
            ? undefined
            : tilt.active
              ? { rotateX: tilt.rx, rotateY: tilt.ry, scale: 1.015 }
              : { rotateX: 0, rotateY: [0, -1.4, 0], scale: 1 }
        }
        transition={
          tilt.active
            ? { type: 'spring', stiffness: 220, damping: 18 }
            : { duration: 7, repeat: Infinity, ease: 'easeInOut' }
        }
        style={{ transformStyle: 'preserve-3d' }}
        className="relative w-[270px] rounded-[14px] sm:w-[310px]"
      >
        {/* Metallic gold frame */}
        <div
          className="relative overflow-hidden rounded-[14px]"
          style={{
            padding: 9,
            background:
              'linear-gradient(150deg,#fff0b8 0%,#e7bd5e 38%,#bb8420 60%,#8a6016 100%)',
            boxShadow:
              '0 38px 70px -22px rgba(0,0,0,0.8), 0 0 0 1px rgba(90,55,15,0.6), inset 0 0 0 1px rgba(255,255,255,0.45)',
          }}
        >
          {/* The wanted-poster art */}
          <div className="relative overflow-hidden rounded-[7px] bg-[#0a1430]">
            <img
              src={character.image}
              alt={character.name}
              draggable={false}
              className="block h-auto w-full object-cover"
              style={{ filter: 'saturate(1.04) contrast(1.02)' }}
              onError={(e) => {
                const t = e.currentTarget;
                t.style.display = 'none';
                const sib = t.nextElementSibling as HTMLElement | null;
                if (sib) sib.style.display = 'flex';
              }}
            />
            <div
              className="hidden aspect-[3/4] w-full items-center justify-center text-7xl"
              style={{ backgroundColor: character.color }}
            >
              {character.emoji}
            </div>

            {/* One-time gold shimmer sweep on reveal */}
            {shown && !reduce && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 z-10 w-1/3"
                style={{ background: 'linear-gradient(105deg,transparent,rgba(255,255,255,0.55),transparent)' }}
                initial={{ x: '-160%' }}
                animate={{ x: '420%' }}
                transition={{ duration: 0.9, ease: easeOutSoft, delay: 0.5 }}
              />
            )}
          </div>

          {/* Corner studs */}
          {['left-2 top-2', 'right-2 top-2', 'left-2 bottom-2', 'right-2 bottom-2'].map((pos) => (
            <span
              key={pos}
              aria-hidden
              className={`absolute ${pos} z-20 h-2.5 w-2.5 rounded-full bg-amber-900/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
