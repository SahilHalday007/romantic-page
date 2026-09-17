import { motion } from 'framer-motion';
import { content } from '../data/content.js';
import { EASE } from '../utils/motion.js';
import useReducedMotion from '../hooks/useReducedMotion.js';

export default function Letter() {
  const reduced = useReducedMotion();
  const dur = reduced ? 0.2 : 0.9;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduced ? 0.12 : 0.22, delayChildren: 0.2 } },
      }}
      className="mx-auto max-w-[38rem] pb-24 md:pb-32"
    >
      {/* The letter, on paper */}
      <motion.div
        variants={{
          hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.98 },
          show: { opacity: 1, y: 0, scale: 1, transition: { duration: 1, ease: EASE } },
        }}
        className="letter-paper relative overflow-hidden rounded-[26px] border border-[rgba(180,130,90,0.45)] px-5 py-11 sm:px-10 md:px-14 md:py-16"
      >
        {/* warm inner light + faint watermark heart */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-56 w-80 -translate-x-1/2 rounded-full bg-[#e8c49b] opacity-20 blur-3xl"
        />
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
        >
          <path
            d="M 50 86 C 22 62, 4 44, 4 28 C 4 15, 14 5, 27 5 C 36 5, 45 10, 50 18 C 55 10, 64 5, 73 5 C 86 5, 96 15, 96 28 C 96 44, 78 62, 50 86 Z"
            fill="#3d2438"
          />
        </svg>

        {/* gold thread across the top */}
        <span
          aria-hidden="true"
          className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#c89a6c] to-transparent"
        />

        {/* Heading */}
        <div className="relative flex items-center justify-center gap-4">
          <span aria-hidden="true" className="hairline w-10 bg-[#c89a6c]/60" />
          <p className="text-center text-xs uppercase tracking-[0.35em] text-[#a9714f]">
            {content.letterLabel}
          </p>
          <span aria-hidden="true" className="hairline w-10 bg-[#c89a6c]/60" />
        </div>
        <div className="mx-auto mt-4 flex items-center justify-center gap-2">
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
          <span aria-hidden="true" className="h-px w-12 bg-[#d4a574]/40" />
          <span aria-hidden="true" className="block h-1.5 w-1.5 rounded-full bg-[#d4a574]" />
        </div>

        {/* Paragraphs */}
        <div className="relative mt-9 space-y-6 md:mt-11 md:space-y-7">
          {content.letterParagraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: dur, ease: EASE } },
              }}
              className={`${i === 0 ? 'lead-letter ' : ''}font-display text-[clamp(1.05rem,1.5vw,1.22rem)] font-light leading-[1.95] text-[#463039]`}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Signature */}
        <motion.div
          variants={{
            hidden: reduced ? { opacity: 0 } : { opacity: 0, y: 14 },
            show: { opacity: 1, y: 0, transition: { duration: dur, ease: EASE } },
          }}
          className="relative mt-12 flex flex-col items-end md:mt-14"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-[#8a6a52]">
            {content.letterSignoff}
          </p>
          <p className="mt-2 font-display text-3xl font-light italic tracking-[-0.01em] text-[#3d2438]">
            {content.myName}
          </p>
          <span
            aria-hidden="true"
            className="mt-3 block h-2.5 w-2.5 rounded-full bg-[#d4a574]"
            style={{ boxShadow: '0 0 14px rgba(169,121,79,0.45)' }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}