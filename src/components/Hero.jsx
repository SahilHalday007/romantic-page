import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';

const HEART_PATH =
  'M 50 86 C 22 62, 4 44, 4 28 C 4 15, 14 5, 27 5 C 36 5, 45 10, 50 18 C 55 10, 64 5, 73 5 C 86 5, 96 15, 96 28 C 96 44, 78 62, 50 86 Z';

function TapBurst({ seed }) {
  const reduced = useReducedMotion();
  if (seed === 0 || reduced) return null;
  const parts = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return { angle, d: 26 + Math.random() * 22 };
  });
  return (
    <span aria-hidden="true" className="pointer-events-none absolute inset-0">
      {parts.map((p, i) => (
        <motion.span
          key={`${seed}-${i}`}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
          animate={{
            x: Math.cos(p.angle) * p.d,
            y: Math.sin(p.angle) * p.d,
            opacity: 0,
            scale: 1,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute left-1/2 top-1/2"
          style={{ marginLeft: -6.5, marginTop: -6.5 }}
        >
          <svg width="13" height="13" viewBox="0 0 100 100">
            <path d={HEART_PATH} fill={i % 2 ? '#F4C8C8' : '#D4A574'} />
          </svg>
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const heroRef = useRef(null);
  const [taps, setTaps] = useState(0);

  const MAX = 5;
  const done = taps >= MAX;
  const dur = reduced ? 0.2 : 1.1;

  /* fade + lift the whole stage as she scrolls past it */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const stageOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  const scrollNext = () => {
    const next = heroRef.current?.nextElementSibling;
    if (!next) return;
    if (window.__lenis) window.__lenis.scrollTo(next, { duration: 1.6, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    else next.scrollIntoView({ behavior: 'smooth' });
  };

  const tapHeart = () => {
    if (done) return;
    setTaps((t) => Math.min(t + 1, MAX));
  };

  const currentCompliment =
    taps > 0 && !done ? content.beautyCompliments[taps - 1] : null;

  return (
    <section
      ref={heroRef}
      aria-label="Opening"
      className="stage-opening relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(55% 40% at 50% 62%, rgba(212, 165, 116, 0.07), transparent 70%)',
        }}
      />

      <motion.div
        style={{ opacity: stageOpacity, y: stageY }}
        className="relative flex flex-col items-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, ease: EASE, delay: reduced ? 0 : 0.4 }}
          className="text-center text-xs uppercase tracking-[0.35em] text-muted"
        >
          for {content.herName}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, ease: EASE, delay: reduced ? 0.1 : 0.9 }}
          className="mt-7 text-center font-display text-[clamp(1.5rem,4vw,2.6rem)] font-light italic tracking-[-0.01em] text-cream"
        >
          {content.openingLine}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur, delay: reduced ? 0.2 : 1.5 }}
          className="mt-3 text-center text-sm text-muted"
        >
          {content.heartHint}
        </motion.p>

        {/* The heart */}
        <motion.button
          type="button"
          data-interactive
          aria-label="A small heart. Tap it a few times."
          aria-describedby={done ? 'hero-final' : 'hero-compliment'}
          onClick={tapHeart}
          whileTap={!reduced ? { scale: 0.86 } : undefined}
          className="press relative mt-12 flex h-32 w-32 items-center justify-center rounded-full focus-visible:outline-none"
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            animate={
              reduced
                ? { opacity: 0.25 }
                : { opacity: [0.2, 0.42, 0.2], scale: [1, 1.18, 1] }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }
            }
            style={{
              background:
                'radial-gradient(circle, rgba(244,200,200,0.4), rgba(212,165,116,0.16) 46%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />

          <TapBurst seed={taps} />

          <motion.span
            aria-hidden="true"
            key={taps}
            initial={reduced ? { scale: 1 } : { scale: 1 }}
            animate={
              reduced ? { scale: 1 } : { scale: [1, 1.22, 1], rotate: [0, -5, 5, 0] }
            }
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="relative block"
          >
            <svg
              width="78"
              height="78"
              viewBox="0 0 100 100"
              role="presentation"
              style={{
                filter: 'drop-shadow(0 0 18px rgba(244,200,200,0.55)) drop-shadow(0 0 44px rgba(212,165,116,0.3))',
              }}
            >
              <defs>
                <linearGradient id="hero-heart" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#FDF6F0" />
                  <stop offset="35%" stopColor="#F4C8C8" />
                  <stop offset="100%" stopColor="#D4A574" />
                </linearGradient>
              </defs>
              <path d={HEART_PATH} fill="url(#hero-heart)" />
              <ellipse
                cx="34" cy="24" rx="10" ry="6"
                fill="rgba(253,246,240,0.55)"
                transform="rotate(-22 34 24)"
              />
            </svg>
          </motion.span>
        </motion.button>

        {/* Compliment / final line */}
        <div
          id="hero-compliment"
          className="mt-10 flex min-h-[4.5rem] w-full max-w-[46ch] items-start justify-center text-center"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {!done ? (
              currentCompliment && (
                <motion.p
                  key={taps}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="font-display text-[clamp(1.05rem,2.2vw,1.4rem)] font-light italic leading-relaxed text-cream/90"
                >
                  {currentCompliment}
                </motion.p>
              )
            ) : (
              <motion.p
                key="final"
                id="hero-final"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE }}
                className="font-display text-[clamp(1.15rem,2.6vw,1.65rem)] font-light italic leading-relaxed text-blush"
              >
                {content.beautyFinal}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: stageOpacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.button
          type="button"
          aria-label={content.scrollDown}
          onClick={scrollNext}
          initial={{ opacity: 0 }}
          animate={{ opacity: done ? 1 : 0 }}
          transition={{ duration: 0.8, delay: reduced ? 0 : 0.4 }}
          className="flex flex-col items-center gap-2 rounded-full px-6 py-2 focus-visible:outline-none"
        >
          <span className="relative h-10 w-px bg-gold/40">
            <span className="cue-dot absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-gold" />
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.3em] text-muted">
            {content.scrollDown}
          </span>
        </motion.button>
      </motion.div>

      <div className="vignette pointer-events-none absolute inset-0 z-[5]" />
    </section>
  );
}