import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import SectionLabel from './SectionLabel.jsx';

const BALL = 84;
const TOUCH = 84;
const HEART_PATH =
  'M 50 86 C 22 62, 4 44, 4 28 C 4 15, 14 5, 27 5 C 36 5, 45 10, 50 18 C 55 10, 64 5, 73 5 C 86 5, 96 15, 96 28 C 96 44, 78 62, 50 86 Z';

export default function LateNight() {
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);
  const youRef = useRef(null);
  const meRef = useRef(null);
  const [you, setYou] = useState(null);
  const [me, setMe] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [done, setDone] = useState(false);
  const [heart, setHeart] = useState(null);
  const [noLetGo, setNoLetGo] = useState(false);
  const noLetGoTimer = useRef(null);

  const home = () => {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect || rect.width < 100 || rect.height < 100) return null;
    const y = rect.height * 0.55;
    return { you: { x: rect.width * 0.24, y }, me: { x: rect.width * 0.76, y } };
  };

  const snapHome = () => {
    const h = home();
    if (!h) return;
    setYou(h.you);
    setMe(h.me);
  };

  useLayoutEffect(() => {
    let raf = 0;
    const settle = () => {
      const h = home();
      if (!h) return false;
      setYou((p) => p ?? h.you);
      setMe((p) => p ?? h.me);
      return true;
    };
    const trySettle = () => {
      if (!settle()) raf = requestAnimationFrame(trySettle);
    };
    trySettle();
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const onResize = () => snapHome();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const settleNoLetGo = () => {
    setNoLetGo(true);
    window.clearTimeout(noLetGoTimer.current);
    noLetGoTimer.current = window.setTimeout(() => setNoLetGo(false), 2800);
  };

  const beginDrag = (who) => (e) => {
    if (done) {
      settleNoLetGo();
      return;
    }
    setDragging(who);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const moveDrag = (who) => (e) => {
    if (dragging !== who || done || !wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const r = BALL / 2;
    const x = Math.max(r, Math.min(rect.width - r, e.clientX - rect.left));
    const y = Math.max(r, Math.min(rect.height - r, e.clientY - rect.top));
    if (who === 'you') setYou({ x, y });
    else setMe({ x, y });

    const otherRef = who === 'you' ? meRef : youRef;
    const other = otherRef.current;
    if (!other) return;
    const br = other.getBoundingClientRect();
    const ox = br.left + br.width / 2 - rect.left;
    const oy = br.top + br.height / 2 - rect.top;
    if (Math.hypot(x - ox, y - oy) < TOUCH) {
      setDone(true);
      setHeart({ x: (x + ox) / 2, y: (y + oy) / 2 });
    }
  };

  const endDrag = (who) => {
    setDragging(null);
    if (done) return;
    snapHome();
  };

  const ballTransition = reduced
    ? 'left 0.25s ease, top 0.25s ease, opacity 0.5s ease, transform 0.5s ease'
    : 'left 0.8s cubic-bezier(0.16,1,0.3,1), top 0.8s cubic-bezier(0.16,1,0.3,1), opacity 0.5s ease, transform 0.5s ease';

  const Ball = ({ who, refEl }) => {
    const pos = who === 'you' ? you : me;
    const isYou = who === 'you';
    const grad = isYou
      ? 'radial-gradient(circle at 32% 28%, #FDF6F0, #D4A574 46%, #a97f52 100%)'
      : 'radial-gradient(circle at 32% 28%, #FDF6F0, #F4C8C8 46%, #d7a0a2 100%)';
    const ring = isYou ? 'rgba(212, 165, 116, 0.5)' : 'rgba(244, 200, 200, 0.5)';
    const dot = isYou ? '#a97f52' : '#d7a0a2';
    const label = isYou ? content.lateNightYours : content.lateNightMine;

    return (
      <button
        ref={refEl}
        type="button"
        data-interactive
        aria-label={`${label} — drag me to the other one`}
        onPointerDown={beginDrag(who)}
        onPointerMove={moveDrag(who)}
        onPointerUp={() => endDrag(who)}
        onPointerCancel={() => endDrag(who)}
        className="absolute z-10 flex touch-none flex-col items-center gap-2 focus-visible:z-20 focus-visible:outline-none"
        style={{
          left: pos?.x ?? '50%',
          top: pos?.y ?? '50%',
          transform: 'translate(-50%, -50%)',
          transition: dragging === who ? 'none' : ballTransition,
          pointerEvents: 'auto',
          cursor: done ? 'default' : 'grab',
        }}
      >
        <span
          aria-hidden="true"
          className="relative block select-none"
          style={{ width: BALL, height: BALL }}
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: grad,
              boxShadow: `0 24px 50px -18px ${ring}, 0 0 0 1px ${ring} inset`,
            }}
          />
          <span
            className="absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-full"
            style={{
              background: dot,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px rgba(253,246,240,0.55)',
            }}
          />
          <span
            className="absolute inset-0 rounded-full opacity-30"
            style={{
              border: `1px dashed ${isYou ? '#D4A574' : '#F4C8C8'}`,
              transform: 'scale(1.12)',
            }}
          />
        </span>
        <span
          className={`text-[0.65rem] uppercase tracking-[0.3em] ${
            isYou ? 'text-gold' : 'text-blush'
          }`}
        >
          {label}
        </span>
      </button>
    );
  };

  return (
    <section
      aria-label="Late nights"
      className="stage-ink relative overflow-hidden px-6 py-28 md:py-36"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(65% 50% at 50% 50%, rgba(212, 165, 116, 0.05), transparent 65%)',
        }}
      />

      <SectionLabel>{content.lateNightLabel}</SectionLabel>

      <p
        aria-live="polite"
        className="mt-12 text-center text-xs uppercase tracking-[0.3em] text-muted/80"
      >
        {done ? content.lateNightDone : content.lateNightHint}
      </p>

      <div
        ref={wrapRef}
        role="group"
        aria-label="Drag you and me together"
        className="relative mx-auto mt-4 w-full max-w-[640px] touch-none select-none"
        style={{ height: 430 }}
      >
        {/* the heart they make — dotted outline wraps both circles, glows from outside */}
        <AnimatePresence>
          {done && heart && (
            <motion.div
              key="heart"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.8 }}
              className="pointer-events-none absolute z-[5]"
              style={{
                left: heart.x,
                top: heart.y,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* soft outer glow behind the dotted lines */}
              <motion.span
                animate={reduced ? {} : { scale: [1, 1.08, 1], opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: 330, height: 330 }}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full" style={{ filter: 'blur(16px)' }}>
                  <path
                    d={HEART_PATH}
                    fill="none"
                    stroke="rgba(244,200,200,0.6)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="2 10"
                    strokeLinejoin="round"
                    style={{ transform: 'scale(1.06)', transformOrigin: 'center' }}
                  />
                </svg>
              </motion.span>
              {/* the dotted heart outline */}
              <motion.span
                animate={reduced ? {} : { scale: [1, 1.04, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative block"
                style={{ transformOrigin: 'center', marginLeft: -145, marginTop: -145 }}
              >
                <svg
                  width="290"
                  height="290"
                  viewBox="0 0 100 100"
                  style={{
                    filter:
                      'drop-shadow(0 0 18px rgba(244,200,200,0.7)) drop-shadow(0 0 50px rgba(212,165,116,0.4))',
                  }}
                >
                  <defs>
                    <linearGradient id="youme-heart" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#F4C8C8" />
                      <stop offset="55%" stopColor="#E8B6B0" />
                      <stop offset="100%" stopColor="#D4A574" />
                    </linearGradient>
                  </defs>
                  <path
                    d={HEART_PATH}
                    fill="none"
                    stroke="url(#youme-heart)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="2 10"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {you && <Ball who="you" refEl={youRef} />}
        {me && <Ball who="me" refEl={meRef} />}
      </div>

      {/* the one-liner that names it */}
      <div
        className="relative z-10 mt-14 text-center"
        aria-live="polite"
        style={{ minHeight: '3.5rem' }}
      >
        <AnimatePresence mode="wait">
          {done && noLetGo ? (
            <motion.p
              key="no-let-go"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mx-auto max-w-[54ch] px-6 text-[clamp(1rem,2vw,1.2rem)] italic leading-relaxed text-blush/90"
            >
              {content.lateNightNoLetGo}
            </motion.p>
          ) : done ? (
            <motion.p
              key="line"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 1, ease: EASE }}
              className="mx-auto max-w-[54ch] px-6 text-[clamp(1rem,2vw,1.2rem)] leading-relaxed text-cream/90"
            >
              {content.lateNightLine}
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="italic text-muted/70"
            >
              …
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}