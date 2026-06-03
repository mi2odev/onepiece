/* eslint-disable react-refresh/only-export-components --
   Provider + hook are intentionally colocated; only affects HMR granularity. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Sound system.
//  • Background music: the One Piece OST loops the whole visit. Browsers block
//    autoplay-with-sound until a gesture, so it starts on the first interaction.
//  • One-shots (e.g. the Observation-Haki reveal sting) play via short-lived
//    <audio> elements; missing files reject silently (graceful no-op).
//  • A mute toggle pauses/resumes everything and persists to localStorage.
// ─────────────────────────────────────────────────────────────────────────────

export type SoundName = 'reveal' | 'chestOpen' | 'haki' | 'sail' | 'success' | 'select';

// URL-encode the spaces in the user-provided filenames.
const MUSIC_SRC = '/sound/One%20Piece%20OST%20Overtaken.mp3';
const MUSIC_VOLUME = 0.32;

const SFX: Record<SoundName, { src: string; volume: number }> = {
  reveal: { src: '/sound/Observation%20Haki.mp3', volume: 0.85 },
  // The rest are optional slots — drop files into /public/audio/ to enable.
  chestOpen: { src: '/audio/chest-open.mp3', volume: 0.6 },
  haki: { src: '/audio/haki.mp3', volume: 0.5 },
  sail: { src: '/audio/sail.mp3', volume: 0.45 },
  success: { src: '/audio/success.mp3', volume: 0.6 },
  select: { src: '/audio/select.mp3', volume: 0.35 },
};

const STORAGE_KEY = 'op-sound-muted';

interface SoundApi {
  muted: boolean;
  toggleMute: () => void;
  setMuted: (m: boolean) => void;
  /** Play a one-shot. No-op when muted or the asset is missing. */
  play: (name: SoundName) => void;
  /** Ensure the background music has started (call from a user gesture). */
  unlock: () => void;
}

const SoundContext = createContext<SoundApi | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  // Sound is ON by default; honour a stored preference.
  const [muted, setMutedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const musicRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);

  const ensureMusic = useCallback(() => {
    if (!musicRef.current) {
      const audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      audio.volume = MUSIC_VOLUME;
      audio.preload = 'auto';
      musicRef.current = audio;
    }
    return musicRef.current;
  }, []);

  const startMusic = useCallback(() => {
    const audio = ensureMusic();
    startedRef.current = true;
    if (muted) return;
    void audio.play().catch(() => {
      /* blocked or file missing — ignore */
    });
  }, [ensureMusic, muted]);

  // Kick the music off on the first user interaction anywhere on the page.
  useEffect(() => {
    const onFirst = () => {
      if (startedRef.current) {
        detach();
        return;
      }
      startMusic();
      detach();
    };
    const detach = () => {
      window.removeEventListener('pointerdown', onFirst);
      window.removeEventListener('keydown', onFirst);
      window.removeEventListener('touchstart', onFirst);
    };
    window.addEventListener('pointerdown', onFirst);
    window.addEventListener('keydown', onFirst);
    window.addEventListener('touchstart', onFirst);
    return detach;
  }, [startMusic]);

  // React to mute changes: pause / resume the music.
  useEffect(() => {
    const audio = musicRef.current;
    if (!audio) return;
    if (muted) {
      audio.pause();
    } else if (startedRef.current) {
      void audio.play().catch(() => {});
    }
  }, [muted]);

  // Stop music when the provider unmounts (StrictMode-safe).
  useEffect(
    () => () => {
      try {
        musicRef.current?.pause();
      } catch {
        /* ignore */
      }
    },
    [],
  );

  const play = useCallback(
    (name: SoundName) => {
      if (muted) return;
      const cfg = SFX[name];
      if (!cfg) return;
      try {
        const audio = new Audio(cfg.src);
        audio.volume = cfg.volume;
        void audio.play().catch(() => {
          /* missing file — graceful no-op */
        });
      } catch {
        /* ignore */
      }
    },
    [muted],
  );

  const unlock = useCallback(() => {
    if (!startedRef.current) startMusic();
  }, [startMusic]);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    try {
      localStorage.setItem(STORAGE_KEY, m ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, []);

  const toggleMute = useCallback(() => setMuted(!muted), [muted, setMuted]);

  const api = useMemo<SoundApi>(
    () => ({ muted, toggleMute, setMuted, play, unlock }),
    [muted, toggleMute, setMuted, play, unlock],
  );

  return <SoundContext.Provider value={api}>{children}</SoundContext.Provider>;
}

export function useSound(): SoundApi {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within <SoundProvider>');
  return ctx;
}
