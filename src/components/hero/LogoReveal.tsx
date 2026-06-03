import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { easeOutSoft } from '../../lib/motion';

/** The One Piece logo emerging from glow + smoke, with a sun rising behind it. */
export function LogoReveal() {
  const reduce = useReducedMotionSafe();

  return (
    <div className="relative flex justify-center">
      {/* Rising sun behind the logo */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] blur-3xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgb(var(--sun-core) / 0.55) 0%, rgb(var(--sunset) / 0.3) 45%, rgb(var(--pirate-red) / 0.08) 70%, transparent 100%)',
        }}
        initial={reduce ? { opacity: 0.7 } : { opacity: 0, y: 60, scale: 0.85 }}
        animate={{ opacity: 0.8, y: 0, scale: 1 }}
        transition={{ duration: reduce ? 0.3 : 1.6, ease: easeOutSoft }}
      />

      {/* Smoke puffs that dissipate on entrance */}
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.div
            key={i}
            aria-hidden
            className="pointer-events-none absolute top-1/2 -z-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
            style={{ left: `${30 + i * 20}%` }}
            initial={{ opacity: 0.5, scale: 0.6, y: 10 }}
            animate={{ opacity: 0, scale: 1.8, y: -30 }}
            transition={{ duration: 1.6, delay: 0.2 + i * 0.15, ease: 'easeOut' }}
          />
        ))}

      {/* The logo */}
      <motion.img
        src="/images/logo.png"
        alt="One Piece"
        className="drag-none relative w-52 select-none sm:w-64 md:w-[21rem] lg:w-[24rem]"
        style={{ filter: 'drop-shadow(0 6px 22px rgb(0 0 0 / 0.6))' }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.82, filter: 'blur(16px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: reduce ? 0.3 : 1.2, ease: easeOutSoft }}
        draggable={false}
        onError={(e) => {
          const img = e.currentTarget;
          if (img.src.includes('logo.png')) img.src = '/images/logo.svg';
        }}
      />
    </div>
  );
}
