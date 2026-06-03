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

/** The iconic Straw Hat, drawn with SVG. */
function StrawHat() {
  return (
    <svg viewBox="0 0 220 140" className="w-44 sm:w-56" aria-hidden>
      <defs>
        <linearGradient id="straw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f9e0a2" />
          <stop offset="100%" stopColor="#e0b463" />
        </linearGradient>
        <linearGradient id="brim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eecd83" />
          <stop offset="100%" stopColor="#c2964c" />
        </linearGradient>
      </defs>
      {/* Brim */}
      <ellipse cx="110" cy="100" rx="104" ry="26" fill="url(#brim)" stroke="#9c7232" strokeWidth="1.5" />
      <ellipse cx="110" cy="96" rx="86" ry="18" fill="#f2d68f" opacity="0.55" />
      {/* Crown */}
      <path d="M48 99 C48 44 74 30 110 30 C146 30 172 44 172 99 Z" fill="url(#straw)" stroke="#9c7232" strokeWidth="1.5" />
      {/* Straw weave hints */}
      <path d="M54 70 C82 60 138 60 166 70" stroke="#cda557" strokeWidth="1" fill="none" opacity="0.45" />
      <path d="M58 56 C84 47 136 47 162 56" stroke="#cda557" strokeWidth="1" fill="none" opacity="0.4" />
      {/* Red band */}
      <path d="M50 92 C82 104 138 104 170 92 L170 74 C138 86 82 86 50 74 Z" fill="#d62b2b" />
      <path d="M50 92 C82 104 138 104 170 92" stroke="#9e1f1f" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

// Deterministic sparkle ring.
const SPARKS = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2;
  return { x: Math.cos(a) * 150, y: Math.sin(a) * 110, d: (i % 5) * 0.08 };
});

export function IntroSequence({ onDone, tagline, skipLabel, isRtl }: Props) {
  const reduce = useReducedMotionSafe();
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    const t = window.setTimeout(finish, reduce ? 1000 : 3600);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <motion.div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden ${isRtl ? 'font-ui' : ''}`}
      style={{ background: 'radial-gradient(120% 100% at 50% 28%, #0e2657 0%, #061433 58%, #03081c 100%)' }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: reduce ? 1 : 1.12, transition: { duration: 0.7, ease: 'easeInOut' } }}
    >
      {/* Rising waves */}
      <motion.svg
        className="absolute inset-x-0 bottom-0 h-[38%] w-full"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        initial={reduce ? { y: 0 } : { y: 220 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, ease: 'easeOut' }}
        aria-hidden
      >
        <path d="M0 80 Q360 20 720 80 T1440 80 L1440 200 L0 200 Z" fill="rgba(13,42,115,0.55)" />
        <path d="M0 115 Q360 65 720 115 T1440 115 L1440 200 L0 200 Z" fill="rgba(6,20,51,0.85)" />
      </motion.svg>

      {/* Centre stage */}
      <div className="relative flex flex-col items-center">
        <div className="relative flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64">
          {/* Golden glow */}
          <motion.div
            className="absolute -inset-6 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,200,90,0.45), transparent 70%)' }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />

          {/* Log Pose ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-dashed border-gold/40"
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
          />
          {/* Burst ring on settle */}
          {!reduce && (
            <motion.div
              className="absolute inset-4 rounded-full border-2 border-gold/60"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: [0.4, 1.7], opacity: [0.85, 0] }}
              transition={{ duration: 1, delay: 0.55, ease: 'easeOut' }}
            />
          )}

          {/* Sparkles */}
          {!reduce &&
            SPARKS.map((s, i) => (
              <motion.span
                key={i}
                className="absolute h-1.5 w-1.5 rounded-full bg-gold"
                style={{ boxShadow: '0 0 8px rgba(255,200,90,0.9)' }}
                initial={{ x: 0, y: 0, opacity: 0 }}
                animate={{ x: s.x, y: s.y, opacity: [0, 1, 0] }}
                transition={{ duration: 1.3, delay: 0.6 + s.d, ease: 'easeOut' }}
              />
            ))}

          {/* Straw Hat */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: -170, opacity: 0, rotate: -18 }}
            animate={{ y: 0, opacity: 1, rotate: -4 }}
            transition={reduce ? { duration: 0.4 } : { ...spring.bouncy, delay: 0.25 }}
          >
            <StrawHat />
          </motion.div>
        </div>

        {/* Tagline */}
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: reduce ? 0.3 : 1.5 }}
        >
          <div className="text-fire font-display text-2xl font-black tracking-wide sm:text-4xl">
            {tagline}
          </div>
          <div className="mt-3 flex items-center justify-center gap-2 text-gold/70">
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg,transparent,currentColor)' }} />
            <span className="h-1.5 w-1.5 rotate-45 bg-current" />
            <span className="h-px w-8" style={{ background: 'linear-gradient(270deg,transparent,currentColor)' }} />
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
