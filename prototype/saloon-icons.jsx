// Saloon — line-art icons (1.5px stroke, 24×24)
// Custom-drawn to match the editorial aesthetic; no library

const Icon = ({ d, size = 22, stroke, fill, strokeWidth = 1.5, viewBox = '0 0 24 24', children, style }) => (
  <svg width={size} height={size} viewBox={viewBox}
    fill="none" stroke={stroke || 'currentColor'} strokeWidth={strokeWidth}
    strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }}>
    {children || <path d={d} fill={fill || 'none'}/>}
  </svg>
);

const Icons = {
  search:   (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Icon>,
  pin:      (p) => <Icon {...p}><path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/></Icon>,
  heart:    (p) => <Icon {...p}><path d="M12 20s-7.5-4.5-7.5-10.5a4.5 4.5 0 0 1 8.25-2.5 4.5 4.5 0 0 1 8.25 2.5C21 15.5 12 20 12 20Z" fill={p?.filled ? 'currentColor' : 'none'}/></Icon>,
  star:     (p) => <Icon {...p}><path d="m12 3 2.7 5.5 6 .9-4.4 4.3 1.1 6.1L12 17l-5.4 2.8 1-6.1L3.4 9.4l6-.9L12 3Z" fill={p?.filled ? 'currentColor' : 'none'}/></Icon>,
  clock:    (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  calendar: (p) => <Icon {...p}><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></Icon>,
  filter:   (p) => <Icon {...p}><path d="M4 6h16M7 12h10M10 18h4"/></Icon>,
  arrow:    (p) => <Icon {...p}><path d="M5 12h14m-5-5 5 5-5 5"/></Icon>,
  back:     (p) => <Icon {...p}><path d="M19 12H5m5 5-5-5 5-5"/></Icon>,
  close:    (p) => <Icon {...p}><path d="m6 6 12 12M18 6 6 18"/></Icon>,
  check:    (p) => <Icon {...p}><path d="m4 12 5 5L20 6"/></Icon>,
  bell:     (p) => <Icon {...p}><path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7Z"/><path d="M10 19a2 2 0 0 0 4 0"/></Icon>,
  user:     (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></Icon>,
  home:     (p) => <Icon {...p}><path d="M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-7h-6v7H5a1 1 0 0 1-1-1v-9Z"/></Icon>,
  bookmark: (p) => <Icon {...p}><path d="M6 3h12v18l-6-4-6 4V3Z" fill={p?.filled ? 'currentColor' : 'none'}/></Icon>,
  scissors: (p) => <Icon {...p}><circle cx="6" cy="7" r="3"/><circle cx="6" cy="17" r="3"/><path d="m9 9 11 11M9 15l11-11"/></Icon>,
  sparkle:  (p) => <Icon {...p}><path d="M12 3v6m0 6v6M3 12h6m6 0h6M6 6l3 3m6 6 3 3M18 6l-3 3m-6 6-3 3"/></Icon>,
  flame:    (p) => <Icon {...p}><path d="M12 21c4 0 7-3 7-7 0-4-3-5-3-9 0 0-4 1-6 6-1 3-3 3-3 6 0 2.5 2 4 5 4Z"/></Icon>,
  diamond:  (p) => <Icon {...p}><path d="m12 3 8 7-8 11-8-11 8-7Z"/><path d="M4 10h16M9 10l3-7m3 7-3-7"/></Icon>,
  more:     (p) => <Icon {...p}><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></Icon>,
  chevron:  (p) => <Icon {...p}><path d="m9 6 6 6-6 6"/></Icon>,
  chevronD: (p) => <Icon {...p}><path d="m6 9 6 6 6-6"/></Icon>,
  chevronU: (p) => <Icon {...p}><path d="m18 15-6-6-6 6"/></Icon>,
  plus:     (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>,
  minus:    (p) => <Icon {...p}><path d="M5 12h14"/></Icon>,
  share:    (p) => <Icon {...p}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8 11 8-4M8 13l8 4"/></Icon>,
  card:     (p) => <Icon {...p}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/></Icon>,
  pix:      (p) => <Icon {...p}><path d="m12 3 9 9-9 9-9-9 9-9Z"/><path d="M8 8 12 12 16 8M8 16l4-4 4 4"/></Icon>,
  // category glyphs
  hair:     (p) => <Icon {...p}><path d="M12 3c-4 0-7 4-7 9 0 0 2-2 5-2-3 1-5 4-5 7h14c0-3-2-6-5-7 3 0 5 2 5 2 0-5-3-9-7-9Z"/></Icon>,
  nail:     (p) => <Icon {...p}><path d="M9 4c0-1 1-1.5 3-1.5s3 .5 3 1.5v10c0 2-1 4-3 4s-3-2-3-4V4Z"/><path d="M9 10h6"/></Icon>,
  face:     (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".8" fill="currentColor"/><circle cx="15" cy="10" r=".8" fill="currentColor"/><path d="M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5"/></Icon>,
  brow:     (p) => <Icon {...p}><path d="M3 12c2-3 6-3 9 0M12 12c2-3 6-3 9 0"/></Icon>,
  lash:     (p) => <Icon {...p}><path d="M3 14c4-5 14-5 18 0"/><path d="M6 13v3M9 12v4M12 11.5v4.5M15 12v4M18 13v3"/></Icon>,
  spa:      (p) => <Icon {...p}><path d="M12 4c-2 4-2 8 0 12 2-4 2-8 0-12Z"/><path d="M5 12c4 0 7 2 7 4M19 12c-4 0-7 2-7 4"/></Icon>,
  combo:    (p) => <Icon {...p}><circle cx="8" cy="8" r="4"/><circle cx="16" cy="16" r="4"/><path d="M11 11l2 2"/></Icon>,
  event:    (p) => <Icon {...p}><path d="m12 3 2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6l2-6Z"/></Icon>,
};

Object.assign(window, { Icon, Icons });
