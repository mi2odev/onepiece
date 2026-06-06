import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { easeOutSoft } from '../../lib/motion';

interface Props {
  /** Called when the curtain has cleared and the stage should go live. */
  onDone: () => void;
}

// Deterministic ember field (no per-render randomness).
const EMBERS = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2;
  const dist = 120 + ((i * 53) % 260);
  return {
    x: Math.cos(a) * dist,
    y: Math.sin(a) * dist - 80,
    size: 2 + (i % 4),
    delay: 0.95 + (i % 6) * 0.03,
  };
});

const BURN_AT = 1.0; // when the parchment ignites
const DONE_AT = 1950; // ms — hand off to the live stage

/**
 * One-time cinematic curtain for the bounty reveal:
 *   1. Screen darkens.  2. Marine ink stamp slams down.  3. The parchment
 *   ignites and burns away, revealing the stage beneath.
 * Mounted only when motion is allowed; unmounts itself via `onDone`.
 */
export function RevealSequence({ onDone }: Props) {
  useEffect(() => {
    const t = window.setTimeout(onDone, DONE_AT);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {/* Dark veil */}
      <motion.div
        className="absolute inset-0 bg-[#03060f]"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeInOut', delay: BURN_AT }}
      />

      {/* Parchment curtain that ignites + burns away */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 0%, #efd9a6 0%, #e3c787 50%, #c9a866 100%)',
          boxShadow: 'inset 0 0 200px rgba(120,80,28,0.5)',
        }}
        initial={{ opacity: 1, scale: 1, filter: 'brightness(1)' }}
        animate={{ opacity: [1, 1, 0], scale: [1, 1.02, 1.14], filter: ['brightness(1)', 'brightness(1.5)', 'brightness(2.2)'] }}
        transition={{ duration: 0.85, ease: easeOutSoft, delay: BURN_AT, times: [0, 0.3, 1] }}
      >
        {/* fibres */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            background:
              'repeating-linear-gradient(96deg, rgba(150,110,50,0.10) 0 3px, transparent 3px 7px)',
          }}
        />

        {/* Marine ink stamp — slams down, holds, then burns with the sheet */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 1.7, opacity: 0, rotate: -16 }}
            animate={{ scale: [1.7, 0.9, 1], opacity: [0, 1, 1], rotate: [-16, -7, -7] }}
            transition={{ duration: 0.42, ease: 'easeOut', delay: 0.18, times: [0, 0.7, 1] }}
          >
            <MarineStamp />
          </motion.div>
          {/* stamp shockwave */}
          <motion.span
            className="absolute h-44 w-44 rounded-full"
            style={{ border: '3px solid rgba(150,30,34,0.5)' }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 2.4, opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.6, ease: easeOutSoft, delay: 0.32 }}
          />
        </div>

        {/* Burning ember edge — a hot ring blooming outward */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,170,40,0.9), rgba(255,90,20,0.5) 40%, transparent 70%)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 6, 12], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.85, ease: easeOutSoft, delay: BURN_AT }}
        />
      </motion.div>

      {/* Rising embers as the page burns */}
      {EMBERS.map((e, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            height: e.size,
            width: e.size,
            background: i % 3 === 0 ? '#ffd54a' : '#ff7a1f',
            boxShadow: '0 0 8px rgba(255,150,40,0.9)',
          }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
          animate={{ x: e.x, y: e.y, opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: e.delay }}
        />
      ))}
    </div>
  );
}

/** Official-looking Marine ink stamp (pure SVG, distressed). */
function MarineStamp() {
  const ink = '#a51f24';
  return (
    <svg width="190" height="190" viewBox="0 0 200 200" fill="none" style={{ opacity: 0.92, mixBlendMode: 'multiply' }}>
      <circle cx="100" cy="100" r="92" stroke={ink} strokeWidth="3" opacity="0.85" />
      <circle cx="100" cy="100" r="80" stroke={ink} strokeWidth="6" />
      <circle cx="100" cy="100" r="58" stroke={ink} strokeWidth="2" opacity="0.7" />
      {/* arched text via paths */}
      <defs>
        <path id="arc-top" d="M 38 100 A 62 62 0 0 1 162 100" />
        <path id="arc-bot" d="M 40 100 A 60 60 0 0 0 160 100" />
      </defs>
      <text fill={ink} fontSize="20" fontWeight="800" letterSpacing="6" fontFamily="Cinzel, serif">
        <textPath href="#arc-top" startOffset="50%" textAnchor="middle">MARINE</textPath>
      </text>
      <text fill={ink} fontSize="12" fontWeight="700" letterSpacing="5" fontFamily="Cinzel, serif">
        <textPath href="#arc-bot" startOffset="50%" textAnchor="middle">JUSTICE</textPath>
      </text>
      {/* anchor */}
      <g stroke={ink} strokeWidth="4" strokeLinecap="round" fill="none">
        <circle cx="100" cy="74" r="7" />
        <line x1="100" y1="81" x2="100" y2="128" />
        <line x1="84" y1="95" x2="116" y2="95" />
        <path d="M76 116 Q100 140 124 116" />
      </g>
    </svg>
  );
}
