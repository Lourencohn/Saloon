// Saloon — all screens

const { useState, useEffect, useRef } = React;

// ──────────────────────────────────────────────────────────────────
// Shared chrome: status bar (custom dark version) + bottom nav
// ──────────────────────────────────────────────────────────────────

function StatusBar() {
  return (
    <div style={{
      height: 36, padding: '0 22px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      fontFamily: TOKENS.sans, fontSize: 13, fontWeight: 600,
      color: TOKENS.text, position: 'relative', flexShrink: 0,
    }}>
      <span>9:41</span>
      <div style={{
        position: 'absolute', left: '50%', top: 8, transform: 'translateX(-50%)',
        width: 22, height: 22, borderRadius: '50%', background: '#000',
      }}/>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor"><path d="M8 10.5 0 4.4a10 10 0 0 1 16 0L8 10.5Z"/></svg>
        <svg width="14" height="11" viewBox="0 0 14 11" fill="currentColor"><path d="M13 10.5V.5L1 10.5h12Z"/></svg>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none" stroke="currentColor" strokeWidth="1"><rect x=".5" y=".5" width="18" height="10" rx="2"/><rect x="2" y="2" width="14" height="7" rx="1" fill="currentColor"/><rect x="20" y="3.5" width="1.5" height="4" rx=".5" fill="currentColor"/></svg>
      </div>
    </div>
  );
}

function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home',     icon: 'home',     label: 'Início' },
    { id: 'search',   icon: 'search',   label: 'Buscar' },
    { id: 'bookings', icon: 'calendar', label: 'Agenda' },
    { id: 'profile',  icon: 'user',     label: 'Perfil' },
  ];
  return (
    <div style={{
      flexShrink: 0,
      background: 'rgba(21,16,26,0.92)',
      backdropFilter: 'blur(20px)',
      borderTop: `1px solid ${TOKENS.line}`,
      padding: '10px 12px 14px',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {tabs.map(t => {
        const I = Icons[t.icon];
        const a = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            background: 'none', border: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            color: a ? TOKENS.rose : TOKENS.textDim,
            fontFamily: TOKENS.sans, fontSize: 10, fontWeight: 500, letterSpacing: 0.4,
            padding: '6px 14px', cursor: 'pointer',
          }}>
            <I size={22} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Bottom-of-stage gesture pill
function GestureBar() {
  return (
    <div style={{
      flexShrink: 0, padding: '8px 0 10px',
      display: 'flex', justifyContent: 'center',
      background: TOKENS.bg,
    }}>
      <div style={{ width: 132, height: 4, borderRadius: 999, background: TOKENS.text, opacity: 0.85 }}/>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// 1 — ONBOARDING
// ──────────────────────────────────────────────────────────────────

function ScreenOnboarding({ onDone }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: TOKENS.bg, position: 'relative', overflow: 'hidden' }}>
      <Photo seed={0} style={{ position: 'absolute', inset: 0, borderRadius: 0 }}/>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(21,16,26,0.2) 0%, rgba(21,16,26,0.6) 50%, rgba(21,16,26,0.96) 100%)',
      }}/>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', padding: '32px 28px 24px' }}>
        <div style={{ flex: 1 }}/>
        <div style={{
          fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600, letterSpacing: 3,
          color: TOKENS.gold, textTransform: 'uppercase', marginBottom: 18,
        }}>Saloon</div>
        <h1 style={{
          fontFamily: TOKENS.serif, fontSize: 52, lineHeight: 0.96, fontWeight: 400,
          color: TOKENS.text, margin: 0, letterSpacing: -1.4,
        }}>
          Sua rotina<br/>de beleza,<br/>
          <em style={{ color: TOKENS.rose, fontStyle: 'italic' }}>sem esforço.</em>
        </h1>
        <p style={{
          fontFamily: TOKENS.sans, fontSize: 15, lineHeight: 1.55,
          color: TOKENS.textMid, margin: '24px 0 36px', maxWidth: 320,
        }}>
          Descubra salões próximos, veja horários em tempo real e agende em poucos toques.
        </p>
        <Btn variant="primary" size="lg" full onClick={onDone}>
          Começar <Icons.arrow size={18}/>
        </Btn>
        <div style={{
          textAlign: 'center', marginTop: 18,
          fontFamily: TOKENS.sans, fontSize: 13, color: TOKENS.textDim,
        }}>
          Já tem conta? <span style={{ color: TOKENS.text, fontWeight: 500 }}>Entrar</span>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// 2 — HOME
// ──────────────────────────────────────────────────────────────────

function ScreenHome({ go, favs, toggleFav, showYearEnd, dismissYearEnd }) {
  const [cat, setCat] = useState('all');
  const featured = SALONS[0];
  const list = SALONS.slice(1);

  return (
    <div style={{ flex: 1, overflow: 'auto', background: TOKENS.bg }}>
      {/* Greeting header */}
      <div style={{ padding: '8px 22px 16px' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim,
              letterSpacing: 0.4,
            }}>Boa tarde, Marina</div>
            <div style={{
              fontFamily: TOKENS.serif, fontSize: 26, color: TOKENS.text,
              fontStyle: 'italic', letterSpacing: -0.3, marginTop: 2,
            }}>O que vamos cuidar hoje?</div>
          </div>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            border: `1px solid ${TOKENS.lineStrong}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: TOKENS.text, position: 'relative',
          }}>
            <Icons.bell size={20}/>
            <div style={{
              position: 'absolute', top: 8, right: 9,
              width: 8, height: 8, borderRadius: '50%', background: TOKENS.rose,
              border: `2px solid ${TOKENS.bg}`,
            }}/>
          </div>
        </div>

        {/* Search trigger */}
        <div onClick={() => go('search')} style={{
          marginTop: 18, height: 52, borderRadius: TOKENS.rPill,
          background: TOKENS.surface, border: `1px solid ${TOKENS.line}`,
          display: 'flex', alignItems: 'center', padding: '0 18px', gap: 12,
          color: TOKENS.textDim, fontFamily: TOKENS.sans, fontSize: 14,
          cursor: 'pointer',
        }}>
          <Icons.search size={20} />
          <span style={{ flex: 1 }}>Buscar serviço, salão ou bairro</span>
          <Icons.filter size={18} />
        </div>

        {/* Live availability strip */}
        <div style={{
          marginTop: 14, padding: '10px 14px', borderRadius: TOKENS.rMd,
          background: 'rgba(155,184,154,0.08)',
          border: '1px solid rgba(155,184,154,0.18)',
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid,
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%', background: TOKENS.success,
            boxShadow: `0 0 0 4px rgba(155,184,154,0.18)`,
          }}/>
          <span><strong style={{ color: TOKENS.text, fontWeight: 600 }}>14 salões</strong> com horário disponível agora</span>
        </div>
      </div>

      {/* Year-end alert */}
      {showYearEnd && <YearEndBanner onDismiss={dismissYearEnd} go={go}/>}

      {/* Categories */}
      <div style={{ padding: '6px 0 18px' }}>
        <div style={{
          display: 'flex', gap: 10, padding: '0 22px', overflowX: 'auto',
          scrollbarWidth: 'none',
        }}>
          {[{ id: 'all', label: 'Tudo', icon: 'sparkle' }, ...CATEGORIES].map(c => {
            const I = Icons[c.icon];
            const active = cat === c.id;
            return (
              <button key={c.id} onClick={() => setCat(c.id)} style={{
                flex: '0 0 auto',
                display: 'flex', alignItems: 'center', gap: 8,
                height: 40, padding: '0 16px', borderRadius: TOKENS.rPill,
                background: active ? TOKENS.text : 'transparent',
                color: active ? '#1A1418' : TOKENS.textMid,
                border: active ? 'none' : `1px solid ${TOKENS.line}`,
                fontFamily: TOKENS.sans, fontSize: 13, fontWeight: active ? 600 : 500,
                cursor: 'pointer',
              }}>
                <I size={16}/>{c.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured editorial card */}
      <div style={{ padding: '0 22px 24px' }}>
        <SectionTitle action="Ver todos">Selecionados para você</SectionTitle>
        <div onClick={() => go('salon', featured.id)} style={{
          borderRadius: TOKENS.rXl, overflow: 'hidden', position: 'relative',
          cursor: 'pointer',
        }}>
          <Photo seed={featured.photoSeed} h={360}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 30%, rgba(21,16,26,0.85) 100%)',
            }}/>
            <button onClick={(e) => { e.stopPropagation(); toggleFav(featured.id); }} style={{
              position: 'absolute', top: 16, right: 16,
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(21,16,26,0.5)', backdropFilter: 'blur(10px)',
              border: 'none', color: favs[featured.id] ? TOKENS.rose : TOKENS.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Icons.heart size={20} filled={favs[featured.id]}/>
            </button>
            <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 6 }}>
              <Pill tone="solid" size="xs">Curadoria</Pill>
              <Pill tone="live" size="xs">● disponível agora</Pill>
            </div>
            <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, color: TOKENS.text }}>
              <div style={{ fontFamily: TOKENS.serif, fontSize: 28, lineHeight: 1.05, letterSpacing: -0.4 }}>
                {featured.name}
              </div>
              <div style={{ fontFamily: TOKENS.sans, fontSize: 13, color: TOKENS.textMid, marginTop: 4 }}>
                {featured.tagline}
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 12, fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.star size={13} filled style={{ color: TOKENS.gold }}/>
                  <strong style={{ color: TOKENS.text, fontWeight: 600 }}>{featured.rating}</strong> · {featured.reviews}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.pin size={13}/>{featured.distance}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Icons.clock size={13}/>{featured.nextSlot}
                </span>
              </div>
            </div>
          </Photo>
        </div>
      </div>

      {/* List */}
      <div style={{ padding: '0 22px 28px' }}>
        <SectionTitle>Próximos a você</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {list.map(s => (
            <SalonRow key={s.id} salon={s} fav={favs[s.id]}
              onFav={() => toggleFav(s.id)}
              onClick={() => go('salon', s.id)}/>
          ))}
        </div>
      </div>

      <div style={{ height: 12 }}/>
    </div>
  );
}

function SalonRow({ salon, fav, onFav, onClick }) {
  return (
    <Card padding={12} onClick={onClick} style={{ display: 'flex', gap: 14 }}>
      <Photo seed={salon.photoSeed} style={{ width: 96, height: 96, flexShrink: 0, borderRadius: TOKENS.rMd }}/>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: TOKENS.serif, fontSize: 18, color: TOKENS.text, letterSpacing: -0.2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{salon.name}</div>
            <div style={{
              fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, marginTop: 2,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{salon.tagline}</div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); onFav(); }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: fav ? TOKENS.rose : TOKENS.textDim, padding: 0,
          }}>
            <Icons.heart size={20} filled={fav}/>
          </button>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textMid,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Icons.star size={11} filled style={{ color: TOKENS.gold }}/>
            <strong style={{ color: TOKENS.text, fontWeight: 600 }}>{salon.rating}</strong>
          </span>
          <span>·</span><span>{salon.distance}</span>
          <span>·</span><span>{salon.price}</span>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 2, flexWrap: 'wrap' }}>
          <Pill tone={salon.waitTime === 'agora' ? 'live' : 'quiet'} size="xs">
            {salon.waitTime === 'agora' && '● '}{salon.waitTime}
          </Pill>
          {salon.badges.slice(0, 1).map(b => <Pill key={b} tone="gold" size="xs">{b}</Pill>)}
        </div>
      </div>
    </Card>
  );
}

function YearEndBanner({ onDismiss, go }) {
  return (
    <div style={{ padding: '0 22px 18px' }}>
      <div style={{
        position: 'relative', borderRadius: TOKENS.rLg, overflow: 'hidden',
        background: `linear-gradient(135deg, ${TOKENS.surface} 0%, #2D1A24 100%)`,
        border: `1px solid ${TOKENS.goldSoft}`,
        padding: '18px 18px 18px 20px',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,175,143,0.18), transparent 70%)',
        }}/>
        <button onClick={onDismiss} style={{
          position: 'absolute', top: 10, right: 10,
          background: 'none', border: 'none', color: TOKENS.textDim, cursor: 'pointer', padding: 4,
        }}><Icons.close size={16}/></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Icons.flame size={18} style={{ color: TOKENS.gold }}/>
          <span style={{
            fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
            textTransform: 'uppercase', color: TOKENS.gold,
          }}>Alta demanda · Fim de ano</span>
        </div>
        <div style={{
          fontFamily: TOKENS.serif, fontSize: 22, lineHeight: 1.15, color: TOKENS.text,
          letterSpacing: -0.3, marginBottom: 6, maxWidth: 280,
        }}>
          Antes que esgote: garanta seu horário para as festas.
        </div>
        <div style={{ fontFamily: TOKENS.sans, fontSize: 13, color: TOKENS.textMid, marginBottom: 14 }}>
          73% dos horários entre 20–31 dez já estão ocupados.
        </div>
        <Btn size="sm" variant="gold" onClick={() => go('search')}>
          Ver disponibilidade <Icons.arrow size={14}/>
        </Btn>
      </div>
    </div>
  );
}

window.SaloonScreens1 = { StatusBar, BottomNav, GestureBar, ScreenOnboarding, ScreenHome, SalonRow };
