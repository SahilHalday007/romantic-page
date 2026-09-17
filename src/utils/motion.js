export const EASE = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
};

export const fadeOnly = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

export const revealProps = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.35 },
};

export const staggerProps = {
  initial: 'hidden',
  whileInView: 'show',
  viewport: { once: true, amount: 0.25 },
};