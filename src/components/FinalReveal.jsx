import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import Hearts from './Hearts.jsx';

export default function FinalReveal() {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState(0);
  const [started, setStarted] = useState(false);
  const rootRef = useRef(null);
  const seenRef = useRef(false);

  useEffect(() => {
    if (seenRef.current) return;
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !seenRef.current) {
          seenRef.current = true;
          setStarted(true);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const timers = [
      window.setTimeout(() => setPhase(1), reduced ? 400 : 1000),
      window.setTimeout(() => setPhase(2), reduced ? 700 : 3600),
      window.setTimeout(() => setPhase(3), reduced ? 1000 : 6400),
      window.setTimeout(() => setPhase(4), reduced ? 1300 : 8800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [started, reduced]);

  const dur = reduced ? 0.2 : 0.9;
  const beforeWords = content.finalBefore;
  const beforeWords2 = content.finalBeforeSecond;

  return (
    <section
      ref={rootRef}
      aria-label="The final reveal"
      className="stage-warm relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-[2000ms]"
        style={{
          background: phase >= 3
            ? 'radial-gradient(80% 60% at 50% 50%, rgba(212, 165, 116, 0.12), transparent 65%)'
            : 'none',
          opacity: phase >= 3 ? 1 : 0,
        }}
      />

      <AnimatePresence>
        {phase >= 3 && <Hearts key="hearts" />}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="text-center text-sm uppercase tracking-[0.35em] text-muted"
          >
            {content.finalHint}
          </motion.p>
        )}

        {phase === 1 && (
          <motion.div
            key="before1"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduced ? 0 : 0.16, delayChildren: 0.1 } },
            }}
            className="flex flex-wrap justify-center gap-x-[0.35em] gap-y-2"
          >
            {beforeWords.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: dur, ease: EASE } },
                }}
                className="inline-block font-display text-[clamp(1.2rem,3vw,1.6rem)] font-light italic text-cream/80"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div
            key="before2"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduced ? 0 : 0.14, delayChildren: 0.1 } },
            }}
            className="flex flex-wrap justify-center gap-x-[0.35em] gap-y-2"
          >
            {beforeWords2.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  show: { opacity: 1, y: 0, transition: { duration: dur, ease: EASE } },
                }}
                className="inline-block font-display text-[clamp(1.2rem,3vw,1.6rem)] font-light italic text-cream/80"
              >
                {word}
              </motion.span>
            ))}
          </motion.div>
        )}

        {phase >= 3 && (
          <motion.div
            key="final"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: {
                transition: { staggerChildren: reduced ? 0 : 0.22, delayChildren: 0.2 },
              },
            }}
            className="flex flex-col items-center"
          >
            <motion.span
              variants={{
                hidden: { opacity: 0, scale: 0.65, filter: 'blur(12px)' },
                show: {
                  opacity: 1,
                  scale: 1,
                  filter: 'blur(0px)',
                  transition: { duration: reduced ? 0.2 : 1.6, ease: EASE },
                },
              }}
              className="w-full text-center text-balance font-display font-light leading-[1.1] tracking-[-0.02em] text-cream text-[clamp(2.5rem,11vw,8.5rem)]"
            >
              {content.finalLine}
            </motion.span>

            {phase === 4 && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.1, ease: EASE }}
                className="mt-6 text-sm text-muted"
              >
                {content.finalSub}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}