import { motion } from 'framer-motion';
import type { Character } from '../../types';
import type { UIStrings } from '../../data/translations';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useCountUp } from '../../hooks/useCountUp';
import { easeOutSoft } from '../../lib/motion';

interface Props {
  character: Character;
  percentage: number;
  quote: string;
  ui: UIStrings;
  /** Drives the count-up / meter / staggered reveals (poster has landed). */
  start: boolean;
}

// Cut top-right corner — gives the panel an "official document" silhouette.
const CLIP = 'polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 0 100%)';

/**
 * Redesigned identity panel — a pirate dossier plaque. Asymmetric, left-rail
 * accent, the match shown as a big numeral + segmented compatibility meter
 * (no ring), a bordered captain's quote, and angular trait chips.
 */
export function IdentityCard({ character, percentage, quote, ui, start }: Props) {
  const reduce = useReducedMotionSafe();
  const c = character.color;
  const v = useCountUp(percentage, 1500, start);
  const shown = reduce || start;

  return (
    <div className="relative w-full max-w-sm" style={{ filter: `drop-shadow(0 26px 50px ${c}55)` }}>
      <div
        dir="ltr"
        className="relative overflow-hidden"
        style={{
          clipPath: CLIP,
          background:
            'linear-gradient(160deg, rgb(16 26 54 / 0.92), rgb(7 16 40 / 0.96))',
        }}
      >
        {/* character-tint wash + emoji watermark */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(120% 80% at 100% 0%, ${c}22, transparent 55%)` }} />
        <span aria-hidden className="pointer-events-none absolute -bottom-8 -right-3 select-none text-[10rem] leading-none opacity-[0.07]">
          {character.emoji}
        </span>

        {/* left accent rail + stud */}
        <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: `linear-gradient(180deg, ${c}, #ffd54a)` }} />
        <span className="absolute left-[3px] top-6 h-3 w-3 -translate-x-1/2 rotate-45" style={{ background: c, boxShadow: `0 0 12px ${c}` }} />

        <div className="relative py-6 pl-7 pr-6 sm:py-7">
          {/* header */}
          <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.32em] text-gold/75">
            <span aria-hidden>☠</span>
            {ui.yourCharacterIs}
          </div>

          {/* name + title */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, x: -16 }}
            animate={shown ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: easeOutSoft }}
            className="mt-1 font-display text-4xl font-black uppercase leading-none tracking-wide sm:text-5xl"
            style={{ color: c, textShadow: `0 2px 18px ${c}66` }}
          >
            {character.name}
          </motion.h1>
          <p className="mt-1.5 text-sm font-medium text-cloud/65">{character.title}</p>

          {/* match: big numeral + segmented compatibility meter */}
          <div className="mt-6 flex items-end gap-4">
            <div className="leading-none">
              <div className="font-display text-5xl font-black tabular-nums" style={{ color: c, textShadow: `0 0 22px ${c}55` }}>
                {v}
                <span className="text-2xl">%</span>
              </div>
              <div className="mt-1 text-[0.58rem] font-bold uppercase tracking-[0.3em] text-cloud/55">{ui.match}</div>
            </div>

            <div className="flex-1 pb-1.5">
              <div
                className="relative h-3.5 w-full overflow-hidden rounded-full"
                style={{ background: 'rgb(255 255 255 / 0.08)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}
              >
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${c}, #ffd54a)`, boxShadow: `0 0 14px ${c}` }}
                  initial={reduce ? false : { width: 0 }}
                  animate={shown ? { width: `${percentage}%` } : undefined}
                  transition={{ duration: 1.3, ease: easeOutSoft, delay: 0.2 }}
                />
                {/* segment notches */}
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 15px, rgba(7,16,40,0.85) 15px 17px)' }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[0.55rem] font-semibold uppercase tracking-widest text-cloud/40">
                <span aria-hidden>0</span>
                <span aria-hidden>100</span>
              </div>
            </div>
          </div>

          {/* captain's quote */}
          <div className="relative mt-6 pl-4">
            <span aria-hidden className="absolute -left-1 -top-3 font-display text-4xl leading-none" style={{ color: `${c}88` }}>
              “
            </span>
            <div className="absolute inset-y-1 left-0 w-0.5 rounded-full" style={{ background: `${c}99` }} />
            <p className="text-sm italic text-cloud/85">{quote}</p>
          </div>

          {/* angular trait chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            {character.traits.map((t, i) => (
              <motion.span
                key={t}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={shown ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.35, ease: easeOutSoft, delay: 0.55 + i * 0.1 }}
                className="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[0.72rem] font-semibold"
                style={{ borderColor: `${c}55`, color: c, background: `${c}14` }}
              >
                <span aria-hidden className="h-1.5 w-1.5 rotate-45" style={{ background: c }} />
                {t}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
