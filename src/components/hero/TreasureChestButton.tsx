import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useSound } from '../../hooks/useSound';
import { easeOutSoft } from '../../lib/motion';

// Pre-computed coin-burst vectors (deterministic).
const BURST = Array.from({ length: 14 }, (_, i) => {
  const ang = -Math.PI / 2 + (i / 13 - 0.5) * Math.PI * 1.5;
  const dist = 70 + (i % 4) * 16;
  return { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist };
});

const WOOD = 'linear-gradient(180deg,#8a5a2b 0%,#6b3f1d 55%,#4a2a11 100%)';
const WOOD_LID = 'linear-gradient(180deg,#9a663180 0%,#8a5a2b 35%,#5c3518 100%)';
const IRON = 'linear-gradient(180deg,#62626c 0%,#3a3a42 55%,#222228 100%)';
const BRASS = 'linear-gradient(180deg,#ffe08a 0%,#e0a83a 48%,#a9701c 100%)';
const PLANKS =
  'repeating-linear-gradient(90deg, transparent 0 28px, rgba(0,0,0,0.22) 28px 30px)';

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
 *  in real perspective, spilling gold, before the journey begins. */
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
    window.setTimeout(onBegin, 780);
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
            className="absolute inset-x-10 top-9 h-14 rounded-full bg-gold blur-md"
            animate={{ opacity: opening ? 0.95 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Gold coins peeking when open */}
          {[34, 96, 150].map((x, i) => (
            <motion.span
              key={x}
              aria-hidden
              className="absolute top-[58px] h-5 w-5 rounded-full"
              style={{
                left: x,
                background: 'radial-gradient(circle at 35% 30%, #fff2bf, #f3c64a 55%, #b9821f)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.5)',
              }}
              initial={{ y: 8, opacity: 0 }}
              animate={opening ? { y: 0, opacity: 1 } : { y: 8, opacity: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            />
          ))}

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
            {/* dark top rim where the lid rests */}
            <div className="absolute inset-x-0 top-0 h-2.5 bg-black/35" />
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
              className="absolute left-1/2 top-1.5 flex h-12 w-10 -translate-x-1/2 items-center justify-center rounded-sm"
              style={{ background: BRASS, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6), 0 1px 2px rgba(0,0,0,0.5)' }}
            >
              <span className="block h-3 w-3 rounded-full bg-amber-950/80">
                <span className="mx-auto block h-2 w-[3px] translate-y-[7px] bg-amber-950/80" />
              </span>
            </div>
          </div>

          {/* ── LID (domed, hinged at the back, opens in 3D) ──── */}
          {/* Centred via explicit `left` (not a Tailwind translate) because the
              animated rotateX writes `transform`, which would clobber it. */}
          <motion.div
            className="absolute h-[66px] w-[224px] overflow-hidden rounded-t-[110px] rounded-b-sm"
            style={{
              left: 8,
              bottom: 98,
              transformOrigin: 'bottom center',
              background: WOOD_LID,
              boxShadow:
                'inset 0 4px 0 rgba(255,225,170,0.35), inset 0 -8px 14px rgba(0,0,0,0.4)',
            }}
            animate={{ rotateX: opening ? -115 : 0 }}
            transition={{ duration: 0.55, ease: easeOutSoft }}
          >
            <div className="absolute inset-0 opacity-60" style={{ background: PLANKS }} />
            {/* center iron strap */}
            <div className="absolute bottom-0 left-1/2 top-0 w-5 -translate-x-1/2" style={{ background: IRON }}>
              <Rivets />
            </div>
            {/* bottom iron rail of lid */}
            <div className="absolute inset-x-0 bottom-0 h-3.5" style={{ background: IRON }} />
            {/* brass clasp */}
            <div
              className="absolute bottom-[-2px] left-1/2 h-5 w-7 -translate-x-1/2 rounded-sm"
              style={{ background: BRASS, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)' }}
            />
            {/* top sheen */}
            <div className="absolute inset-x-6 top-1 h-3 rounded-full bg-white/25 blur-[2px]" />
          </motion.div>

          {/* Gold coin burst (origin set via explicit left/top — the animated
              x/y writes `transform`, so a translate class would be clobbered). */}
          {BURST.map((b, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="absolute h-2.5 w-2.5 rounded-full"
              style={{
                left: 115,
                top: 52,
                background: 'radial-gradient(circle at 35% 30%, #fff2bf, #f3c64a 55%, #b9821f)',
                boxShadow: '0 0 8px rgba(255,200,80,0.9)',
              }}
              initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
              animate={opening ? { x: b.x, y: b.y, opacity: [0, 1, 0], scale: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
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
