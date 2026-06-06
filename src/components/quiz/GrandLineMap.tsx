import { motion } from 'framer-motion';
import type { Lang } from '../../types';
import { easeOutSoft } from '../../lib/motion';

const MILESTONES = [
  { f: 0, en: 'Start', ar: 'البداية' },
  { f: 0.25, en: 'Island', ar: 'جزيرة' },
  { f: 0.5, en: 'Island', ar: 'جزيرة' },
  { f: 0.75, en: 'Marineford', ar: 'مارين فورد' },
  { f: 1, en: 'Laugh Tale', ar: 'لافتيل' },
];

interface Props {
  current: number; // 1-based question number
  total: number;
  lang: Lang;
}

/** The Grand Line journey: a dotted sea route with milestone islands and a ship
 *  that sails forward as questions are answered. Always LTR (journeys flow →). */
export function GrandLineMap({ current, total, lang }: Props) {
  const answered = Math.max(0, current - 1);
  const progress = total > 0 ? answered / total : 0;
  const pct = Math.round(progress * 100);

  return (
    <div dir="ltr" className="mx-auto w-full max-w-2xl select-none">
      <div className="mb-2 flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-wider text-cloud/70 sm:text-xs">
        <span>{lang === 'ar' ? `السؤال ${current} / ${total}` : `Log ${current} / ${total}`}</span>
        <span className="text-gold">{pct}%</span>
      </div>

      <div className="relative h-12">
        {/* Sea route base */}
        <div className="absolute inset-x-0 top-6 h-1 rounded-full bg-white/10" />
        {/* Dotted route */}
        <div
          className="absolute inset-x-0 top-[1.42rem] h-0.5 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, rgb(var(--gold) / 0.5) 0 6px, transparent 6px 12px)',
          }}
        />
        {/* Sailed-so-far fill */}
        <motion.div
          className="absolute left-0 top-6 h-1 rounded-full"
          style={{ background: 'linear-gradient(90deg, rgb(var(--sunset)), rgb(var(--gold)))' }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: easeOutSoft }}
        />

        {/* Milestone islands */}
        {MILESTONES.map((m, i) => {
          const passed = progress >= m.f - 0.001;
          const edgeClass =
            i === 0
              ? '!left-0 !translate-x-0'
              : i === MILESTONES.length - 1
                ? '!left-auto !right-0 !translate-x-0'
                : '';
          return (
            <div
              key={i}
              className="absolute top-6 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${m.f * 100}%` }}
            >
              <div
                className={`h-3 w-3 rounded-full border-2 ${
                  passed
                    ? 'border-gold bg-gold shadow-[0_0_8px_rgba(255,200,80,0.8)]'
                    : 'border-white/30 bg-ocean-deep'
                }`}
              />
              <span
                className={`absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap text-[0.58rem] ${
                  passed ? 'text-gold/90' : 'text-cloud/40'
                } ${edgeClass}`}
              >
                {lang === 'ar' ? m.ar : m.en}
              </span>
            </div>
          );
        })}

        {/* The ship — the Thousand Sunny sailing the route */}
        <motion.img
          src="/images/sunny.png"
          alt=""
          aria-hidden
          draggable={false}
          className="absolute top-6 z-10 h-16 w-auto"
          style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.65))' }}
          animate={{ left: `${progress * 100}%`, x: '-62%', y: ['-64%', '-68%', '-64%'] }}
          transition={{
            left: { duration: 1.2, ease: easeOutSoft },
            y: { duration: 4, ease: 'easeInOut', repeat: Infinity },
          }}
        />
      </div>
    </div>
  );
}
