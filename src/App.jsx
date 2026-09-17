import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useLenis from './hooks/useLenis.js';
import { EASE } from './utils/motion.js';
import Grain from './components/Grain.jsx';
import Cursor from './components/Cursor.jsx';
import Hero from './components/Hero.jsx';
import Discovery from './components/Discovery.jsx';
import OurStory from './components/OurStory.jsx';
import LateNight from './components/LateNight.jsx';
import WordGarden from './components/WordGarden.jsx';
import Distance from './components/Distance.jsx';
import LetterEnvelope from './components/LetterEnvelope.jsx';
import Letter from './components/Letter.jsx';
import FinalReveal from './components/FinalReveal.jsx';
import Closing from './components/Closing.jsx';

export default function App() {
  useLenis();
  const [letterOpened, setLetterOpened] = useState(false);

  return (
    <>
      <main>
        <Hero />
        <Discovery />
        <OurStory />
        <LateNight />
        <WordGarden />
        <Distance />
        <section
          aria-label="A letter"
          className="stage-wine relative px-6 py-32 md:py-44"
        >
          <div className="mx-auto max-w-[38rem]">
            <AnimatePresence mode="wait">
              {!letterOpened ? (
                <motion.div
                  key="envelope"
                  exit={{ opacity: 0, y: -60, scale: 0.92 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex flex-col items-center"
                >
                  <LetterEnvelope onOpen={() => setLetterOpened(true)} />
                </motion.div>
              ) : (
                <motion.div
                  key="letter"
                  initial={{ opacity: 0, y: 260, scale: 0.55 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 60, damping: 16, mass: 1.1 }}
                  style={{ transformOrigin: '50% 0%' }}
                >
                  <Letter />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
        <FinalReveal />
        <Closing />
      </main>
      <Cursor />
      <Grain />
    </>
  );
}