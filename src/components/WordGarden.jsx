import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import SectionLabel from './SectionLabel.jsx';

export default function WordGarden() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(null);
  const dur = reduced ? 0.2 : 0.65;

  return (
    <section
      aria-label="A few things I love"
      className="stage-wine px-6 py-32 md:py-48"
    >
      <div className="mx-auto max-w-[48rem]">
        <SectionLabel>{content.gardenLabel}</SectionLabel>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
          className="mt-10 text-center font-display text-[clamp(1.6rem,4vw,2.2rem)] font-light italic text-cream/90"
        >
          each one means something.
        </motion.p>

        <div
          role="list"
          aria-label="Things I love"
          className="mx-auto mt-16 grid max-w-[520px] grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20"
        >
          {content.thingsILove.map((item, i) => {
            const isOpen = open === i;
            const offsets = [
              '-rotate-[1.2deg]',
              'rotate-[0.8deg]',
              '-rotate-[0.5deg]',
              'rotate-[1.1deg]',
              '-rotate-[0.3deg]',
              'rotate-[0.9deg]',
            ];
            return (
              <motion.div
                key={i}
                role="listitem"
                initial={reduced ? { opacity: 0 } : { opacity: 0, y: 18 }}
                whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  duration: 0.7,
                  delay: reduced ? i * 0.08 : i * 0.12,
                  ease: EASE,
                }}
                className={offsets[i] || ''}
              >
                <button
                  type="button"
                  data-interactive
                  aria-expanded={isOpen}
                  aria-label={item.label}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="press group w-full text-left focus-visible:outline-none"
                >
                  <motion.div
                    className="relative overflow-hidden rounded-2xl border px-7 py-6 transition-colors sm:px-8 sm:py-7"
                    animate={
                      isOpen
                        ? {
                            borderColor: 'rgba(212, 165, 116, 0.3)',
                            background: 'rgba(61, 36, 56, 0.55)',
                            boxShadow:
                              '0 22px 48px -22px rgba(212, 165, 116, 0.22)',
                          }
                        : {
                            borderColor: 'rgba(244, 200, 200, 0.06)',
                            background: 'rgba(42, 27, 46, 0.35)',
                            boxShadow: '0 0 0 0 transparent',
                          }
                    }
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute right-5 top-5 h-1.5 w-1.5 rounded-full transition-colors"
                      style={{
                        background: isOpen
                          ? '#D4A574'
                          : 'rgba(184, 160, 168, 0.2)',
                      }}
                    />
                    <span className="block font-display text-[clamp(1.15rem,2.8vw,1.5rem)] font-light italic leading-snug text-cream transition-colors group-hover:text-blush">
                      {item.label}
                    </span>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: dur, ease: EASE }}
                          className="block overflow-hidden"
                        >
                          <span className="mt-3 block h-px w-8 bg-gold/30" />
                          <span className="mt-3 block text-sm leading-relaxed text-cream/85">
                            {item.message}
                          </span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}