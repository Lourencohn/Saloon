// Saloon — screens 2 (search, salon detail, service select, calendar)

const { useState: useState2 } = React;

// ──────────────────────────────────────────────────────────────────
// SEARCH + FILTERS
// ──────────────────────────────────────────────────────────────────

function ScreenSearch({ go, back, favs, toggleFav }) {
  const [query, setQuery] = useState2('');
  const [showFilter, setShowFilter] = useState2(false);
  const [filters, setFilters] = useState2({ cat: 'all', dist: 5, price: 3, time: 'any' });

  const filtered = SALONS.filter(s => {
    if (query && !s.name.toLowerCase().includes(query.toLowerCase()) &&
        !s.neighborhood.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: TOKENS.bg, position: 'relative' }}>
      {/* Search header */}
      <div style={{ padding: '4px 16px 14px', borderBottom: `1px solid ${TOKENS.line}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={back} style={{
            width: 40, height: 40, borderRadius: '50%', border: 'none',
            background: 'transparent', color: TOKENS.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.back size={22}/></button>
          <div style={{
            flex: 1, height: 44, borderRadius: TOKENS.rPill,
            background: TOKENS.surface, border: `1px solid ${TOKENS.lineStrong}`,
            display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
          }}>
            <Icons.search size={18} style={{ color: TOKENS.textDim }}/>
            <input value={query} onChange={e => setQuery(e.target.value)}
              autoFocus placeholder="Buscar salão, serviço, bairro"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                color: TOKENS.text, fontFamily: TOKENS.sans, fontSize: 14,
              }}/>
          </div>
          <button onClick={() => setShowFilter(true)} style={{
            width: 44, height: 44, borderRadius: TOKENS.rPill,
            border: `1px solid ${TOKENS.lineStrong}`, background: 'transparent',
            color: TOKENS.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Icons.filter size={18}/>
            <span style={{
              position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%',
              background: TOKENS.rose,
            }}/>
          </button>
        </div>

        {/* Quick chips */}
        <div style={{ display: 'flex', gap: 8, marginTop: 14, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {['Disponível agora', 'Até 2 km', 'Combo', 'Aceita Pix', 'Aberto até 21h'].map((c, i) => (
            <span key={c} style={{
              flex: '0 0 auto', height: 32, padding: '0 14px', borderRadius: TOKENS.rPill,
              background: i === 0 ? TOKENS.roseSoft : 'transparent',
              border: i === 0 ? `1px solid ${TOKENS.roseDeep}` : `1px solid ${TOKENS.line}`,
              color: i === 0 ? TOKENS.rose : TOKENS.textMid,
              fontFamily: TOKENS.sans, fontSize: 12, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}>{i === 0 && '●'} {c}</span>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 24px' }}>
        <div style={{
          fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, letterSpacing: 0.4,
          marginBottom: 14,
        }}>{filtered.length} resultados · ordenado por relevância</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtered.map(s => (
            <SalonRow key={s.id} salon={s} fav={favs[s.id]}
              onFav={() => toggleFav(s.id)} onClick={() => go('salon', s.id)}/>
          ))}
        </div>
      </div>

      {showFilter && <FilterSheet filters={filters} setFilters={setFilters} onClose={() => setShowFilter(false)}/>}
    </div>
  );
}

function FilterSheet({ filters, setFilters, onClose }) {
  return (
    <Sheet onClose={onClose} title="Filtros">
      <FilterGroup label="Categoria">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[{ id: 'all', label: 'Tudo' }, ...CATEGORIES.slice(0, 6)].map(c => (
            <Chip key={c.id} active={filters.cat === c.id}
              onClick={() => setFilters({ ...filters, cat: c.id })}>{c.label}</Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="Distância" value={`Até ${filters.dist} km`}>
        <Slider value={filters.dist} min={0.5} max={10} step={0.5}
          onChange={v => setFilters({ ...filters, dist: v })}/>
      </FilterGroup>
      <FilterGroup label="Preço">
        <div style={{ display: 'flex', gap: 8 }}>
          {['$', '$$', '$$$', '$$$$'].map((p, i) => (
            <Chip key={p} active={filters.price === i + 1}
              onClick={() => setFilters({ ...filters, price: i + 1 })}>{p}</Chip>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="Disponibilidade">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {[
            { id: 'now', label: 'Agora' },
            { id: 'today', label: 'Hoje' },
            { id: 'week', label: 'Esta semana' },
            { id: 'any', label: 'Qualquer' },
          ].map(t => (
            <Chip key={t.id} active={filters.time === t.id}
              onClick={() => setFilters({ ...filters, time: t.id })}>{t.label}</Chip>
          ))}
        </div>
      </FilterGroup>
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <Btn variant="secondary" full onClick={() => setFilters({ cat: 'all', dist: 5, price: 3, time: 'any' })}>
          Limpar
        </Btn>
        <Btn variant="primary" full onClick={onClose}>
          Aplicar filtros
        </Btn>
      </div>
    </Sheet>
  );
}

function FilterGroup({ label, value, children }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        marginBottom: 12,
      }}>
        <span style={{
          fontFamily: TOKENS.sans, fontSize: 13, fontWeight: 500, color: TOKENS.text,
          letterSpacing: 0.2,
        }}>{label}</span>
        {value && <span style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.rose }}>{value}</span>}
      </div>
      {children}
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      height: 36, padding: '0 16px', borderRadius: TOKENS.rPill,
      border: active ? `1px solid ${TOKENS.rose}` : `1px solid ${TOKENS.line}`,
      background: active ? TOKENS.roseSoft : 'transparent',
      color: active ? TOKENS.rose : TOKENS.textMid,
      fontFamily: TOKENS.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
    }}>{children}</button>
  );
}

function Slider({ value, min, max, step, onChange }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, height: 4,
        background: TOKENS.line, borderRadius: 2,
      }}/>
      <div style={{
        position: 'absolute', left: 0, width: `${pct}%`, height: 4,
        background: TOKENS.rose, borderRadius: 2,
      }}/>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: 32,
          opacity: 0, cursor: 'pointer', margin: 0,
        }}/>
      <div style={{
        position: 'absolute', left: `calc(${pct}% - 11px)`,
        width: 22, height: 22, borderRadius: '50%',
        background: TOKENS.rose, border: '3px solid #1A1418',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      }}/>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// SHEET (modal bottom sheet)
// ──────────────────────────────────────────────────────────────────

function Sheet({ onClose, title, children, height = 'auto' }) {
  return (
    <>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(2px)', zIndex: 50,
        animation: 'fadeIn 0.2s ease',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: TOKENS.surface, borderTopLeftRadius: TOKENS.rXl, borderTopRightRadius: TOKENS.rXl,
        zIndex: 51, padding: '12px 22px 28px', maxHeight: '88%', overflow: 'auto',
        animation: 'slideUp 0.28s cubic-bezier(0.2, 0.9, 0.3, 1)',
        height,
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2, background: TOKENS.lineStrong,
          margin: '0 auto 18px',
        }}/>
        {title && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 18,
          }}>
            <h2 style={{
              fontFamily: TOKENS.serif, fontSize: 24, color: TOKENS.text,
              margin: 0, letterSpacing: -0.3,
            }}>{title}</h2>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: '50%', border: 'none',
              background: TOKENS.surfaceHi, color: TOKENS.text, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icons.close size={16}/></button>
          </div>
        )}
        {children}
      </div>
    </>
  );
}

// ──────────────────────────────────────────────────────────────────
// SALON DETAIL
// ──────────────────────────────────────────────────────────────────

function ScreenSalon({ salonId, go, back, favs, toggleFav }) {
  const salon = SALONS.find(s => s.id === salonId) || SALONS[0];
  const [tab, setTab] = useState2('servicos');
  const services = SERVICES[salon.id] || SERVICES.s1;
  const cats = [...new Set(services.map(s => s.cat))];

  return (
    <div style={{ flex: 1, overflow: 'auto', background: TOKENS.bg, position: 'relative' }}>
      {/* Hero */}
      <div style={{ position: 'relative' }}>
        <Photo seed={salon.photoSeed} h={320} radius={0}>
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(21,16,26,0.6) 0%, transparent 30%, rgba(21,16,26,0.4) 70%, rgba(21,16,26,1) 100%)',
          }}/>
        </Photo>
        <div style={{
          position: 'absolute', top: 12, left: 16, right: 16,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <button onClick={back} style={chromeBtn}><Icons.back size={20}/></button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={chromeBtn}><Icons.share size={18}/></button>
            <button onClick={() => toggleFav(salon.id)}
              style={{ ...chromeBtn, color: favs[salon.id] ? TOKENS.rose : TOKENS.text }}>
              <Icons.heart size={18} filled={favs[salon.id]}/>
            </button>
          </div>
        </div>
        {/* Photo strip preview */}
        <div style={{
          position: 'absolute', bottom: 16, right: 16,
          padding: '6px 12px', borderRadius: TOKENS.rPill,
          background: 'rgba(21,16,26,0.7)', backdropFilter: 'blur(8px)',
          color: TOKENS.text, fontFamily: TOKENS.sans, fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <Icons.sparkle size={13}/> 1 / 24 fotos
        </div>
      </div>

      <div style={{ padding: '0 22px', marginTop: -16, position: 'relative' }}>
        {/* Title block */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {salon.badges.map(b => <Pill key={b} tone="gold" size="xs">{b}</Pill>)}
          </div>
          <h1 style={{
            fontFamily: TOKENS.serif, fontSize: 32, color: TOKENS.text,
            margin: 0, letterSpacing: -0.4, lineHeight: 1.05,
          }}>{salon.name}</h1>
          <div style={{ fontFamily: TOKENS.sans, fontSize: 13, color: TOKENS.textMid, marginTop: 6 }}>
            {salon.tagline}
          </div>
          <div style={{
            display: 'flex', gap: 14, marginTop: 14, alignItems: 'center', flexWrap: 'wrap',
            fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid,
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icons.star size={14} filled style={{ color: TOKENS.gold }}/>
              <strong style={{ color: TOKENS.text, fontWeight: 600, fontSize: 13 }}>{salon.rating}</strong>
              <span style={{ color: TOKENS.textDim }}>({salon.reviews})</span>
            </span>
            <span>·</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Icons.pin size={13}/>{salon.neighborhood} · {salon.distance}
            </span>
            <span>·</span>
            <span>{salon.price}</span>
          </div>
        </div>

        {/* Live availability card */}
        <Card padding={16} style={{
          background: 'linear-gradient(135deg, rgba(155,184,154,0.08), rgba(212,175,143,0.04))',
          border: `1px solid rgba(155,184,154,0.18)`,
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600,
                color: TOKENS.success, letterSpacing: 1, textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: TOKENS.success }}/>
                Disponível {salon.waitTime}
              </div>
              <div style={{ fontFamily: TOKENS.serif, fontSize: 19, color: TOKENS.text, fontStyle: 'italic' }}>
                Próximo horário · {salon.nextSlot}
              </div>
            </div>
            <Btn size="sm" variant="primary" onClick={() => go('select', salon.id)}>
              Agendar
            </Btn>
          </div>
        </Card>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: 26, borderBottom: `1px solid ${TOKENS.line}`,
          marginBottom: 22,
        }}>
          {[
            { id: 'servicos', label: 'Serviços' },
            { id: 'profissionais', label: 'Profissionais' },
            { id: 'avaliacoes', label: 'Avaliações' },
            { id: 'sobre', label: 'Sobre' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 0',
              borderBottom: tab === t.id ? `2px solid ${TOKENS.rose}` : '2px solid transparent',
              color: tab === t.id ? TOKENS.text : TOKENS.textDim,
              fontFamily: TOKENS.sans, fontSize: 13, fontWeight: tab === t.id ? 600 : 500,
              marginBottom: -1,
            }}>{t.label}</button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'servicos' && (
          <div>
            {cats.map(c => (
              <div key={c} style={{ marginBottom: 20 }}>
                <div style={{
                  fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600,
                  color: TOKENS.textDim, letterSpacing: 1.5, textTransform: 'uppercase',
                  marginBottom: 12,
                }}>{c}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {services.filter(s => s.cat === c).map(sv => (
                    <ServiceRow key={sv.id} sv={sv} onAdd={() => go('select', salon.id, sv.id)}/>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'profissionais' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(PROFESSIONALS[salon.id] || PROFESSIONALS.s1).map(p => (
              <Card key={p.id} padding={14} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <Photo seed={p.photoSeed} style={{ width: 60, height: 60, borderRadius: '50%' }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontFamily: TOKENS.serif, fontSize: 17, color: TOKENS.text }}>{p.name}</span>
                    {p.fav && <Pill tone="gold" size="xs">Seu favorito</Pill>}
                  </div>
                  <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, marginTop: 2 }}>
                    {p.role}
                  </div>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4, marginTop: 4,
                    fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid,
                  }}>
                    <Icons.star size={12} filled style={{ color: TOKENS.gold }}/>
                    {p.rating} · {p.reviews} avaliações
                  </div>
                </div>
                <Icons.chevron size={18} style={{ color: TOKENS.textDim }}/>
              </Card>
            ))}
          </div>
        )}

        {tab === 'avaliacoes' && <ReviewsTab/>}
        {tab === 'sobre' && (
          <div style={{ paddingBottom: 20 }}>
            <p style={{
              fontFamily: TOKENS.sans, fontSize: 14, lineHeight: 1.65, color: TOKENS.textMid, margin: 0,
            }}>{salon.about}</p>
            <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { i: 'pin',      l: 'Endereço', v: salon.address },
                { i: 'clock',    l: 'Horário', v: salon.hours },
                { i: 'calendar', l: 'Realizou', v: `${salon.bookings} agendamentos pelo Saloon` },
              ].map(r => {
                const I = Icons[r.i];
                return (
                  <div key={r.l} style={{ display: 'flex', gap: 14 }}>
                    <I size={18} style={{ color: TOKENS.rose, flexShrink: 0, marginTop: 2 }}/>
                    <div>
                      <div style={{
                        fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim,
                        textTransform: 'uppercase', letterSpacing: 1,
                      }}>{r.l}</div>
                      <div style={{ fontFamily: TOKENS.sans, fontSize: 14, color: TOKENS.text, marginTop: 2 }}>{r.v}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ height: 24 }}/>
      </div>
    </div>
  );
}

const chromeBtn = {
  width: 40, height: 40, borderRadius: '50%',
  background: 'rgba(21,16,26,0.6)', backdropFilter: 'blur(10px)',
  border: 'none', color: TOKENS.text, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function ServiceRow({ sv, onAdd, selected, onToggle }) {
  return (
    <div onClick={onToggle || onAdd} style={{
      display: 'flex', gap: 14, padding: '12px 0',
      borderBottom: `1px solid ${TOKENS.line}`,
      cursor: 'pointer',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TOKENS.sans, fontSize: 14, fontWeight: 500, color: TOKENS.text }}>
          {sv.name}
        </div>
        {sv.desc && (
          <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, marginTop: 4 }}>
            {sv.desc}
          </div>
        )}
        <div style={{
          display: 'flex', gap: 10, marginTop: 8,
          fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid,
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Icons.clock size={12}/>{sv.dur} min
          </span>
          <span>·</span>
          <span style={{ color: TOKENS.gold, fontWeight: 600 }}>R$ {sv.price}</span>
        </div>
      </div>
      <button style={{
        width: 36, height: 36, borderRadius: '50%',
        background: selected ? TOKENS.rose : 'transparent',
        border: selected ? 'none' : `1px solid ${TOKENS.lineStrong}`,
        color: selected ? '#1A1418' : TOKENS.text,
        cursor: 'pointer', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {selected ? <Icons.check size={16}/> : <Icons.plus size={16}/>}
      </button>
    </div>
  );
}

function ReviewsTab() {
  const reviews = [
    { name: 'Juliana M.', date: 'há 2 sem', rating: 5, text: 'Helena entendeu exatamente o que eu queria. Saí com o cabelo dos sonhos. Já marquei a próxima.', verified: true },
    { name: 'Camila R.',  date: 'há 1 mês', rating: 5, text: 'Ambiente impecável, atendimento super atencioso. Vale cada centavo.' },
    { name: 'Beatriz L.', date: 'há 1 mês', rating: 4, text: 'Coloração ficou ótima, só achei que demorou um pouco mais que o previsto.' },
  ];
  return (
    <div>
      <div style={{
        display: 'flex', gap: 24, alignItems: 'center', padding: '4px 0 22px',
      }}>
        <div>
          <div style={{ fontFamily: TOKENS.serif, fontSize: 48, color: TOKENS.text, lineHeight: 1 }}>4.9</div>
          <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
            {[1,2,3,4,5].map(i => <Icons.star key={i} size={14} filled style={{ color: TOKENS.gold }}/>)}
          </div>
          <div style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, marginTop: 4 }}>
            482 avaliações
          </div>
        </div>
        <div style={{ flex: 1 }}>
          {[5,4,3,2,1].map(n => {
            const w = n === 5 ? 88 : n === 4 ? 9 : n === 3 ? 2 : 1;
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, width: 8 }}>{n}</span>
                <div style={{ flex: 1, height: 4, background: TOKENS.line, borderRadius: 2 }}>
                  <div style={{ width: `${w}%`, height: '100%', background: TOKENS.gold, borderRadius: 2 }}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Divider/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 18 }}>
        {reviews.map(r => (
          <div key={r.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: TOKENS.sans, fontSize: 13, fontWeight: 600, color: TOKENS.text }}>
                {r.name}{r.verified && <span style={{ marginLeft: 6, color: TOKENS.success }}>✓</span>}
              </span>
              <span style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim }}>{r.date}</span>
            </div>
            <div style={{ display: 'flex', gap: 1, marginBottom: 8 }}>
              {[1,2,3,4,5].map(i => (
                <Icons.star key={i} size={11} filled
                  style={{ color: i <= r.rating ? TOKENS.gold : TOKENS.lineStrong }}/>
              ))}
            </div>
            <p style={{
              fontFamily: TOKENS.sans, fontSize: 13, lineHeight: 1.55, color: TOKENS.textMid, margin: 0,
            }}>{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

window.SaloonScreens2 = { ScreenSearch, ScreenSalon, Sheet, ServiceRow, FilterSheet, Slider, Chip };
