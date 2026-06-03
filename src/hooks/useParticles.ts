import { useEffect, useRef, type RefObject } from 'react';

export interface ParticleOptions {
  /** Hard cap on particle count (area-scaled below this). */
  maxCount?: number;
  /** Cap devicePixelRatio to protect fill-rate on mobile. */
  maxDPR?: number;
  /** Global speed multiplier. */
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  r: number;
  vy: number; // upward px/sec
  drift: number; // horizontal sine amplitude
  phase: number;
  a: number; // alpha
  gold: boolean; // gold treasure dust vs pale sea bubble
}

/**
 * Single-canvas particle field (rising bubbles + treasure dust) driven by one
 * requestAnimationFrame loop. The only JS-animated background layer.
 *
 * Lifecycle guarantees:
 *  - cleanup cancels the rAF (no StrictMode double-loop leak),
 *  - pauses when the tab is hidden or the canvas scrolls offscreen,
 *  - renders a single static frame (no loop) under prefers-reduced-motion,
 *  - DPR-aware + debounced resize.
 */
export function useParticles(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { maxCount = 130, maxDPR = 2, speed = 1 }: ParticleOptions = {},
): void {
  const raf = useRef(0);
  const particles = useRef<Particle[]>([]);
  const size = useRef({ w: 0, h: 0 });
  const running = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
    const rand = (a: number, b: number) => a + Math.random() * (b - a);

    const populate = () => {
      const { w, h } = size.current;
      const count = Math.min(maxCount, Math.round((w * h) / 16000));
      const arr: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const gold = Math.random() < 0.45;
        arr.push({
          x: rand(0, w),
          y: rand(0, h),
          r: gold ? rand(0.6, 1.9) : rand(1.2, 3.4),
          vy: rand(6, 22) * speed,
          drift: rand(8, 28),
          phase: rand(0, Math.PI * 2),
          a: rand(0.15, 0.7),
          gold,
        });
      }
      particles.current = arr;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, maxDPR);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      size.current = { w, h };
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      populate();
    };

    const draw = (dt: number) => {
      const { w, h } = size.current;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles.current) {
        p.y -= p.vy * dt;
        p.phase += dt * 0.8;
        const x = p.x + Math.sin(p.phase) * p.drift;
        if (p.y < -10) {
          p.y = h + rand(4, 50);
          p.x = rand(0, w);
        }
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        if (p.gold) {
          ctx.fillStyle = `rgba(255, 213, 74, ${p.a})`;
          ctx.shadowColor = 'rgba(255,170,40,0.85)';
          ctx.shadowBlur = 6;
        } else {
          ctx.fillStyle = `rgba(190, 230, 255, ${p.a * 0.7})`;
          ctx.shadowColor = 'rgba(160,210,255,0.6)';
          ctx.shadowBlur = 4;
        }
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    let last = 0;
    const frame = (t: number) => {
      if (!running.current) return;
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016;
      last = t;
      draw(dt);
      raf.current = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running.current || reduceMQ.matches) return;
      running.current = true;
      last = 0;
      raf.current = requestAnimationFrame(frame);
    };
    const stop = () => {
      running.current = false;
      cancelAnimationFrame(raf.current);
    };
    const staticFrame = () => {
      resize();
      draw(0);
    };

    // Initial paint.
    resize();
    if (reduceMQ.matches) staticFrame();
    else start();

    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    const onReduceChange = () => {
      stop();
      if (reduceMQ.matches) staticFrame();
      else start();
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        resize();
        if (reduceMQ.matches) staticFrame();
      });
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('resize', onResize);
    reduceMQ.addEventListener?.('change', onReduceChange);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', onResize);
      reduceMQ.removeEventListener?.('change', onReduceChange);
      cancelAnimationFrame(resizeRaf);
    };
  }, [canvasRef, maxCount, maxDPR, speed]);
}
