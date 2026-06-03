import type { Lang } from '../../types';

interface Props {
  lang: Lang;
  onToggle: () => void;
}

export function LangToggle({ lang, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="glass rounded-lg px-3 py-2 text-xs font-medium tracking-wide text-cloud/90 transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 sm:text-sm"
      aria-label={lang === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'}
    >
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  );
}
