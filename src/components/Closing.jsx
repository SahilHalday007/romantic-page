import { motion } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';
import Particles from './Particles.jsx';

export default function Closing() {
  const reduced = useReducedMotion();
  const dur = reduced ? 0.2 : 1.2;

  return (
    <section
      aria-label="Closing"
      className="stage-final relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6"
    >
      <Particles />

      <div
        aria-hidden="true"
        className="vignette pointer-events-none absolute inset-0 z-[1]"
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: dur, ease: EASE, delay: 0.2 }}
        className="relative z-10 font-display text-[clamp(2.5rem,6vw,4rem)] font-light italic tracking-[-0.02em] text-cream"
      >
        {content.herName}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: dur, ease: EASE, delay: 0.8 }}
        className="relative z-10 mt-6 max-w-[48ch] text-center text-cream/90"
      >
        {content.closingLine}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: dur, ease: EASE, delay: 1.4 }}
        className="relative z-10 mt-3 text-center text-xs uppercase tracking-[0.3em] text-muted"
      >
        {content.closingHint}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.5, delay: 2 }}
        aria-hidden="true"
        className="relative z-10 mt-12 flex items-center gap-3"
      >
        <span className="block h-1 w-1 rounded-full bg-gold/40" />
        <span className="h-px w-12 bg-gold/20" />
        <span className="block h-1 w-1 rounded-full bg-gold/40" />
      </motion.div>
    </section>
  );
}