import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import SectionLabel from './SectionLabel.jsx';

const SHAPES = [
  { d: 'M 20 0 C 38 0, 40 16, 20 32 C 0 16, 2 0, 20 0Z', letter: 'N', ok: true, order: 0 },
  { d: 'M 0 16 Q 20 -6, 40 16 Q 20 38, 0 16Z', letter: 'W', ok: false },
  { d: 'M 20 0 C 32 0, 40 12, 40 22 C 40 34, 28 40, 20 40 C 12 40, 0 34, 0 22 C 0 12, 8 0, 20 0Z', letter: 'I', ok: true, order: 1 },
  { d: 'M 20 0 C 36 0, 40 10, 40 20 L 40 22 C 32 38, 22 40, 20 40 C 18 40, 8 38, 0 22 L 0 20 C 0 10, 4 0, 20 0Z', letter: 'R', ok: false },
  { d: 'M 0 20 L 18 0 L 40 20 L 18 40Z', letter: 'G', ok: true, order: 2 },
  { d: 'M 20 0 L 40 20 L 20 40 L 0 20Z', letter: 'H', ok: true, order: 3 },
  { d: 'M 12 0 L 28 0 L 40 28 L 20 40 L 0 28Z', letter: 'T', ok: true, order: 4 },
];

const ORDER = content.discoveryWord.split('');
const TOTAL = SHAPES.filter((s) => s.ok).length;

export default function Discovery() {
  const reduced = useReducedMotion();
  const [flipped, setFlipped] = useState(() => new Set());
  const [found, setFound] = useState(() => new Set());
  const [done, setDone] = useState(false);
  const lastTap = useRef(0);

  const dur = reduced ? 0.2 : 0.6;

  const tapShape = (i) => {
    if (done || flipped.has(i)) return;
    const now = Date.now();
    if (now - lastTap.current < 250) return;
    lastTap.current = now;

    const nextFlipped = new Set(flipped);
    nextFlipped.add(i);
    setFlipped(nextFlipped);

    if (!SHAPES[i].ok) return;

    const nextFound = new Set(found);
    nextFound.add(i);
    setFound(nextFound);
    if (nextFound.size === TOTAL) {
      window.setTimeout(() => setDone(true), reduced ? 250 : 1000);
    }
  };

  return (
    <section
      aria-label="Discovery"
      className="stage-early relative overflow-hidden px-6 py-24 md:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(50% 35% at 50% 50%, rgba(212, 165, 116, 0.05), transparent 65%)',
        }}
      />

      <div className="relative mx-auto max-w-[620px] text-center">
        <SectionLabel>{content.discoveryLabel}</SectionLabel>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="mt-10 text-sm leading-relaxed text-muted"
        >
          {content.discoveryHint}
        </motion.p>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key="game"
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              {/* Word slots fill in as letters are found */}
              <div
                aria-live="polite"
                aria-label={
                  found.size
                    ? `${found.size} of ${TOTAL} letters found`
                    : content.discoveryWord
                }
                className="mt-12 flex justify-center gap-[0.55em] sm:gap-[0.7em]"
              >
                {ORDER.map((ch, idx) => {
                  const shapeIdx = SHAPES.findIndex(
                    (s) => s.ok && s.order === idx
                  );
                  const revealed = found.has(shapeIdx);
                  return (
                    <div
                      key={ch + idx}
                      aria-hidden="true"
                      className="flex h-12 w-8 items-end justify-center border-b-2 sm:h-16 sm:w-11"
                      style={{
                        borderColor: revealed
                          ? 'rgba(212, 165, 116, 0.55)'
                          : 'rgba(184, 160, 168, 0.25)',
                        background: revealed
                          ? 'radial-gradient(circle, rgba(212,165,116,0.1), transparent 70%)'
                          : 'transparent',
                        transition: 'border-color 0.4s ease, background 0.4s ease',
                      }}
                    >
                      <AnimatePresence>
                        {revealed && (
                          <motion.span
                            initial={{ opacity: 0, y: 16, scale: 0.6 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="font-display text-3xl font-light leading-none text-gold sm:text-5xl"
                          >
                            {ch}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Shape tiles */}
              <div
                role="group"
                aria-label="Hidden shape tiles"
                className="mx-auto mt-12 flex max-w-[340px] flex-wrap items-center justify-center gap-3 sm:max-w-none sm:gap-4"
              >
                {SHAPES.map((shape, i) => {
                  const isFlipped = flipped.has(i);
                  const isFound = found.has(i);
                  const isDecoy = !shape.ok;
                  return (
                    <motion.button
                      key={i}
                      type="button"
                      data-interactive
                      aria-label={
                        isFound
                          ? `Letter ${shape.letter}`
                          : isDecoy
                          ? 'Not one of them'
                          : 'A hidden letter'
                      }
                      onClick={() => tapShape(i)}
                      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.7 }}
                      whileInView={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: 0.55,
                        delay: reduced ? i * 0.06 : i * 0.09,
                        ease: EASE,
                      }}
                      whileTap={!reduced ? { scale: 0.88 } : undefined}
                      className="relative flex h-14 w-14 items-center justify-center rounded-full focus-visible:z-10 focus-visible:outline-none sm:h-16 sm:w-16"
                      style={{
                        background: isFound
                          ? 'radial-gradient(circle, rgba(244,200,200,0.12), rgba(42,27,46,0.4) 70%)'
                          : isFlipped && isDecoy
                          ? 'radial-gradient(circle, rgba(184,160,168,0.08), rgba(42,27,46,0.35) 70%)'
                          : 'radial-gradient(circle, rgba(61,36,56,0.4), rgba(42,27,46,0.5) 75%)',
                        boxShadow: isFound
                          ? '0 0 0 1px rgba(212,165,116,0.4), 0 10px 30px -12px rgba(212,165,116,0.35)'
                          : '0 0 0 1px rgba(184,160,168,0.14)',
                        border: isFlipped ? '1px solid rgba(212,165,116,0.3)' : 'none',
                      }}
                    >
                      <svg
                        width="34"
                        height="34"
                        viewBox="0 0 40 40"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d={shape.d}
                          fill={
                            isFound
                              ? 'rgba(244, 200, 200, 0.55)'
                              : isFlipped
                              ? 'rgba(184, 160, 168, 0.22)'
                              : 'rgba(184, 160, 168, 0.1)'
                          }
                          stroke={
                            isFound
                              ? '#D4A574'
                              : isFlipped
                              ? 'rgba(212, 165, 116, 0.35)'
                              : 'rgba(184, 160, 168, 0.25)'
                          }
                          strokeWidth="1.2"
                        />
                      </svg>

                      <AnimatePresence>
                        {isFlipped && (
                          <motion.span
                            aria-hidden="true"
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{
                              opacity: isFound ? 1 : isDecoy ? 0.4 : 1,
                              scale: 1,
                            }}
                            exit={{ opacity: 0, scale: 0.3 }}
                            transition={{ duration: 0.4, ease: EASE }}
                            className={`absolute font-display text-xl font-light leading-none sm:text-2xl ${
                              isFound ? 'text-gold' : 'text-muted/50'
                            }`}
                          >
                            {shape.letter}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {!reduced && isFlipped && isDecoy && (
                        <motion.span
                          aria-hidden="true"
                          initial={{ x: 0 }}
                          animate={{ x: [0, -4, 4, -2, 2, 0] }}
                          transition={{ duration: 0.5 }}
                          className="absolute inset-0 rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <p className="mt-10 text-[0.65rem] uppercase tracking-[0.3em] text-muted/70">
                {found.size} of {TOTAL} letters found
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1 },
              }}
              transition={{ duration: 0.8, ease: EASE }}
              className="mt-14"
            >
              <motion.div
                initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, ease: EASE }}
                className="flex justify-center gap-[0.14em]"
                aria-label={content.discoveryWord}
              >
                {ORDER.map((ch, i) => (
                  <span
                    key={i}
                    className="font-display font-light leading-none tracking-[0.02em] text-cream text-[clamp(2.4rem,10vw,4.6rem)]"
                  >
                    {ch}
                  </span>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, ease: EASE, delay: reduced ? 0 : 0.5 }}
                className="mx-auto mt-8 h-px w-16 bg-gold/30"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.1, ease: EASE, delay: reduced ? 0.2 : 0.8 }}
                className="mx-auto mt-8 max-w-[54ch] text-center text-[clamp(0.95rem,1.8vw,1.15rem)] leading-relaxed text-cream/90"
              >
                {content.discoveryLine}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}