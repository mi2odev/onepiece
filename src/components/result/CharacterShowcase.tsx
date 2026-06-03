import { motion } from 'framer-motion';
import type { CharacterKey, CharacterMap } from '../../types';
import type { RankedCharacter } from '../../lib/scoring';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

interface Props {
  ranking: RankedCharacter[];
  characters: CharacterMap;
  onSelect: (key: CharacterKey) => void;
}

/** All ten Straw Hats as a premium bounty collection. Hover lifts + glows and
 *  previews the title; click opens the full character card. */
export function CharacterShowcase({ ranking, characters, onSelect }: Props) {
  const reduce = useReducedMotionSafe();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {ranking.map((r) => {
        const c = characters[r.key];
        return (
          <motion.button
            key={r.key}
            type="button"
            onClick={() => onSelect(r.key)}
            whileHover={reduce ? undefined : { y: -6, scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="glass group relative overflow-hidden rounded-2xl p-3 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
            style={{ boxShadow: `0 0 0 1px ${c.color}22` }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: `radial-gradient(120% 80% at 50% 0%, ${c.color}33, transparent 60%)` }}
            />
            <div className="relative mx-auto h-20 w-16 overflow-hidden rounded-md border border-white/15">
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  const t = e.currentTarget;
                  t.style.display = 'none';
                  const sib = t.nextElementSibling as HTMLElement | null;
                  if (sib) sib.style.display = 'flex';
                }}
              />
              <div
                className="hidden h-full w-full items-center justify-center text-3xl"
                style={{ backgroundColor: c.color }}
              >
                {c.emoji}
              </div>
            </div>
            <div className="relative mt-2 truncate text-xs font-semibold text-cloud">{c.name}</div>
            <div className="relative truncate text-[0.62rem] text-cloud/50">{c.title}</div>
            <div className="relative mt-1 text-[0.72rem] font-bold" style={{ color: c.color }}>
              {r.percentage}%
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
