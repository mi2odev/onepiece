import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { CharacterKey, CharacterMap } from '../../types';
import type { RankedCharacter } from '../../lib/scoring';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useCountUp } from '../../hooks/useCountUp';
import { easeOutSoft } from '../../lib/motion';

interface Props {
  ranking: RankedCharacter[];
  characters: CharacterMap;
  onSelect: (key: CharacterKey) => void;
}

const MEDALS: Record<number, { ring: string; glow: string; icon: string }> = {
  1: { ring: '#ffd54a', glow: 'rgba(255,213,74,0.55)', icon: '👑' },
  2: { ring: '#cfd6e6', glow: 'rgba(207,214,230,0.45)', icon: '🥈' },
  3: { ring: '#e0975a', glow: 'rgba(224,151,90,0.45)', icon: '🥉' },
};

function Percent({ value, start, color }: { value: number; start: boolean; color: string }) {
  const v = useCountUp(value, 1100, start);
  return (
    <span className="font-display font-black tabular-nums" style={{ color }}>
      {v}%
    </span>
  );
}

/** Top-3 podium (medals, tiered sizes, count-up) + the rest of the crew grid. */
export function CrewBountyBoard({ ranking, characters, onSelect }: Props) {
  const reduce = useReducedMotionSafe();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  const start = reduce || inView;

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div ref={ref}>
      {/* Podium — mobile: #1 on top, #2 & #3 sharing a row; desktop: elevated centre */}
      <div className="grid grid-cols-2 items-end justify-items-center gap-3 sm:flex sm:flex-row sm:justify-center sm:gap-5">
        {top3.map((r) => {
          const c = characters[r.key];
          const m = MEDALS[r.rank];
          const isFirst = r.rank === 1;
          const order = r.rank === 1 ? 'order-1 sm:order-2' : r.rank === 2 ? 'order-2 sm:order-1' : 'order-3 sm:order-3';
          const sizing = isFirst ? 'col-span-2 w-44 sm:w-48' : 'w-full sm:w-36';
          return (
            <motion.button
              key={r.key}
              type="button"
              onClick={() => onSelect(r.key)}
              className={`group relative ${order} ${sizing}`}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              animate={start ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.6, ease: easeOutSoft, delay: r.rank * 0.12 }}
              whileHover={reduce ? undefined : { y: -8, scale: 1.03 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              {/* Medal */}
              <div
                className="absolute -top-3 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full text-lg"
                style={{
                  background: 'radial-gradient(circle at 35% 30%, #fff8, transparent 60%), #1a2647',
                  border: `2px solid ${m.ring}`,
                  boxShadow: `0 0 16px ${m.glow}`,
                }}
              >
                {m.icon}
              </div>

              <div
                className="relative overflow-hidden rounded-2xl p-3 pt-6"
                style={{
                  background: 'linear-gradient(160deg, rgb(255 255 255 / 0.12), rgb(255 255 255 / 0.03))',
                  border: `1px solid ${m.ring}66`,
                  boxShadow: `0 18px 40px -18px ${m.glow}, inset 0 0 0 1px rgb(255 255 255 / 0.06)`,
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: `radial-gradient(120% 70% at 50% 0%, ${c.color}33, transparent 60%)` }}
                />
                <div
                  className="relative mx-auto overflow-hidden rounded-lg border-2"
                  style={{ borderColor: `${m.ring}aa`, aspectRatio: '4 / 5' }}
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    draggable={false}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const t = e.currentTarget;
                      t.style.display = 'none';
                      const sib = t.nextElementSibling as HTMLElement | null;
                      if (sib) sib.style.display = 'flex';
                    }}
                  />
                  <div className="hidden h-full w-full items-center justify-center text-4xl" style={{ backgroundColor: c.color }}>
                    {c.emoji}
                  </div>
                </div>
                <div className={`relative mt-2 truncate text-center font-bold text-cloud ${isFirst ? 'text-sm' : 'text-xs'}`}>
                  {c.name}
                </div>
                <div className={`relative truncate text-center ${isFirst ? 'text-[0.68rem]' : 'text-[0.6rem]'} text-cloud/50`}>
                  {c.title}
                </div>
                <div className={`relative mt-1 text-center ${isFirst ? 'text-xl' : 'text-base'}`}>
                  <Percent value={r.percentage} start={start} color={c.color} />
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Rest of the crew */}
      <div className="mt-6 grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-7">
        {rest.map((r, i) => {
          const c = characters[r.key];
          return (
            <motion.button
              key={r.key}
              type="button"
              onClick={() => onSelect(r.key)}
              className="glass group relative overflow-hidden rounded-xl p-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
              style={{ boxShadow: `0 0 0 1px ${c.color}22` }}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={start ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.45, ease: easeOutSoft, delay: 0.5 + i * 0.05 }}
              whileHover={reduce ? undefined : { y: -4, scale: 1.04 }}
              whileTap={reduce ? undefined : { scale: 0.97 }}
            >
              <span className="absolute left-1 top-1 z-10 rounded-md bg-black/45 px-1.5 text-[0.6rem] font-bold text-gold/90">
                #{r.rank}
              </span>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(120% 80% at 50% 0%, ${c.color}33, transparent 60%)` }}
              />
              <div className="relative mx-auto overflow-hidden rounded-md border border-white/15" style={{ aspectRatio: '4 / 5' }}>
                <img
                  src={c.image}
                  alt={c.name}
                  draggable={false}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const t = e.currentTarget;
                    t.style.display = 'none';
                    const sib = t.nextElementSibling as HTMLElement | null;
                    if (sib) sib.style.display = 'flex';
                  }}
                />
                <div className="hidden h-full w-full items-center justify-center text-2xl" style={{ backgroundColor: c.color }}>
                  {c.emoji}
                </div>
              </div>
              <div className="relative mt-1.5 truncate text-[0.68rem] font-semibold text-cloud">{c.name}</div>
              <div className="relative text-[0.66rem] font-bold" style={{ color: c.color }}>
                <Percent value={r.percentage} start={start} color={c.color} />
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
