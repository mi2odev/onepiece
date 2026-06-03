import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useSound } from '../../hooks/useSound';
import { easeOutSoft } from '../../lib/motion';

// Coins that fly out of the chest when it opens (deterministic, fan upward).
const BURST = Array.from({ length: 12 }, (_, i) => {
  const ang = -Math.PI / 2 + (i / 11 - 0.5) * Math.PI * 1.5;
  const dist = 66 + (i % 4) * 18;
  return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist };
});

// The treasure mound revealed inside the open chest (cx, cy in the 240×170 stage).
const TREASURE: { x: number; y: number; r: number; t: 'c' | 'ruby' | 'emerald' }[] = [
  // bottom row
  { x: 70, y: 68, r: 11, t: 'c' },
  { x: 92, y: 70, r: 11, t: 'c' },
  { x: 120, y: 71, r: 12, t: 'c' },
  { x: 148, y: 70, r: 11, t: 'c' },
  { x: 170, y: 68, r: 11, t: 'c' },
  // middle row
  { x: 92, y: 58, r: 10, t: 'c' },
  { x: 120, y: 59, r: 11, t: 'ruby' },
  { x: 148, y: 58, r: 10, t: 'c' },
  // top
  { x: 106, y: 49, r: 9, t: 'c' },
  { x: 134, y: 49, r: 9, t: 'emerald' },
  { x: 120, y: 42, r: 8, t: 'c' },
];

const WOOD = 'linear-gradient(180deg,#8a5a2b 0%,#6b3f1d 55%,#4a2a11 100%)';
const WOOD_LID = 'linear-gradient(180deg,#9a663180 0%,#8a5a2b 35%,#5c3518 100%)';
const IRON = 'linear-gradient(180deg,#62626c 0%,#3a3a42 55%,#222228 100%)';
const BRASS = 'linear-gradient(180deg,#ffe08a 0%,#e0a83a 48%,#a9701c 100%)';
const PLANKS = 'repeating-linear-gradient(90deg, transparent 0 28px, rgba(0,0,0,0.22) 28px 30px)';
const COIN = 'radial-gradient(circle at 38% 30%, #fff3c8 0%, #f0c452 46%, #c0892a 100%)';
const GEM_RED = 'radial-gradient(circle at 38% 30%, #ffb3b3 0%, #ef4444 42%, #9b1c1c 100%)';
const GEM_GREEN = 'radial-gradient(circle at 38% 30%, #b6f2cf 0%, #22c07a 45%, #0f7a4a 100%)';

function Rivets({ vertical = true }: { vertical?: boolean }) {
  return (
    <>
      {[0, 1].map((i) => (
        <span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-amber-100/70 shadow-[inset_0_-1px_1px_rgba(0,0,0,0.6)]"
          style={
            vertical
              ? { left: '50%', top: i ? '78%' : '14%', transform: 'translateX(-50%)' }
              : { top: '50%', left: i ? '85%' : '12%', transform: 'translateY(-50%)' }
          }
        />
      ))}
    </>
  );
}

interface Props {
  label: string;
  onBegin: () => void;
}

/** Legendary CTA: a tactile 3D wooden treasure chest whose domed lid lifts open
 *  in real perspective, revealing a mound of gold and spilling coins. */
export function TreasureChestButton({ label, onBegin }: Props) {
  const reduce = useReducedMotionSafe();
  const { play, unlock } = useSound();
  const [opening, setOpening] = useState(false);
  const firedRef = useRef(false);

  const handleClick = () => {
    if (firedRef.current) return;
    firedRef.current = true;
    unlock();
    play('chestOpen');
    if (reduce) {
      onBegin();
      return;
    }
    setOpening(true);
    window.setTimeout(onBegin, 820);
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className="group relative mx-auto flex flex-col items-center focus:outline-none"
      initial={false}
      animate={reduce || opening ? {} : { y: [0, -6, 0] }}
      transition={reduce ? undefined : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={reduce ? undefined : { scale: 1.04 }}
      whileTap={reduce ? undefined : { scale: 0.97 }}
    >
      {/* Glow halo */}
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 -z-10 h-[150%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgb(var(--sunset) / 0.5), rgb(var(--pirate-red) / 0.2) 55%, transparent 75%)',
        }}
      />

      <div className="scale-95 xs:scale-105">
        <div className="relative h-[170px] w-[240px]" style={{ perspective: 720 }}>
          {/* Ground shadow */}
          <span className="absolute bottom-2 left-1/2 h-4 w-44 -translate-x-1/2 rounded-[50%] bg-black/45 blur-md" />

          {/* Treasure glow (revealed on open) */}
          <motion.span
            aria-hidden
            className="absolute inset-x-10 top-9 h-16 rounded-full bg-gold blur-md"
            animate={{ opacity: opening ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* ── BODY ─────────────────────────────────────────── */}
          <div
            className="absolute bottom-3 left-1/2 h-[96px] w-[224px] -translate-x-1/2 overflow-hidden rounded-b-xl rounded-t-sm"
            style={{
              background: WOOD,
              boxShadow:
                'inset 0 3px 0 rgba(255,225,170,0.25), inset 0 -10px 18px rgba(0,0,0,0.5), 0 10px 16px rgba(0,0,0,0.4)',
            }}
          >
            <div className="absolute inset-0 opacity-70" style={{ background: PLANKS }} />
            {/* dark interior at the mouth (seen when open) */}
            <div
              className="absolute inset-x-3 top-0 h-9 rounded-b-md"
              style={{ background: 'linear-gradient(180deg,#170c04,#3a2410)' }}
            />
            {/* dark top rim where the lid rests */}
            <div className="absolute inset-x-0 top-0 h-2.5 bg-black/40" />
            {/* side iron bands */}
            <div className="absolute bottom-0 left-7 top-0 w-5" style={{ background: IRON }}>
              <Rivets />
            </div>
            <div className="absolute bottom-0 right-7 top-0 w-5" style={{ background: IRON }}>
              <Rivets />
            </div>
            {/* bottom iron band */}
            <div className="absolute inset-x-0 bottom-0 h-4" style={{ background: IRON }}>
              <span className="absolute left-10 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber-100/70" />
              <span className="absolute right-10 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber-100/70" />
            </div>
            {/* lock plate */}
            <div
              className="absolute left-1/2 top-7 flex h-9 w-10 -translate-x-1/2 items-center justify-center rounded-sm"
              style={{ background: BRASS, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.5)' }}
            >
              <span className="block h-3 w-3 rounded-full bg-amber-950/80">
                <span className="mx-auto block h-2 w-[3px] translate-y-[7px] bg-amber-950/80" />
              </span>
            </div>
          </div>

          {/* ── LID (domed, overhangs the body, opens in 3D) ──── */}
          <motion.div
            className="absolute h-[66px] w-[232px] overflow-hidden rounded-t-[110px] rounded-b-sm"
            style={{
              left: 4,
              bottom: 98,
              transformOrigin: 'bottom center',
              background: WOOD_LID,
              boxShadow: 'inset 0 4px 0 rgba(255,225,170,0.35), inset 0 -8px 14px rgba(0,0,0,0.4)',
            }}
            animate={{ rotateX: opening ? -108 : 0 }}
            transition={{ duration: 0.55, ease: easeOutSoft }}
          >
            <div className="absolute inset-0 opacity-60" style={{ background: PLANKS }} />
            <div className="absolute bottom-0 left-1/2 top-0 w-5 -translate-x-1/2" style={{ background: IRON }}>
              <Rivets />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-3.5" style={{ background: IRON }} />
            <div
              className="absolute bottom-[-2px] left-1/2 h-5 w-7 -translate-x-1/2 rounded-sm"
              style={{ background: BRASS, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }}
            />
            <div className="absolute inset-x-6 top-1 h-3 rounded-full bg-white/25 blur-[2px]" />
          </motion.div>

          {/* Treasure mound (pops up inside the chest on open) */}
          {TREASURE.map((it, i) => {
            const isGem = it.t !== 'c';
            const bg = it.t === 'ruby' ? GEM_RED : it.t === 'emerald' ? GEM_GREEN : COIN;
            return (
              <motion.span
                key={i}
                aria-hidden
                className="absolute rounded-full"
                style={{
                  left: it.x - it.r,
                  top: it.y - it.r,
                  width: it.r * 2,
                  height: it.r * 2,
                  background: bg,
                  boxShadow: isGem
                    ? 'inset 0 -2px 4px rgba(0,0,0,0.45), inset 0 2px 3px rgba(255,255,255,0.35), 0 2px 3px rgba(0,0,0,0.5)'
                    : 'inset 0 0 0 1.5px rgba(140,85,20,0.5), inset 0 2px 2px rgba(255,255,255,0.65), inset 0 -2px 3px rgba(120,70,15,0.55), 0 2px 3px rgba(0,0,0,0.4)',
                }}
                initial={{ scale: 0, opacity: 0, y: 8 }}
                animate={opening ? { scale: 1, opacity: 1, y: 0 } : { scale: 0, opacity: 0, y: 8 }}
                transition={{ duration: 0.4, delay: opening ? 0.24 + i * 0.02 : 0, ease: 'backOut' }}
              >
                {isGem ? (
                  <span className="absolute left-[26%] top-[22%] h-[26%] w-[26%] rounded-full bg-white/75 blur-[1px]" />
                ) : (
                  <span
                    className="absolute inset-[26%] rounded-full"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(140,85,20,0.45)' }}
                  />
                )}
              </motion.span>
            );
          })}

          {/* Gold coin burst (origin set via explicit left/top to avoid clobbering
              the animated transform) */}
          {BURST.map((b, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute h-2.5 w-2.5 rounded-full"
              style={{ left: 119, top: 50, background: COIN, boxShadow: '0 0 8px rgba(255,200,80,0.9)' }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
              animate={opening ? { x: b.x, y: b.y, opacity: [0, 1, 0], scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.85, delay: 0.1, ease: 'easeOut' }}
            />
          ))}
        </div>

        {/* Label plaque */}
        <div
          className="mx-auto mt-1 w-max rounded-lg px-6 py-2 font-display text-base font-extrabold uppercase tracking-wider text-amber-950 sm:text-lg"
          style={{
            background: BRASS,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.55), 0 4px 10px rgba(0,0,0,0.4)',
            textShadow: '0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {label}
        </div>
      </div>
    </motion.button>
  );
}
