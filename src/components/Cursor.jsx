import { useEffect, useRef, useState } from 'react';
import useMediaQuery from '../hooks/useMediaQuery.js';
import useReducedMotion from '../hooks/useReducedMotion.js';

export default function Cursor() {
  const fine = useMediaQuery('(pointer: fine)');
  const reduced = useReducedMotion();
  const [dot, setDot] = useState({ x: -100, y: -100 });
  const [state, setState] = useState('idle');
  const [clicked, setClicked] = useState(false);
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!fine || reduced) return;

    document.documentElement.classList.add('custom-cursor');

    let targetX = -100;
    let targetY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;

    const onMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setDot({ x: targetX, y: targetY });
      const el = e.target.closest('button, a, [data-interactive]');
      setState(el ? 'hover' : 'idle');
    };

    const onDown = () => {
      setClicked(true);
      window.setTimeout(() => setClicked(false), 350);
    };

    const loop = () => {
      ringX += (targetX - ringX) * 0.16;
      ringY += (targetY - ringY) * 0.16;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove('custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;

  const idle = state === 'idle';

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold transition-opacity duration-300"
        style={{
          transform: `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%)`,
          opacity: dot.x < 0 ? 0 : 1,
          scale: clicked ? 0.4 : 1,
        }}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[90] h-10 w-10 rounded-full border border-gold/50 transition-[opacity,scale,border-color] duration-300"
        style={{
          opacity: dot.x < 0 ? 0 : idle ? 0 : 1,
          scale: idle ? 1 : clicked ? 1.3 : 1.15,
        }}
      />
    </>
  );
}