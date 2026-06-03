import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { spring } from '../../lib/motion';

interface Props {
  onDone: () => void;
  tagline: string;
  skipLabel: string;
  isRtl: boolean;
}

/** The iconic Straw Hat, drawn with SVG — woven brim & crown, shaded red band. */
function StrawHat() {
  return (
    <svg viewBox="0 0 240 170" className="w-48 sm:w-60" aria-hidden>
      <defs>
        <radialGradient id="crownGrad" cx="42%" cy="26%" r="78%">
          <stop offset="0%" stopColor="#fbe7ac" />
          <stop offset="55%" stopColor="#ecc878" />
          <stop offset="100%" stopColor="#cfa253" />
        </radialGradient>
        <linearGradient id="brimGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f1d489" />
          <stop offset="55%" stopColor="#dbb568" />
          <stop offset="100%" stopColor="#b58c47" />
        </linearGradient>
        <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8413f" />
          <stop offset="100%" stopColor="#a81d1d" />
        </linearGradient>
      </defs>

      {/* Brim */}
      <ellipse cx="120" cy="116" rx="116" ry="31" fill="url(#brimGrad)" stroke="#96702f" strokeWidth="2" />
      <ellipse cx="120" cy="116" rx="92" ry="24" fill="none" stroke="#ac8546" strokeWidth="1.4" opacity="0.5" />
      <ellipse cx="120" cy="116" rx="66" ry="17" fill="none" stroke="#ac8546" strokeWidth="1.2" opacity="0.45" />
      <path d="M22 121 Q120 151 218 121" fill="none" stroke="#f7e2a6" strokeWidth="2" opacity="0.5" />

      {/* Shadow the crown casts on the brim */}
      <ellipse cx="120" cy="112" rx="69" ry="17" fill="#75531f" opacity="0.22" />

      {/* Crown */}
      <path
        d="M54 110 C54 50 82 33 120 33 C158 33 186 50 186 110 A66 16 0 0 1 54 110 Z"
        fill="url(#crownGrad)"
        stroke="#96702f"
        strokeWidth="2"
      />
      <g stroke="#c2974e" strokeWidth="1.3" fill="none" opacity="0.42" strokeLinecap="round">
        <path d="M76 104 C70 66 90 44 118 39" />
        <path d="M98 106 C94 62 106 43 120 40" />
        <path d="M142 106 C146 62 134 43 120 40" />
        <path d="M164 104 C170 66 150 44 122 39" />
      </g>
      <path d="M62 80 Q120 94 178 80" fill="none" stroke="#c2974e" strokeWidth="1.1" opacity="0.3" />
      <ellipse cx="103" cy="55" rx="23" ry="14" fill="#fff" opacity="0.16" />

      {/* Red band */}
      <path d="M56 88 Q120 101 184 88 L184 101 Q120 117 56 101 Z" fill="url(#bandGrad)" />
      <path d="M58 89 Q120 101 182 89" fill="none" stroke="#ff7d70" strokeWidth="1.4" opacity="0.55" />
      <path d="M58 101 Q120 116 182 101" fill="none" stroke="#7c1313" strokeWidth="1.4" opacity="0.5" />
    </svg>
  );
}

// Deterministic landing burst (origin = hat impact point).
const SPARKS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  const dist = 118 + (i % 4) * 30;
  return { x: Math.cos(a) * dist, y: Math.sin(a) * dist, d: (i % 5) * 0.035 };
});

const STARS = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 67) % 100,
  top: (i * 37) % 60,
  s: 1 + (i % 3) * 0.6,
  delay: (i % 5) * 0.6,
}));

// Hat-impact moment (seconds from mount) — everything keys to this beat.
const LAND = 0.62;

export function IntroSequence({ onDone, tagline, skipLabel, isRtl }: Props) {
  const reduce = useReducedMotionSafe();
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    const t = window.setTimeout(finish, reduce ? 1000 : 3700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <motion.div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden ${isRtl ? 'font-ui' : ''}`}
      style={{ background: 'radial-gradient(120% 100% at 50% 28%, #0e2657 0%, #061433 58%, #03081c 100%)' }}
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: reduce ? 1 : 1.16,
        filter: reduce ? undefined : 'brightness(1.5)',
        transition: { duration: 0.7, ease: 'easeInOut' },
      }}
    >
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(120% 100% at 50% 35%, transparent 45%, rgba(3,8,22,0.7) 100%)' }}
        aria-hidden
      />

      {/* Faint stars */}
      {!reduce &&
        STARS.map((s, i) => (
          <span
            key={i}
            className="animate-twinkle absolute rounded-full bg-white/80"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.s, height: s.s, animationDelay: `${s.delay}s` }}
          />
        ))}

      {/* Rising waves */}
      <motion.svg
        className="absolute inset-x-0 bottom-0 h-[40%] w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        initial={reduce ? { y: 0 } : { y: 230 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        aria-hidden
      >
        <path d="M0 80 Q360 20 720 80 T1440 80 L1440 200 L0 200 Z" fill="rgba(13,42,115,0.55)" />
        <path d="M0 80 Q360 20 720 80 T1440 80" fill="none" stroke="rgba(126,231,193,0.35)" strokeWidth="3" />
        <path d="M0 118 Q360 68 720 118 T1440 118 L1440 200 L0 200 Z" fill="rgba(6,20,51,0.85)" />
      </motion.svg>

      {/* Centre stage */}
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-60 w-60 items-center justify-center sm:h-72 sm:w-72">
          {/* Golden glow (pulses after landing) */}
          <motion.div
            className="absolute -inset-4 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,200,90,0.5), transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.5, 1, 0.8], scale: [0.6, 0.7, 1.15, 1] }}
            transition={{ duration: 1.4, delay: LAND - 0.3, times: [0, 0.3, 0.55, 1], ease: 'easeOut' }}
          />

          {/* Log Pose rings (counter-rotating) */}
          <motion.div
            className="absolute inset-0 rounded-full border border-gold/25"
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          >
            {['left-1/2 top-0', 'left-1/2 bottom-0', 'left-0 top-1/2', 'right-0 top-1/2'].map((p) => (
              <span
                key={p}
                className={`absolute ${p} h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/70`}
              />
            ))}
          </motion.div>
          <motion.div
            className="absolute inset-7 rounded-full border-2 border-dashed border-gold/40"
            animate={reduce ? {} : { rotate: -360 }}
            transition={{ duration: 11, repeat: Infinity, ease: 'linear' }}
          />

          {/* Impact shockwave */}
          {!reduce && (
            <motion.div
              className="absolute inset-12 rounded-full border-2 border-gold/70"
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 2.1], opacity: [0.9, 0] }}
              transition={{ duration: 0.8, delay: LAND, ease: 'easeOut' }}
            />
          )}

          {/* Impact flash */}
          {!reduce && (
            <motion.div
              className="absolute -inset-8 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.9), transparent 60%)' }}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: [0, 0.85, 0], scale: [0.3, 1.2, 1.5] }}
              transition={{ duration: 0.5, delay: LAND - 0.04, ease: 'easeOut' }}
            />
          )}

          {/* Straw Hat — falls and lands with squash & stretch */}
          <motion.div
            style={{ transformOrigin: 'bottom center' }}
            initial={reduce ? { opacity: 0 } : { y: -215, opacity: 0, rotate: -22 }}
            animate={
              reduce
                ? { opacity: 1 }
                : {
                    y: [-215, 0, -16, 0],
                    rotate: [-22, -3, -7, -4],
                    scaleX: [1, 1.16, 0.97, 1],
                    scaleY: [1, 0.82, 1.05, 1],
                    opacity: [0, 1, 1, 1],
                  }
            }
            transition={
              reduce
                ? { duration: 0.4 }
                : { duration: 0.95, delay: 0.15, times: [0, 0.5, 0.72, 1], ease: ['easeIn', 'easeOut', 'easeOut'] }
            }
          >
            <StrawHat />
          </motion.div>

          {/* Landing sparkle burst (origin anchored to centre) */}
          {!reduce && (
            <div className="absolute left-1/2 top-1/2 h-0 w-0">
              {SPARKS.map((s, i) => (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-gold"
                  style={{ marginLeft: -3, marginTop: -3, boxShadow: '0 0 8px rgba(255,200,90,0.95)' }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  animate={{ x: s.x, y: s.y, opacity: [0, 1, 0], scale: [0.5, 1, 0.7] }}
                  transition={{ duration: 0.95, delay: LAND + s.d, ease: 'easeOut' }}
                />
              ))}
            </div>
          )}

          {/* Shine sweep across the hat */}
          {!reduce && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -left-1/4 inset-y-0 w-1/4 -skew-x-12">
                <motion.div
                  className="h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent blur-[2px]"
                  initial={{ x: '-60%', opacity: 0 }}
                  animate={{ x: '720%', opacity: [0, 0.9, 0] }}
                  transition={{ duration: 0.75, delay: LAND + 0.45, ease: 'easeOut' }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tagline */}
        <motion.div
          className="mt-3 text-center"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={reduce ? { duration: 0.4, delay: 0.3 } : { ...spring.soft, delay: 1.55 }}
        >
          <div className="text-fire font-display text-3xl font-black tracking-wide drop-shadow-[0_2px_18px_rgba(255,140,40,0.4)] sm:text-5xl">
            {tagline}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-gold/70">
            <span className="h-px w-10" style={{ background: 'linear-gradient(90deg,transparent,currentColor)' }} />
            <span className="h-1.5 w-1.5 rotate-45 bg-current" />
            <span className="h-px w-10" style={{ background: 'linear-gradient(270deg,transparent,currentColor)' }} />
          </div>
        </motion.div>
      </div>

      {/* Skip */}
      <motion.button
        type="button"
        onClick={finish}
        className="glass absolute bottom-6 right-6 rounded-lg px-3 py-2 text-xs font-medium text-cloud/80 transition-colors hover:bg-white/15"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {skipLabel} »
      </motion.button>
    </motion.div>
  );
}
