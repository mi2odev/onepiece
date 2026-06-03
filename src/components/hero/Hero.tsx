import { motion, type Variants } from 'framer-motion';
import type { Lang } from '../../types';
import type { UIStrings } from '../../data/translations';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { fadeUp } from '../../lib/motion';
import { LogoReveal } from './LogoReveal';
import { TreasureChestButton } from './TreasureChestButton';
import { LangToggle } from '../ui/LangToggle';
import { SoundToggle } from '../ui/SoundToggle';

interface HeroProps {
  ui: UIStrings;
  lang: Lang;
  isRtl: boolean;
  onToggleLang: () => void;
  onBegin: () => void;
}

export function Hero({ ui, lang, isRtl, onToggleLang, onBegin }: HeroProps) {
  const reduce = useReducedMotionSafe();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduce ? 0 : 0.16,
        delayChildren: reduce ? 0 : 0.4,
      },
    },
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : fadeUp;

  const features = [
    { title: ui.howItWorks, body: ui.howItWorksDesc, accent: 'text-gold' },
    { title: ui.whatYouGet, body: ui.whatYouGetDesc, accent: 'text-sunset' },
    { title: ui.accuracyFocus, body: ui.accuracyFocusDesc, accent: 'text-sea-foam' },
  ];
  const stats = [ui.statsQuestions, ui.statsCharacters, ui.statsReplays];

  return (
    <div className={`relative min-h-[100dvh] w-full ${isRtl ? 'font-ui' : ''}`}>
      {/* Top control bar */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-end gap-2 p-4 sm:p-5">
        <a
          href="https://jojomi2o.netlify.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="glass rounded-lg px-3 py-2 text-xs font-medium text-cloud/90 transition-colors hover:bg-white/15 sm:text-sm"
        >
          {lang === 'en' ? 'JoJo Test' : 'اختبار جوجو'}
        </a>
        <LangToggle lang={lang} onToggle={onToggleLang} />
        <SoundToggle />
      </div>

      {/* Centre stage */}
      <div className="mx-auto flex min-h-[100dvh] max-w-5xl flex-col items-center justify-center px-4 pb-24 pt-20 text-center sm:pt-24">
        <LogoReveal />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-4 flex flex-col items-center sm:mt-6"
        >
          <motion.span
            variants={item}
            className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold/80 sm:text-xs"
          >
            {ui.chapterOne}
          </motion.span>

          <motion.h1
            variants={item}
            className="text-fire text-shadow-poster font-display text-fluid-2xl font-black leading-[1.05]"
          >
            {ui.heroTitle}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-3 max-w-xl text-base text-cloud/85 sm:text-lg md:text-xl"
          >
            {ui.heroSubtitle}
          </motion.p>

          <motion.div variants={item} className="mt-6 sm:mt-8">
            <TreasureChestButton label={ui.beginJourney} onBegin={onBegin} />
          </motion.div>

          <motion.p variants={item} className="mt-7 text-sm text-cloud/60">
            {ui.joinCrew}
          </motion.p>

          {/* Lore / feature cards */}
          <motion.div
            variants={item}
            className="mt-10 grid w-full gap-4 text-start sm:mt-12 md:grid-cols-3"
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="glass rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.12]"
              >
                <h3
                  className={`mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide ${f.accent}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-cloud/70">{f.body}</p>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            dir="ltr"
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[0.65rem] uppercase tracking-wide text-cloud/55 sm:text-xs"
          >
            {stats.map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold"
                  style={{ animationDelay: `${i * 0.5}s` }}
                />
                {s}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
