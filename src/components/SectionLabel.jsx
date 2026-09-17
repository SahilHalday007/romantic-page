import { motion } from 'framer-motion';
import { EASE } from '../utils/motion.js';

export default function SectionLabel({ children, tone = 'muted' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="flex items-center justify-center gap-4"
    >
      <span aria-hidden="true" className="hairline w-8" />
      <span className={`whisper ${tone === 'gold' ? 'text-gold/80' : ''}`}>
        {children}
      </span>
      <span aria-hidden="true" className="hairline w-8" />
    </motion.div>
  );
}