import { useMemo } from 'react';
import useReducedMotion from '../hooks/useReducedMotion.js';

const HEART_PATH =
  'M 50 86 C 22 62, 4 44, 4 28 C 4 15, 14 5, 27 5 C 36 5, 45 10, 50 18 C 55 10, 64 5, 73 5 C 86 5, 96 15, 96 28 C 96 44, 78 62, 50 86 Z';

export default function Hearts({ count = 18 }) {
  const reduced = useReducedMotion();

  const hearts = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: 2 + Math.random() * 96,
        size: 13 + Math.random() * 17,
        dur: 8 + Math.random() * 10,
        delay: Math.random() * 16,
        opacity: 0.3 + Math.random() * 0.5,
        sway: 6 + Math.random() * 12,
        swayDur: 2.4 + Math.random() * 3.6,
        swayDelay: Math.random() * 3,
        gold: Math.random() < 0.5,
      })),
    [count]
  );

  if (reduced) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="hearts-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F4C8C8" />
            <stop offset="100%" stopColor="#D4A574" />
          </linearGradient>
        </defs>
      </svg>

      {hearts.map((h, i) => (
        <span
          key={i}
          className="heart-rise absolute"
          style={{
            left: `${h.left}%`,
            top: '100%',
            animationDuration: `${h.dur}s`,
            animationDelay: `-${h.delay}s`,
            ['--hop']: h.opacity,
            ['--dur']: `${h.dur}s`,
          }}
        >
          <span
            className="heart-sway"
            style={{
              ['--sway']: `${h.sway}px`,
              ['--sway-dur']: `${h.swayDur}s`,
              animationDelay: `-${h.swayDelay}s`,
            }}
          >
            <svg
              width={h.size}
              height={h.size}
              viewBox="0 0 100 100"
              style={{
                display: 'block',
                filter: 'drop-shadow(0 0 8px rgba(244,200,200,0.55))',
              }}
            >
              <path
                d={HEART_PATH}
                fill={h.gold ? 'url(#hearts-grad)' : '#F4C8C8'}
                opacity={h.gold ? 1 : 0.75}
              />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}