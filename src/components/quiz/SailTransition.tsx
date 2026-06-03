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
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />
      {/* Ship */}
      <motion.div
        className="absolute top-1/2 text-4xl drop-shadow-[0_6px_10px_rgba(0,0,0,0.6)] sm:text-5xl"
        initial={{ x: '-15vw', y: '-50%', opacity: 0 }}
        animate={{ x: '115vw', y: ['-50%', '-58%', '-50%'], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1, ease: 'easeInOut' }}
      >
        ⛵
      </motion.div>
    </div>
  );
}
