import { useState } from 'react';
import { motion } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';

const FLAP_CLOSED = 'M 16 56 L 170 116 L 324 56 Z';
const FLAP_OPEN = 'M 16 56 L 170 -70 L 324 56 Z';

export default function LetterEnvelope({ onOpen }) {
  const reduced = useReducedMotion();
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => onOpen(), reduced ? 250 : 1500);
  };

  const dur = reduced ? 0.2 : 0.8;

  return (
    <div className="relative mx-auto flex flex-col items-center">
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        {/* Soft glow behind */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[30%] blur-2xl"
          style={{
            background: 'radial-gradient(circle, rgba(212,165,116,0.14), transparent 70%)',
          }}
        />

        <motion.button
          type="button"
          data-interactive
          onClick={open}
          aria-label={content.envelopeHint}
          disabled={opening}
          whileHover={!reduced && !opening ? { y: -4 } : undefined}
          transition={{ duration: 0.35, ease: EASE }}
          className="relative block focus-visible:outline-none"
        >
          {/* Seal glow (dim until hover) */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-[46%] h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-xl transition-opacity duration-500"
            style={{ opacity: opening ? 0.1 : 0.6 }}
          />

          <svg
            viewBox="0 0 340 240"
            fill="none"
            aria-hidden="true"
            className="h-auto w-full max-w-[340px] sm:max-w-[360px]"
          >
            <defs>
              <linearGradient id="env-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3d2438" />
                <stop offset="100%" stopColor="#2a1b2e" />
              </linearGradient>
              <linearGradient id="env-flap" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#3d2438" />
                <stop offset="100%" stopColor="#4a2c44" />
              </linearGradient>
              <radialGradient id="env-seal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e8c49b" />
                <stop offset="100%" stopColor="#D4A574" />
              </radialGradient>
            </defs>

            {/* Body */}
            <rect
              x="10" y="50" width="320" height="186" rx="8"
              fill="url(#env-body)"
              stroke="rgba(212, 165, 116, 0.3)"
              strokeWidth="1"
            />
            {/* Paper peek (classic V) */}
            <line x1="30" y1="66" x2="170" y2="150" stroke="rgba(253,246,240,0.09)" strokeWidth="0.7" />
            <line x1="310" y1="66" x2="170" y2="150" stroke="rgba(253,246,240,0.09)" strokeWidth="0.7" />
            {/* Fold hints */}
            <path d="M 10 50 L 170 118 L 330 50" stroke="rgba(244,200,200,0.06)" strokeWidth="0.6" fill="none" />

            {/* Flap — morphs open */}
            <motion.path
              d={FLAP_CLOSED}
              fill="url(#env-flap)"
              stroke="rgba(212, 165, 116, 0.32)"
              strokeWidth="1"
              animate={{ d: opening ? FLAP_OPEN : FLAP_CLOSED }}
              transition={{ duration: dur, ease: EASE }}
            />

            {/* The letter, rising out of the envelope */}
            <motion.g
              initial={false}
              animate={
                opening
                  ? { y: 0, opacity: 1 }
                  : { y: 150, opacity: 0 }
              }
              transition={{ duration: dur, ease: EASE, delay: opening ? 0.25 : 0 }}
              style={{ transformOrigin: '170px 236px' }}
            >
              <rect
                x="34" y="120" width="272" height="118" rx="6"
                fill="#FBF3E8"
                stroke="rgba(212, 165, 116, 0.4)"
                strokeWidth="1"
              />
              <line x1="60" y1="148" x2="280" y2="148" stroke="rgba(169,121,79,0.4)" strokeWidth="2" strokeLinecap="round" />
              <line x1="60" y1="168" x2="280" y2="168" stroke="rgba(169,121,79,0.4)" strokeWidth="2" strokeLinecap="round" />
              <line x1="60" y1="188" x2="240" y2="188" stroke="rgba(169,121,79,0.4)" strokeWidth="2" strokeLinecap="round" />
              <line x1="60" y1="208" x2="270" y2="208" stroke="rgba(169,121,79,0.4)" strokeWidth="2" strokeLinecap="round" />
            </motion.g>

            {/* Wax seal */}
            <motion.g
              animate={{ opacity: opening ? 0 : 1, scale: opening ? 0.6 : 1 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ transformOrigin: '170px 116px' }}
            >
              <circle cx="170" cy="116" r="17" fill="url(#env-seal)" stroke="rgba(244,200,200,0.4)" strokeWidth="1" />
              <path d="M 163 116 L 170 109 L 177 116 L 170 123 Z" fill="rgba(253,246,240,0.65)" />
              <path d="M 166 116 L 170 112.5 L 174 116 L 170 119.5 Z" fill="rgba(42,27,46,0.25)" />
            </motion.g>
          </svg>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: reduced ? 0 : 0.4, ease: EASE }}
          className="mt-7 flex items-center justify-center gap-2 text-[0.7rem] uppercase tracking-[0.3em] text-cream/75 md:mt-9"
          aria-live="polite"
        >
          <motion.svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 100 100"
            animate={reduced ? {} : { scale: [1, 1.2, 1] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path
              d="M 50 86 C 22 62, 4 44, 4 28 C 4 15, 14 5, 27 5 C 36 5, 45 10, 50 18 C 55 10, 64 5, 73 5 C 86 5, 96 15, 96 28 C 96 44, 78 62, 50 86 Z"
              fill="#D4A574"
            />
          </motion.svg>
          <span>{opening ? content.envelopeOpening : content.envelopeHint}</span>
        </motion.p>
      </motion.div>
    </div>
  );
}