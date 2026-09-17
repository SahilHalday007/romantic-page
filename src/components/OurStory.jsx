import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import SectionLabel from './SectionLabel.jsx';

function MicroGame({ onDone }) {
  const [picked, setPicked] = useState(null);

  const choose = () => {
    if (picked) return;
    setPicked(Math.random() < 0.5 ? 'you' : 'me');
    window.setTimeout(onDone, 2600);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-muted">
        your move
      </p>
      <div className="flex w-full max-w-[260px] gap-3">
        <button
          type="button"
          data-interactive
          onClick={choose}
          disabled={!!picked}
          className="press flex-1 rounded-xl border border-blush/15 bg-wine/40 py-3 text-sm tracking-[0.15em] text-cream/80 transition-colors hover:border-gold/40"
        >
          rock
        </button>
        <button
          type="button"
          data-interactive
          onClick={choose}
          disabled={!!picked}
          className="press flex-1 rounded-xl border border-blush/15 bg-wine/40 py-3 text-sm tracking-[0.15em] text-cream/80 transition-colors hover:border-gold/40"
        >
          paper
        </button>
        <button
          type="button"
          data-interactive
          onClick={choose}
          disabled={!!picked}
          className="press flex-1 rounded-xl border border-blush/15 bg-wine/40 py-3 text-sm tracking-[0.15em] text-cream/80 transition-colors hover:border-gold/40"
        >
          scissors
        </button>
      </div>
      <AnimatePresence mode="wait">
        {picked && (
          <motion.p
            key={picked}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="text-sm italic text-muted"
          >
            {picked === 'you' ? "you win… or wait, did I?" : 'I win… or maybe you did.'}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function OurStory() {
  const reduced = useReducedMotion();
  const [openIndex, setOpenIndex] = useState(null);
  const [microDone, setMicroDone] = useState(false);

  const dur = reduced ? 0.2 : 0.6;

  const toggle = (i, key) => {
    const willOpen = openIndex !== i;
    setOpenIndex(willOpen ? i : null);
    if (willOpen && key === 'games') setMicroDone(false);
  };

  return (
    <section
      aria-label="Our story"
      className="stage-mid px-6 py-32 md:py-48"
    >
      <div className="mx-auto max-w-[42rem]">
        <SectionLabel>{content.storyLabel}</SectionLabel>

        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className="mt-12 text-center font-display text-[clamp(1.6rem,4vw,2.4rem)] font-light italic leading-snug text-cream"
        >
          {content.storyTitleLine}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-muted"
        >
          {content.storyHint}
        </motion.p>

        <div className="relative mt-16 md:mt-24" aria-label="Timeline">
          <div
            aria-hidden="true"
            className="absolute bottom-10 left-5 top-2 w-px bg-gold/15 md:bottom-8 md:left-1/2 md:-translate-x-1/2"
          />

          {content.timeline.map((item, i) => {
            const side = i % 2; // 0 = left, 1 = right (desktop)
            const isOpen = openIndex === i;
            const isGame = isOpen && item.key === 'games' && !microDone;

            return (
              <div
                key={item.key}
                className="relative mb-10 pl-16 md:mb-9 md:grid md:grid-cols-[1fr_auto_1fr] md:items-start md:gap-10 md:pl-0"
              >
                {/* Node */}
                <button
                  type="button"
                  data-interactive
                  aria-expanded={isOpen}
                  aria-label={item.label}
                  onClick={() => toggle(i, item.key)}
                  className="absolute left-0 top-1 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full focus-visible:z-20 focus-visible:outline-none md:static md:order-2 md:h-9 md:w-9 md:translate-x-0 md:pt-1.5"
                >
                  <motion.span
                    aria-hidden="true"
                    className="relative block h-2.5 w-2.5 rounded-full transition-all"
                    animate={
                      isOpen
                        ? { background: '#D4A574', boxShadow: '0 0 12px rgba(212,165,116,0.7)' }
                        : { background: 'rgba(212,165,116,0.4)', boxShadow: '0 0 0 rgba(0,0,0,0)' }
                    }
                    transition={{ duration: 0.3 }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute h-8 w-8 rounded-full"
                    style={{
                      opacity: isOpen ? 0.14 : 0,
                      background: 'radial-gradient(circle, #D4A574, transparent 70%)',
                      transition: 'opacity 0.3s ease',
                    }}
                  />
                </button>

                {/* Label + expandable message */}
                <div
                  className={`md:pt-1 ${
                    side === 0 ? 'md:order-1' : 'md:order-3'
                  }`}
                >
                  <button
                    type="button"
                    data-interactive
                    aria-expanded={isOpen}
                    onClick={() => toggle(i, item.key)}
                    className={`group flex w-full items-baseline gap-3 focus-visible:outline-none ${
                      side === 0 ? 'justify-end text-right' : 'justify-start text-left'
                    }`}
                  >
                    <span
                      className={`text-[0.7rem] uppercase leading-relaxed tracking-[0.14em] transition-colors sm:text-xs ${
                        isOpen ? 'text-cream' : 'text-cream/70 group-hover:text-cream'
                      }`}
                    >
                      {item.label}
                    </span>
                    {!isOpen && (
                      <span className="shrink-0 text-[0.6rem] uppercase tracking-[0.2em] text-muted/50">
                        {item.idle}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: dur, ease: EASE }}
                        className="overflow-hidden"
                      >
                        {isGame ? (
                          <div className="mt-4 rounded-xl border border-blush/10 bg-wine/25 px-5 py-5">
                            <MicroGame onDone={() => setMicroDone(true)} />
                          </div>
                        ) : (
                          <div className="mt-4 rounded-xl border border-blush/10 bg-wine/25 px-5 py-4 text-sm leading-relaxed text-cream/85 md:px-6">
                            {item.message}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop spacer */}
                <div
                  className={`hidden md:block md:pt-1 ${
                    side === 0 ? 'md:order-3' : 'md:order-1'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}