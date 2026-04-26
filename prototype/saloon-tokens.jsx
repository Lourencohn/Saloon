// Saloon — design tokens
// Dark, sophisticated: deep ink-plum, dusty rose, warm cream, soft gold

const TOKENS = {
  // Surfaces — layered dark with subtle warmth
  bg:        '#15101A',   // page (deep ink-plum)
  surface:   '#1E1822',   // card
  surfaceHi: '#2A2230',   // raised
  line:      'rgba(245, 230, 211, 0.08)',
  lineStrong:'rgba(245, 230, 211, 0.16)',

  // Text — warm cream, never pure white
  text:      '#F5E6D3',
  textMid:   '#C9B8A8',
  textDim:   '#9A8A85',
  textFaint: '#5E5359',

  // Accent — dusty rose primary, soft gold secondary
  rose:      '#E8B4B8',
  roseDeep:  '#C97B82',
  roseSoft:  'rgba(232, 180, 184, 0.14)',
  gold:      '#D4AF8F',
  goldSoft:  'rgba(212, 175, 143, 0.18)',

  // Semantic
  success:   '#9BB89A',
  warn:      '#E8B4B8',  // reuse rose for warnings (stays on-brand)
  invert:    '#F5E6D3',

  // Type
  serif:     "'Cormorant Garamond', 'EB Garamond', Georgia, serif",
  sans:      "'Inter', 'Helvetica Neue', system-ui, sans-serif",

  // Radii
  rSm:       8,
  rMd:       14,
  rLg:       20,
  rXl:       28,
  rPill:     999,
};

// ── Reusable atoms ─────────────────────────────────────────────────

function Pill({ children, tone = 'rose', size = 'sm', style }) {
  const tones = {
    rose:  { bg: TOKENS.roseSoft, fg: TOKENS.rose },
    gold:  { bg: TOKENS.goldSoft, fg: TOKENS.gold },
    quiet: { bg: 'rgba(245,230,211,0.06)', fg: TOKENS.textMid },
    solid: { bg: TOKENS.rose, fg: '#1A1418' },
    live:  { bg: 'rgba(155,184,154,0.16)', fg: TOKENS.success },
  };
  const t = tones[tone] || tones.rose;
  const sz = size === 'xs'
    ? { fs: 10, py: 3, px: 8, ls: 0.6 }
    : size === 'md'
      ? { fs: 12, py: 6, px: 12, ls: 0.4 }
      : { fs: 11, py: 4, px: 10, ls: 0.5 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: t.bg, color: t.fg,
      fontSize: sz.fs, fontWeight: 500, letterSpacing: sz.ls,
      padding: `${sz.py}px ${sz.px}px`, borderRadius: TOKENS.rPill,
      fontFamily: TOKENS.sans, textTransform: size === 'xs' ? 'uppercase' : 'none',
      ...style,
    }}>{children}</span>
  );
}

function Btn({ children, variant = 'primary', size = 'md', onClick, style, disabled, full }) {
  const sizes = {
    sm: { h: 36, px: 16, fs: 13 },
    md: { h: 48, px: 20, fs: 14 },
    lg: { h: 56, px: 24, fs: 15 },
  };
  const s = sizes[size];
  const variants = {
    primary: {
      background: TOKENS.rose, color: '#1A1418',
      border: 'none',
    },
    secondary: {
      background: 'transparent', color: TOKENS.text,
      border: `1px solid ${TOKENS.lineStrong}`,
    },
    ghost: {
      background: 'transparent', color: TOKENS.rose, border: 'none',
    },
    gold: {
      background: TOKENS.gold, color: '#1A1418', border: 'none',
    },
  };
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: s.h, padding: `0 ${s.px}px`,
        fontSize: s.fs, fontFamily: TOKENS.sans, fontWeight: 500,
        letterSpacing: 0.3,
        borderRadius: TOKENS.rPill, cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: full ? '100%' : 'auto',
        transition: 'transform 0.15s, opacity 0.15s',
        ...v, ...style,
      }}
      onMouseDown={e => !disabled && (e.currentTarget.style.transform = 'scale(0.97)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
    >{children}</button>
  );
}

function Card({ children, style, onClick, padding = 16 }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: TOKENS.surface, borderRadius: TOKENS.rLg,
        border: `1px solid ${TOKENS.line}`,
        padding, cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >{children}</div>
  );
}

// Photo placeholder — gradient mesh evoking salon imagery, no fake images
function Photo({ seed = 0, style, children, aspect, h, radius = TOKENS.rLg }) {
  // Generate a warm, on-brand gradient based on seed
  const palettes = [
    ['#3A2530', '#7A4A52', '#C97B82'],   // mauve
    ['#2D2028', '#5A3D45', '#E8B4B8'],   // rose
    ['#2A2030', '#6B4A55', '#D4AF8F'],   // gold-mauve
    ['#251820', '#5A3540', '#B89094'],   // dusty
    ['#2E2028', '#7A5560', '#E8B4B8'],   // peach-rose
    ['#1F1820', '#4A3540', '#D4AF8F'],   // deep gold
    ['#332028', '#8A5A65', '#F0C8CC'],   // pink
    ['#1A1418', '#4D3038', '#C97B82'],   // ember
  ];
  const p = palettes[seed % palettes.length];
  const angle = 20 + (seed * 37) % 140;
  return (
    <div style={{
      position: 'relative',
      borderRadius: radius, overflow: 'hidden',
      background: `linear-gradient(${angle}deg, ${p[0]} 0%, ${p[1]} 50%, ${p[2]} 100%)`,
      aspectRatio: aspect, height: h,
      ...style,
    }}>
      {/* subtle vignette + grain */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 60%)',
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: `repeating-linear-gradient(${angle + 90}deg, transparent 0 2px, rgba(0,0,0,0.04) 2px 4px)`,
        opacity: 0.5,
      }}/>
      {children}
    </div>
  );
}

// Subtle divider
function Divider({ style }) {
  return <div style={{ height: 1, background: TOKENS.line, ...style }}/>;
}

// Section header with serif title
function SectionTitle({ children, action, style }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      marginBottom: 14, ...style,
    }}>
      <h2 style={{
        fontFamily: TOKENS.serif, fontSize: 22, fontWeight: 500,
        color: TOKENS.text, margin: 0, letterSpacing: -0.2,
      }}>{children}</h2>
      {action && (
        <span style={{
          fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.rose,
          fontWeight: 500, letterSpacing: 0.4, textTransform: 'uppercase',
        }}>{action}</span>
      )}
    </div>
  );
}

Object.assign(window, { TOKENS, Pill, Btn, Card, Photo, Divider, SectionTitle });
