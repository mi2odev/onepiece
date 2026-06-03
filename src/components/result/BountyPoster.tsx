import { motion } from 'framer-motion';
import type { Character } from '../../types';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

interface Props {
  character: Character;
  floating?: boolean;
  className?: string;
}

/** The character art is already an in-universe wanted poster, so we just present
 *  it in a premium floating frame (gold border, corner studs, deep shadow,
 *  character-tinted glow) rather than wrapping it in redundant poster chrome. */
export function BountyPoster({ character, floating = false, className = '' }: Props) {
  const reduce = useReducedMotionSafe();

  return (
    <motion.div
      className={`relative ${className}`}
      animate={floating && !reduce ? { y: [0, -10, 0], rotate: [-1, 1.2, -1] } : {}}
      transition={floating && !reduce ? { duration: 6.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
    >
      {/* Character-tinted glow */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-3xl blur-2xl"
        style={{ background: `radial-gradient(ellipse at center, ${character.color}40, transparent 70%)` }}
      />

      <div
        className="relative w-[260px] overflow-hidden rounded-lg sm:w-[300px]"
        style={{
          padding: 6,
          background: 'linear-gradient(160deg,#ffe9a8,#e0b257 45%,#b9821f)',
          boxShadow:
            '0 30px 60px -20px rgba(0,0,0,0.75), 0 0 0 1px rgba(120,72,24,0.5), inset 0 0 0 1px rgba(255,255,255,0.35)',
        }}
      >
        <div className="overflow-hidden rounded-md bg-amber-950/20">
          <img
            src={character.image}
            alt={character.name}
            className="block h-auto w-full object-cover"
            draggable={false}
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
        </div>

        {/* Corner studs */}
        {['left-1.5 top-1.5', 'right-1.5 top-1.5', 'left-1.5 bottom-1.5', 'right-1.5 bottom-1.5'].map(
          (pos) => (
            <span
              key={pos}
              aria-hidden
              className={`absolute ${pos} h-2 w-2 rounded-full bg-amber-900/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]`}
            />
          ),
        )}
      </div>
    </motion.div>
  );
}
