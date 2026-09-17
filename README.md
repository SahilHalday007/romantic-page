# For Her

An immersive interactive love experience — not a scrolling page, but a small journey made for one person.

## Install and run

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deploying to Vercel

1. Push this repo to GitHub/GitLab.
2. In Vercel, **Add New Project** → import the repo.
3. Framework: **Vite** (auto-detected).
4. Build: `npm run build`, output: `dist`.
5. Deploy. No environment variables needed.

## Editing the content

All editable copy lives in `src/data/content.js`.

```js
export const content = {
  herName: '[HER NAME]',
  myName: '[YOUR NAME]',

  openingLine: 'I made something for you.',
  openingHint: "Don't rush.",

  // Discovery word puzzle
  discoveryWord: 'NIGHT',
  discoveryLine: 'Because somehow...',

  // Timeline milestones
  timeline: [
    { key: 'tiktok', label: 'TikTok', message: '...' },
    // ...
  ],

  // Conversation fragments for the late-night section
  lateNightFragments: ['one more game?', 'still awake?', ...],

  // Things you love — each with a label and message
  thingsILove: [
    { label: 'your laugh', message: '...' },
    // ...
  ],

  // The letter paragraphs
  letterParagraphs: ['...', '...', ...],

  // Final reveal words
  finalLine: 'I LOVE YOU.',
  finalSub: 'fully, sincerely, already.',
};
```

## Changing colors

Colors are defined as CSS variables inside `src/index.css`:

```css
@theme {
  --color-ink: #1a0f1f;
  --color-plum: #2a1b2e;
  --color-wine: #3d2438;
  --color-blush: #f4c8c8;
  --color-gold: #d4a574;
  --color-cream: #fdf6f0;
  --color-muted: #b8a0a8;
}
```

Change a color once and every Tailwind utility (`bg-plum`, `text-gold`, etc.) updates site-wide. Fonts are loaded in `index.html` — edit the Google Fonts link and the `--font-*` tokens together.

## Changing typography

Fonts are loaded in `index.html` via Google Fonts. The current typefaces are **Cormorant Garamond** (display) and **Inter** (body). To swap:

1. Update the `<link>` in `index.html`.
2. Update `--font-display` and `--font-body` in `index.css`.

## Animation settings

One easing curve is shared everywhere:

```js
// src/utils/motion.js
export const EASE = [0.16, 1, 0.3, 1];
```

To slow down all motion, change this value. Each component also checks `useReducedMotion()` — when the OS prefers reduced motion, all motion collapses to short opacity fades.

## Reduced motion

`useReducedMotion()` listens to `prefers-reduced-motion: reduce`. When active:

- Lenis smooth scrolling is disabled
- GSAP scroll-scrub animations are replaced with simple reveals
- The particle canvas is hidden
- Drifting backgrounds stop
- All interactions remain fully functional

## Mobile interaction notes

- Every hover interaction has a tap equivalent.
- The cursor component is automatically disabled on touch devices.
- The distance drag section works via pointer events (touch and mouse).
- Pinned sections are disabled when the viewport is too small.
- Envelope and timeline interactions are tap-based.

## File structure

```
src/
  App.jsx                 Main composition
  index.css               Theme + section gradients
  main.jsx                Entry point
  data/content.js         All editable copy
  utils/motion.js         Shared easing + variants
  hooks/
    useLenis.js           Smooth scroll
    useReducedMotion.js   OS motion preference
    useMediaQuery.js      Responsive breakpoint hook
  components/
    Cursor.jsx            Custom cursor (desktop only)
    Grain.jsx             Film grain overlay
    Hero.jsx              Opening — glowing orb
    Discovery.jsx         Word discovery puzzle
    OurStory.jsx          Interactive timeline
    LateNight.jsx         Midnight conversation lines
    WordGarden.jsx        Floating things I love
    Distance.jsx          Draggable two-point distance
    LetterEnvelope.jsx    Envelope to open
    Letter.jsx            Staged letter reveal
    FinalReveal.jsx       Word-by-word "I love you"
    Closing.jsx           Quiet ending
    Particles.jsx         Canvas particle system
    SectionLabel.jsx      Reusable section label
```

## Tech stack

- React 18 + Vite 5
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion (component motion)
- GSAP + ScrollTrigger (scroll-driven pinned moments)
- Lenis (smooth scroll)
- HTML Canvas (particles)
- SVG (procedural visuals)
