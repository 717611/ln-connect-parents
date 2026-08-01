/**
 * Brand reference values. Runtime styling always uses the semantic CSS tokens
 * in src/styles.css — this file exists for documentation and non-CSS usages
 * (e.g. chart configs, meta theme-color).
 */
export const BRAND_COLORS = {
  primary: "#FFB000",
  secondary: "#1C2340",
  accent: "#5B7CFA",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  background: "#F8FAFC",
  card: "#FFFFFF",
} as const;

export const MOTION = {
  fast: 0.18,
  base: 0.24,
  slow: 0.32,
  ease: [0.22, 1, 0.36, 1] as const,
  stagger: 0.05,
} as const;

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION.base, ease: MOTION.ease },
} as const;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: MOTION.fast, ease: MOTION.ease },
} as const;

export const scaleIn = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: MOTION.base, ease: MOTION.ease },
} as const;
