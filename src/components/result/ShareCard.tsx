import type { Ref } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import type { Character, Lang } from '../../types';
import type { UIStrings } from '../../data/translations';

const SITE_URL = 'https://onepiecemi2o.netlify.app/';

interface LoreLite {
  quote: string;
  dream: string;
  fightingStyle: string;
  strengths: string[];
}

interface Props {
  nodeRef: Ref<HTMLDivElement>;
  character: Character;
  percentage: number;
  lang: Lang;
  ui: UIStrings;
  lore: LoreLite;
}

/** Gold corner flourish (rotated per corner). */
function Corner({ className }: { className: string }) {
  return (
    <svg className={`absolute h-7 w-7 ${className}`} viewBox="0 0 28 28" fill="none" aria-hidden>
      <path d="M2 12 Q2 2 12 2 M2 7 Q2 2 7 2" stroke="#ffd54a" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="5.5" cy="5.5" r="1.4" fill="#ffd54a" />
    </svg>
  );
}

/** Faint compass-rose watermark to enrich the lower half. */
function CompassWatermark() {
  return (
    <svg
      className="pointer-events-none absolute bottom-16 left-1/2 h-56 w-56 -translate-x-1/2 opacity-[0.06]"
      viewBox="0 0 100 100"
      aria-hidden
    >
      <circle cx="50" cy="50" r="47" stroke="#ffd54a" strokeWidth="0.8" fill="none" />
      <circle cx="50" cy="50" r="38" stroke="#ffd54a" strokeWidth="0.6" fill="none" />
      <path d="M50 4 L55 45 L96 50 L55 55 L50 96 L45 55 L4 50 L45 45 Z" fill="#ffd54a" />
      <path d="M50 16 L53 47 L84 50 L53 53 L50 84 L47 53 L16 50 L47 47 Z" fill="#ffd54a" opacity="0.6" />
    </svg>
  );
}

/** Offscreen, professionally-composed poster rendered only for PNG export:
 *  gold-framed dossier with the character art + pirate profile + a QR code back
 *  to the site. No glass / backdrop-filter so html-to-image captures cleanly. */
export function ShareCard({ nodeRef, character, percentage, lang, ui, lore }: Props) {
  const c = character;
  const scanText = lang === 'ar' ? 'امسح لاكتشاف قَدَرك القرصاني' : 'Scan to find your pirate destiny';

  return (
    <div className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden>
      {/* Gold frame */}
      <div ref={nodeRef} style={{ background: 'linear-gradient(150deg,#ffe9a8,#c79327 50%,#8a6418)', padding: 3 }}>
        <div
          dir={lang === 'ar' ? 'rtl' : 'ltr'}
          className="relative w-[470px] overflow-hidden p-7 font-ui"
          style={{
            background: 'radial-gradient(125% 90% at 50% 0%, #102a5e 0%, #081a40 55%, #050f2c 100%)',
            color: '#f5f5f5',
          }}
        >
          <CompassWatermark />
          <Corner className="left-2 top-2" />
          <Corner className="right-2 top-2 rotate-90" />
          <Corner className="bottom-2 right-2 rotate-180" />
          <Corner className="bottom-2 left-2 -rotate-90" />

          <div className="relative">
            {/* Header */}
            <div className="flex items-center justify-between" dir="ltr">
              <span className="font-display text-lg font-black tracking-wider" style={{ color: '#ffd54a' }}>
                ☠ ONE PIECE
              </span>
              <span className="text-[0.7rem] uppercase tracking-[0.3em]" style={{ color: 'rgba(245,245,245,0.55)' }}>
                Personality Test
              </span>
            </div>
            <div className="my-4 h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,#ffd54a88,transparent)' }} />

            {/* Main */}
            <div className="flex gap-4">
              <div className="flex-shrink-0" style={{ width: 150 }}>
                <div className="overflow-hidden rounded-md" style={{ padding: 4, background: 'linear-gradient(160deg,#ffe9a8,#b9821f)' }}>
                  <img src={c.image} alt={c.name} className="block w-full rounded-sm" style={{ filter: 'saturate(1.03)' }} />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[0.65rem] uppercase tracking-[0.25em]" style={{ color: '#ffd54a' }}>
                  {ui.yourCharacterIs}
                </div>
                <div className="font-display text-3xl font-black leading-tight" style={{ color: c.color }}>
                  {c.name}
                </div>
                <div className="mt-0.5 text-sm" style={{ color: 'rgba(245,245,245,0.6)' }}>
                  {c.title}
                </div>
                <div
                  className="mt-3 inline-block rounded-lg px-3 py-1 font-display text-lg font-black"
                  style={{ background: `${c.color}22`, color: c.color, border: `1px solid ${c.color}66` }}
                >
                  {percentage}% {ui.match}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.traits.map((t) => (
                    <span
                      key={t}
                      className="rounded-full px-2 py-0.5 text-[0.65rem]"
                      style={{ background: `${c.color}1a`, color: c.color, border: `1px solid ${c.color}55` }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Dossier */}
            <div className="mt-5 space-y-2.5 text-sm">
              <p className="italic" style={{ color: 'rgba(245,245,245,0.82)' }}>
                “{lore.quote}”
              </p>
              <DossierRow label={ui.dream} value={lore.dream} />
              <DossierRow label={ui.fightingStyle} value={lore.fightingStyle} />
              <DossierRow label={ui.strengths} value={lore.strengths.join(' · ')} />
            </div>

            {/* Decorative divider */}
            <div className="my-5 flex items-center gap-3" dir="ltr">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,#ffd54a55)' }} />
              <span style={{ color: '#ffd54a' }}>⚓</span>
              <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg,transparent,#ffd54a55)' }} />
            </div>

            {/* Footer: QR + link */}
            <div className="flex items-center justify-between gap-4" dir="ltr">
              <div className="rounded-lg bg-white p-2">
                <QRCodeSVG value={SITE_URL} size={92} bgColor="#ffffff" fgColor="#081a40" level="M" marginSize={1} />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <div className="text-sm font-semibold" style={{ color: '#f5f5f5' }}>
                  {scanText}
                </div>
                <div className="mt-1 break-all text-xs font-bold" style={{ color: '#7ee7c1' }}>
                  onepiecemi2o.netlify.app
                </div>
                <div className="mt-2 text-[0.65rem]" style={{ color: 'rgba(245,245,245,0.45)' }}>
                  © {new Date().getFullYear()} mi2o · Discover your crew
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DossierRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span
        className="flex-shrink-0 text-[0.65rem] font-bold uppercase tracking-wider"
        style={{ color: '#ffd54a', minWidth: 96 }}
      >
        {label}
      </span>
      <span style={{ color: 'rgba(245,245,245,0.82)' }}>{value}</span>
    </div>
  );
}
