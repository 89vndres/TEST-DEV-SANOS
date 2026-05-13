/* ══════════════════════════════════════════════════════════
   SANOS Y SALVOS — Design System / Theme Constants
   ══════════════════════════════════════════════════════════ */

export const colors = {
  // Primary palette (green)
  primary:       '#1b4332',
  primaryLight:  '#2d6a4f',
  primaryLighter:'#40916c',
  primaryPale:   '#e8f5e9',
  primaryBg:     '#f0f7f2',

  // Accent
  accent:        '#52b788',
  accentLight:   '#95d5b2',
  accentPale:    '#d8f3dc',

  // Status
  danger:        '#e74c3c',
  dangerLight:   '#fde8e8',
  warning:       '#f39c12',
  warningLight:  '#fef9e7',
  success:       '#2ecc71',
  successLight:  '#eafaf1',
  info:          '#3498db',
  infoLight:     '#ebf5fb',

  // Neutrals
  white:         '#ffffff',
  bg:            '#f9fcf9',
  bgAlt:         '#f0f4f1',
  border:        '#e0e8e3',
  borderLight:   '#eef3ef',
  textDark:      '#1a2e23',
  text:          '#2c3e35',
  textMuted:     '#6b7f73',
  textLight:     '#8fa399',
  dark:          '#0f2318',
};

export const shadows = {
  sm:   '0 2px 8px rgba(27,67,50,0.06)',
  md:   '0 4px 16px rgba(27,67,50,0.08)',
  lg:   '0 8px 30px rgba(27,67,50,0.10)',
  xl:   '0 12px 40px rgba(27,67,50,0.14)',
  card: '0 4px 20px rgba(27,67,50,0.07)',
};

export const radius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  pill: '50px',
  circle: '50%',
};

export const fonts = {
  body: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  heading: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
};

export const transitions = {
  fast: 'all 0.15s ease',
  normal: 'all 0.25s ease',
  slow: 'all 0.4s ease',
};

/* Reusable style objects */
export const cardStyle = {
  backgroundColor: colors.white,
  borderRadius: radius.xl,
  boxShadow: shadows.card,
  border: `1px solid ${colors.borderLight}`,
  padding: '24px',
};

export const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: radius.md,
  border: `1.5px solid ${colors.border}`,
  fontSize: '0.95rem',
  backgroundColor: colors.white,
  color: colors.text,
  outline: 'none',
  transition: transitions.fast,
  boxSizing: 'border-box',
  fontFamily: fonts.body,
};

export const btnPrimary = {
  padding: '12px 28px',
  backgroundColor: colors.primary,
  color: colors.white,
  textDecoration: 'none',
  borderRadius: radius.pill,
  fontWeight: '600',
  fontSize: '0.95rem',
  transition: transitions.normal,
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(27,67,50,0.2)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

export const btnSecondary = {
  ...btnPrimary,
  backgroundColor: colors.white,
  color: colors.primary,
  border: `2px solid ${colors.primary}`,
  boxShadow: 'none',
};

export const btnAccent = {
  ...btnPrimary,
  backgroundColor: colors.accent,
  boxShadow: '0 4px 15px rgba(82,183,136,0.25)',
};

export const pageContainer = {
  minHeight: '100vh',
  backgroundColor: colors.bg,
  fontFamily: fonts.body,
  paddingTop: '80px',
};

export const sectionTitle = {
  color: colors.primary,
  fontSize: '2.2rem',
  fontWeight: '800',
  letterSpacing: '-0.5px',
};

export const sectionSubtitle = {
  color: colors.textMuted,
  fontSize: '1.05rem',
  lineHeight: '1.6',
  maxWidth: '600px',
  margin: '0 auto',
};
