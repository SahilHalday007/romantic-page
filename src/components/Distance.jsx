import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import SectionLabel from './SectionLabel.jsx';

export default function Distance() {
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const startY = useRef(0);

  const MESSAGES = content.distanceMessages;
  const msgCount = Math.min(
    MESSAGES.length,
    Math.floor(progress * (MESSAGES.length + 1))
  );
  const activeMsgs = MESSAGES.slice(0, msgCount);

  const dur = reduced ? 0.2 : 0.7;

  /* gentle reset after completing */
  useEffect(() => {
    if (!done || dragging) return;
    const t = window.setTimeout(() => {
      setProgress(0);
      setDone(false);
    }, 7000);
    return () => clearTimeout(t);
  }, [done, dragging]);

  const handlePointerDown = useCallback((e) => {
    setDragging(true);
    startY.current = e.clientY;
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging || done) return;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      const delta = startY.current - e.clientY;
      const progress01 = Math.max(0, Math.min(1, delta / (rect.height * 0.32)));
      setProgress(progress01);
      if (progress01 > 0.94) setDone(true);
    },
    [dragging, done]
  );

  const handlePointerUp = useCallback(() => {
    setDragging(false);
    if (!done) setProgress(0);
  }, [done]);

  /* positions (percentage-based y, SVG viewBox units × 4) */
  const topPct = 50 - (1 - progress) * 36;
  const bottomPct = 50 + (1 - progress) * 36;
  const topCy = topPct * 4;
  const bottomCy = bottomPct * 4;
  const lineOpacity = 0.15 + progress * 0.5;
  const lineW = 0.6 + progress * 1.8;

  return (
    <section
      aria-label="Distance"
      className="stage-mid relative flex flex-col items-center overflow-hidden px-6 py-32 md:py-48"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 40% at 50% 50%, rgba(212, 165, 116, ${0.02 + progress * 0.04}), transparent 65%)`,
        }}
      />

      <SectionLabel>{content.distanceLabel}</SectionLabel>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="mt-12 mb-4 text-center font-display text-[clamp(1.8rem,5vw,3rem)] font-light italic text-cream"
      >
        {content.distanceTitle}
      </motion.h2>

      <div
        ref={wrapRef}
        className="relative mx-auto w-full max-w-[480px]"
        style={{ height: 340 }}
        role="group"
        aria-label={content.distanceHint}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 200 400"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient id="dg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F4C8C8" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#D4A574" stopOpacity="0.65" />
            </linearGradient>
          </defs>

          <line
            x1="100" y1={topCy} x2="100" y2={bottomCy}
            stroke="url(#dg)"
            strokeWidth={lineW}
            opacity={lineOpacity}
            strokeLinecap="round"
          />

          {/* Her point (top) */}
          <g style={{ transition: dragging ? 'none' : 'opacity 0.6s ease' }} opacity={0.45 + progress * 0.4}>
            <circle cx="100" cy={topCy} r={5.5 + progress * 2} fill="#F4C8C8" />
            <circle cx="100" cy={topCy} r={13 + progress * 4} fill="none" stroke="#F4C8C8" strokeWidth="0.5" opacity={0.25 + progress * 0.15} />
          </g>

          {/* My point (bottom) */}
          <g style={{ transition: dragging ? 'none' : 'opacity 0.6s ease' }} opacity={0.45 + progress * 0.4}>
            <circle cx="100" cy={bottomCy} r={5.5 + progress * 2} fill="#D4A574" />
            <circle cx="100" cy={bottomCy} r={13 + progress * 4} fill="none" stroke="#D4A574" strokeWidth="0.5" opacity={0.25 + progress * 0.15} />
          </g>
        </svg>

        {/* Name labels */}
        <span
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center font-semibold uppercase tracking-[0.3em] text-blush/80"
          style={{ top: `${topPct - 9}%` }}
        >
          {content.herName}
        </span>
        <span
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center font-semibold uppercase tracking-[0.3em] text-gold/80"
          style={{ top: `${bottomPct + 5}%` }}
        >
          {content.myName}
        </span>

        {/* Draggable handle */}
        <button
          type="button"
          data-interactive
          aria-label="Drag upward to bring the two points together"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute left-1/2 -translate-x-1/2 focus-visible:outline-none"
          style={{ top: `${bottomPct - 4.5}%`, transition: dragging ? 'none' : 'top 1s cubic-bezier(0.16,1,0.3,1)' }}
        >
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full">
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full border transition-[border-color] duration-300"
              style={{ borderColor: dragging ? 'rgba(212,165,116,0.7)' : 'rgba(212,165,116,0.3)' }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-2 rounded-full border border-gold/15"
            />
            <span className="relative block h-2.5 w-2.5 rounded-full bg-gold" />
          </span>
        </button>

        <p
          id="dist-hint"
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center text-xs italic tracking-[0.15em] text-muted/80"
          style={{ top: '50%' }}
          aria-live="polite"
        >
          {done ? '' : content.distanceHint}
        </p>
      </div>

      {/* Messages */}
      <div className="relative mt-8 flex flex-col items-center gap-3" aria-live="polite">
        <AnimatePresence>
          {activeMsgs.map((msg) => (
            <motion.p
              key={msg}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: dur, ease: EASE }}
              className="text-sm italic text-muted"
            >
              {msg}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>

      {/* Final lines */}
      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1, ease: EASE, delay: 0.5 }}
            className="mt-8 flex flex-col items-center gap-4 text-center"
            aria-live="polite"
          >
            <p className="font-display text-[clamp(1.1rem,2.5vw,1.4rem)] font-light italic leading-snug text-cream/90">
              {content.distanceHoldStart}
            </p>
            <p className="max-w-[44ch] text-sm text-muted">
              {content.distanceHoldEnd}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}