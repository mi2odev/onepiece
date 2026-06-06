import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

/**
 * A one-shot ship glide + foam sweep. Remounted (via `key`) on every question
 * change so it plays once per advance, selling the "sailing onward" beat.
 */
export function SailTransition() {
  const reduce = useReducedMotionSafe();
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Foam sweep */}
      <motion.div
        className="absolute inset-x-0 top-1/2 h-24 -translate-y-1/2"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgb(var(--sea-foam) / 0.16), rgb(255 255 255 / 0.12), transparent)',
        }}
        initial={{ x: '-120%' }}
        animate={{ x: '120%' }}
        transition={{ duration: 1.3, ease: 'easeInOut' }}
      />
      {/* Ship — the Thousand Sunny gliding across on each advance */}
      <motion.img
        src="/images/sunny.png"
        alt=""
        aria-hidden
        draggable={false}
        className="absolute top-1/2 h-44 w-auto drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] sm:h-56"
        initial={{ x: '-20vw', y: '-50%', opacity: 0 }}
        animate={{ x: '120vw', y: ['-50%', '-58%', '-50%'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
    </div>
  );
}
