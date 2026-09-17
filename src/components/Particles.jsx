import { useEffect, useRef } from 'react';
import useReducedMotion from '../hooks/useReducedMotion.js';

const PALETTE = ['#D4A574', '#F4C8C8'];
const MAX_PARTICLES = 25;

export default function Particles() {
  const ref = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let raf = 0;
    let w = 0;
    let h = 0;
    let t = 0;
    let paused = false;
    const particles = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const spawn = () => {
      const r = 1 + Math.random() * 2;
      return {
        x: Math.random() * w,
        y: h + r,
        r,
        drift: 0.2 + Math.random() * 0.5,
        wobble: 0.5 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
        life: 0,
        ttl: 6 + Math.random() * 6,
        color: PALETTE[Math.random() < 0.6 ? 0 : 1],
      };
    };

    for (let i = 0; i < MAX_PARTICLES; i += 1) particles.push(spawn());

    const step = (dt) => {
      ctx.clearRect(0, 0, w, h);
      t += dt;
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.ttl || p.y < -8) {
          particles[i] = spawn();
          continue;
        }
        p.y -= p.drift * dt * 60;
        const progress = p.life / p.ttl;
        const alpha = Math.pow(1 - Math.abs(progress * 2 - 1), 1.2) * 0.55;
        const x = p.x + Math.sin(t * p.wobble + p.phase) * 18;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 10 + p.r * 3;
        ctx.shadowColor = p.color;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };

    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!paused) step(dt);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      ([entry]) => {
        paused = !entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    raf = requestAnimationFrame(loop);
    window.addEventListener('resize', resize, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, [reduced]);

  if (reduced) return null;
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}