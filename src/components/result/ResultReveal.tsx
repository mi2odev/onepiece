import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { CharacterKey, Lang, Scores } from '../../types';
import type { UIStrings } from '../../data/translations';
import { getCharacters } from '../../data/translations';
import { computeRanking } from '../../lib/scoring';
import { computeAffinities, computeTraits } from '../../lib/traits';
import { getLore, getPowerType } from '../../data/lore';
import { fadeUp, easeOutSoft } from '../../lib/motion';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useSound } from '../../hooks/useSound';
import { downloadNodeAsPng } from '../../lib/share';
import { Button } from '../ui/Button';
import { BountyPoster } from './BountyPoster';
import { HakiRing } from './HakiRing';
import { TraitRadar } from './TraitRadar';
import { CharacterShowcase } from './CharacterShowcase';
import { ShareCard } from './ShareCard';

interface Props {
  scores: Scores;
  lang: Lang;
  ui: UIStrings;
  isRtl: boolean;
  onRestart: () => void;
}

export function ResultReveal({ scores, lang, ui, isRtl, onRestart }: Props) {
  const reduce = useReducedMotionSafe();
  const { play } = useSound();

  const characters = getCharacters(lang);
  const ranking = computeRanking(scores);
  const top = ranking[0];
  const topChar = characters[top.key];
  const traits = computeTraits(scores, lang);
  const aff = computeAffinities(traits);
  const loreTop = getLore(top.key, lang);

  const [revealed, setRevealed] = useState(reduce);
  const [selected, setSelected] = useState<CharacterKey | null>(null);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const shareRef = useRef<HTMLDivElement>(null);
  const revealSfxRef = useRef(false);

  useEffect(() => {
    // The dramatic beat: bounty rises, Haki ring fills, and the
    // Observation-Haki sting hits — exactly once.
    const fire = () => {
      setRevealed(true);
      if (!revealSfxRef.current) {
        revealSfxRef.current = true;
        play('reveal');
      }
    };
    if (reduce) {
      fire();
      return;
    }
    const t = window.setTimeout(fire, 1200);
    return () => window.clearTimeout(t);
  }, [reduce, play]);

  const onShare = async () => {
    if (!shareRef.current) return;
    play('success');
    try {
      await downloadNodeAsPng(shareRef.current, `straw-hat-${top.key}.png`);
      setShareMsg(lang === 'ar' ? 'تم تنزيل الملصق' : 'Poster downloaded');
    } catch {
      setShareMsg(lang === 'ar' ? 'تعذّر التنزيل' : 'Download failed');
    }
    window.setTimeout(() => setShareMsg(null), 2600);
  };

  return (
    <div className={`relative min-h-[100dvh] pb-28 ${isRtl ? 'font-ui' : ''}`}>
      {!reduce && <IntroCover />}

      {/* A — Reveal */}
      <section className="px-4 pt-16 sm:pt-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 md:flex-row md:justify-center md:gap-12">
          <motion.div
            initial={reduce ? false : { y: 70, opacity: 0, scale: 0.9 }}
            animate={revealed ? { y: 0, opacity: 1, scale: 1 } : undefined}
            transition={{ duration: 0.9, ease: easeOutSoft, delay: 0.15 }}
          >
            <BountyPoster character={topChar} floating />
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={revealed ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="glass-strong relative w-full max-w-sm overflow-hidden rounded-3xl p-6 text-center sm:p-8"
            style={{ boxShadow: `0 24px 60px -26px ${topChar.color}99` }}
          >
            {/* Character-tinted top glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-2 h-28"
              style={{ background: `radial-gradient(80% 100% at 50% 0%, ${topChar.color}33, transparent 70%)` }}
            />

            <div className="relative">
              <span className="text-[0.7rem] uppercase tracking-[0.3em] text-gold/80">
                {ui.yourCharacterIs}
              </span>
              <h1 className="text-fire text-shadow-poster font-display text-4xl font-black leading-tight sm:text-5xl">
                {topChar.name}
              </h1>
              <p className="mt-1 text-cloud/70">{topChar.title}</p>

              <div
                className="mx-auto my-5 h-px w-24"
                style={{ background: 'linear-gradient(90deg,transparent,rgb(var(--gold) / 0.6),transparent)' }}
              />

              <div className="flex justify-center">
                <HakiRing value={top.percentage} color={topChar.color} start={revealed} matchLabel={ui.match} />
              </div>

              <p className="mx-auto mt-6 max-w-xs text-[0.95rem] italic text-cloud/85">
                “{loreTop.quote}”
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {topChar.traits.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border px-3 py-1 text-xs font-medium"
                    style={{ borderColor: `${topChar.color}80`, color: topChar.color, background: `${topChar.color}1a` }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        {revealed && (
          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduce ? 0 : 1.4, duration: 0.6 }}
          >
            <motion.div
              animate={reduce ? {} : { y: [0, 7, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-cloud/40"
              aria-hidden
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* B — Character intro */}
      <Section className="mx-auto mt-12 max-w-4xl px-4">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard title={ui.summary}>{topChar.description}</InfoCard>
          <InfoCard title={ui.dream}>{loreTop.dream}</InfoCard>
          <ListCard title={ui.strengths} items={loreTop.strengths} dot="rgb(126 231 193)" />
          <ListCard title={ui.weaknesses} items={loreTop.weaknesses} dot="rgb(214 43 43)" />
        </div>
        <div className="mt-4">
          <InfoCard title={ui.fightingStyle}>{loreTop.fightingStyle}</InfoCard>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <AffinityCard label={ui.hakiAffinity} value={aff.haki} color="#9d6bff" />
          <AffinityCard label={getPowerType(top.key, lang)} value={aff.devilFruit} color="#ff8a00" />
          <AffinityCard label={ui.crewAffinity} value={aff.crew} color="#7ee7c1" />
        </div>
      </Section>

      {/* C — Analytics radar */}
      <Section className="mx-auto mt-14 max-w-4xl px-4">
        <SectionHeading title={ui.analytics} />
        <div
          className="rounded-3xl p-4 sm:p-6"
          style={{
            background: 'linear-gradient(160deg, rgb(255 255 255 / 0.08), rgb(255 255 255 / 0.02))',
            border: `1px solid ${topChar.color}33`,
            boxShadow: `inset 0 0 60px ${topChar.color}14`,
          }}
        >
          <TraitRadar traits={traits} color={topChar.color} />
        </div>
      </Section>

      {/* D — Showcase */}
      <Section className="mx-auto mt-14 max-w-5xl px-4">
        <SectionHeading title={ui.showcase} subtitle={ui.seeHowYouMatch} />
        <CharacterShowcase ranking={ranking} characters={characters} onSelect={setSelected} />
      </Section>

      {/* F — Actions */}
      <Section className="mx-auto mt-12 max-w-md px-4">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button variant="gold" className="px-6 py-3 text-base" onClick={onRestart}>
            🔄 {ui.takeAgain}
          </Button>
          <Button variant="glass" className="px-6 py-3 text-base" onClick={onShare}>
            📜 {ui.downloadPoster}
          </Button>
        </div>
        <AnimatePresence>
          {shareMsg && (
            <motion.p
              key="toast"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-3 text-center text-sm text-sea-foam"
            >
              {shareMsg}
            </motion.p>
          )}
        </AnimatePresence>
      </Section>

      {/* Offscreen export node */}
      <ShareCard
        nodeRef={shareRef}
        character={topChar}
        percentage={top.percentage}
        lang={lang}
        ui={ui}
        lore={loreTop}
      />

      {/* Character modal */}
      <AnimatePresence>
        {selected && (
          <CharacterModal
            key={selected}
            charKey={selected}
            lang={lang}
            ui={ui}
            color={characters[selected].color}
            name={characters[selected].name}
            title={characters[selected].title}
            description={characters[selected].description}
            image={characters[selected].image}
            emoji={characters[selected].emoji}
            traits={characters[selected].traits}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Cinematic intro: black + fog, fading to reveal ──────────────────────────
function IntroCover() {
  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.0, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 50% at 50% 42%, rgba(220,235,255,0.18), transparent 70%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.7, 0] }}
        transition={{ duration: 1.7, ease: 'easeInOut' }}
      />
    </div>
  );
}

// ── Scroll-revealed section wrapper ─────────────────────────────────────────
function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.section
      className={className}
      initial={reduce ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6 text-center">
      <div className="flex items-center justify-center gap-3">
        <span
          className="h-px w-8 sm:w-16"
          style={{ background: 'linear-gradient(90deg, transparent, rgb(var(--gold) / 0.6))' }}
        />
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" />
        <h2 className="font-display text-2xl font-black tracking-wide text-cloud sm:text-3xl">{title}</h2>
        <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" />
        <span
          className="h-px w-8 sm:w-16"
          style={{ background: 'linear-gradient(270deg, transparent, rgb(var(--gold) / 0.6))' }}
        />
      </div>
      {subtitle && <p className="mt-2 text-sm text-cloud/60">{subtitle}</p>}
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gold/80">{title}</h3>
      <p className="text-sm leading-relaxed text-cloud/80">{children}</p>
    </div>
  );
}

function ListCard({ title, items, dot }: { title: string; items: string[]; dot: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-cloud/70">{title}</h3>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-cloud/85">
            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: dot }} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AffinityCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-xs font-semibold uppercase leading-tight tracking-wide text-cloud/70">
          {label}
        </h3>
        <span className="shrink-0 text-base font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}aa, ${color})`, boxShadow: `0 0 10px ${color}66` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, ease: easeOutSoft, delay: 0.15 }}
        />
      </div>
    </div>
  );
}

interface ModalProps {
  charKey: CharacterKey;
  lang: Lang;
  ui: UIStrings;
  color: string;
  name: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
  traits: string[];
  onClose: () => void;
}

function CharacterModal({
  charKey,
  lang,
  ui,
  color,
  name,
  title,
  description,
  image,
  emoji,
  traits,
  onClose,
}: ModalProps) {
  const l = getLore(charKey, lang);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="glass-strong relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl p-6"
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60"
        >
          ✕
        </button>
        <div className="mx-auto h-40 w-32 overflow-hidden rounded-xl border-2" style={{ borderColor: color }}>
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.display = 'none';
              const sib = t.nextElementSibling as HTMLElement | null;
              if (sib) sib.style.display = 'flex';
            }}
          />
          <div
            className="hidden h-full w-full items-center justify-center text-5xl"
            style={{ backgroundColor: color }}
          >
            {emoji}
          </div>
        </div>
        <h3 className="mt-4 text-center font-display text-2xl font-black" style={{ color }}>
          {name}
        </h3>
        <p className="text-center text-sm text-cloud/60">{title}</p>
        <p className="mt-3 text-center text-sm leading-relaxed text-cloud/80">{description}</p>
        <p className="mt-3 text-center text-sm italic text-cloud/70">“{l.quote}”</p>
        <div className="mt-3">
          <h4 className="mb-1 text-xs font-semibold uppercase tracking-wider text-gold/80">{ui.dream}</h4>
          <p className="text-sm text-cloud/80">{l.dream}</p>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {traits.map((t) => (
            <span
              key={t}
              className="rounded-full border px-2.5 py-1 text-xs"
              style={{ borderColor: color, color, background: `${color}1a` }}
            >
              #{t}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
