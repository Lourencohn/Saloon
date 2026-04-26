// Saloon — screens 3: select service+pro, calendar, confirm/checkout, success

const { useState: useState3 } = React;

// ──────────────────────────────────────────────────────────────────
// SELECT SERVICE & PROFESSIONAL
// ──────────────────────────────────────────────────────────────────

function ScreenSelect({ salonId, presetService, go, back }) {
  const salon = SALONS.find(s => s.id === salonId) || SALONS[0];
  const services = SERVICES[salon.id] || SERVICES.s1;
  const pros = PROFESSIONALS[salon.id] || PROFESSIONALS.s1;
  const [selected, setSelected] = useState3(presetService ? [presetService] : []);
  const [pro, setPro] = useState3(pros[0].id);

  const toggle = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const items = services.filter(s => selected.includes(s.id));
  const total = items.reduce((s, i) => s + i.price, 0);
  const totalDur = items.reduce((s, i) => s + i.dur, 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: TOKENS.bg, position: 'relative' }}>
      <DetailHeader title="Escolher serviços" subtitle={salon.name} back={back}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 22px 140px' }}>
        {/* Pro selector */}
        <div style={{
          fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600,
          color: TOKENS.textDim, letterSpacing: 1.5, textTransform: 'uppercase',
          marginBottom: 12,
        }}>Profissional</div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 22 }}>
          <button onClick={() => setPro(null)} style={{
            flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 14px 8px 8px', borderRadius: TOKENS.rPill,
            background: !pro ? TOKENS.text : 'transparent',
            color: !pro ? '#1A1418' : TOKENS.textMid,
            border: !pro ? 'none' : `1px solid ${TOKENS.line}`,
            fontFamily: TOKENS.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: !pro ? '#1A1418' : TOKENS.surfaceHi,
              color: !pro ? TOKENS.text : TOKENS.text,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icons.sparkle size={16}/></div>
            Qualquer um
          </button>
          {pros.map(p => (
            <button key={p.id} onClick={() => setPro(p.id)} style={{
              flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px 8px 8px', borderRadius: TOKENS.rPill,
              background: pro === p.id ? TOKENS.text : 'transparent',
              color: pro === p.id ? '#1A1418' : TOKENS.text,
              border: pro === p.id ? 'none' : `1px solid ${TOKENS.line}`,
              fontFamily: TOKENS.sans, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}>
              <Photo seed={p.photoSeed} style={{ width: 32, height: 32, borderRadius: '50%' }}/>
              {p.name.split(' ')[0]}
              {p.fav && <Icons.heart size={11} filled style={{ color: TOKENS.rose }}/>}
            </button>
          ))}
        </div>

        {/* Service list */}
        <div style={{
          fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600,
          color: TOKENS.textDim, letterSpacing: 1.5, textTransform: 'uppercase',
          marginBottom: 12,
        }}>Serviços</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {services.map(sv => (
            <ServiceRow key={sv.id} sv={sv}
              selected={selected.includes(sv.id)}
              onToggle={() => toggle(sv.id)}/>
          ))}
        </div>

        {/* Combo hint */}
        {selected.length === 1 && (
          <div style={{
            marginTop: 18, padding: '14px 16px', borderRadius: TOKENS.rMd,
            background: TOKENS.goldSoft, border: `1px solid ${TOKENS.gold}33`,
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <Icons.combo size={20} style={{ color: TOKENS.gold }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TOKENS.sans, fontSize: 13, fontWeight: 500, color: TOKENS.text }}>
                Adicione um combo e economize 15%
              </div>
              <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid, marginTop: 2 }}>
                Cabelo + unhas no mesmo horário
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA */}
      {selected.length > 0 && (
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          padding: '16px 22px 22px',
          background: 'linear-gradient(180deg, transparent, rgba(21,16,26,0.95) 30%)',
          animation: 'slideUp 0.25s',
        }}>
          <div style={{
            background: TOKENS.surfaceHi, borderRadius: TOKENS.rXl,
            padding: 16, display: 'flex', alignItems: 'center', gap: 14,
            border: `1px solid ${TOKENS.line}`,
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, letterSpacing: 0.4 }}>
                {selected.length} serviço{selected.length > 1 ? 's' : ''} · {totalDur} min
              </div>
              <div style={{ fontFamily: TOKENS.serif, fontSize: 24, color: TOKENS.text, marginTop: 2 }}>
                R$ {total},00
              </div>
            </div>
            <Btn variant="primary" onClick={() => go('calendar', salon.id, selected, pro)}>
              Escolher horário <Icons.arrow size={16}/>
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailHeader({ title, subtitle, back, action }) {
  return (
    <div style={{
      flexShrink: 0, padding: '4px 14px 14px',
      display: 'flex', alignItems: 'center', gap: 8,
      borderBottom: `1px solid ${TOKENS.line}`,
    }}>
      <button onClick={back} style={{
        width: 40, height: 40, borderRadius: '50%', border: 'none',
        background: 'transparent', color: TOKENS.text, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icons.back size={22}/></button>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, letterSpacing: 0.4 }}>
          {subtitle}
        </div>
        <div style={{ fontFamily: TOKENS.serif, fontSize: 19, color: TOKENS.text, letterSpacing: -0.2 }}>
          {title}
        </div>
      </div>
      {action}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// CALENDAR / TIME PICKER
// ──────────────────────────────────────────────────────────────────

function ScreenCalendar({ salonId, selected, pro, go, back }) {
  const [day, setDay] = useState3(2);  // 0..13
  const [time, setTime] = useState3('15:00');

  // Build 14 days starting today
  const days = [];
  const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
  const weekdays = ['dom','seg','ter','qua','qui','sex','sáb'];
  // Use a fixed mock date: Dec 9 2025 (a Tue)
  const start = new Date(2025, 11, 9);
  for (let i = 0; i < 14; i++) {
    const d = new Date(start); d.setDate(start.getDate() + i);
    days.push({
      n: d.getDate(), wd: weekdays[d.getDay()], mo: months[d.getMonth()],
      hot: i >= 7 && i <= 11, soldOut: i === 5 || i === 8,
    });
  }

  const salon = SALONS.find(s => s.id === salonId) || SALONS[0];
  const services = SERVICES[salon.id] || SERVICES.s1;
  const items = services.filter(s => (selected || []).includes(s.id));
  const total = items.reduce((s, i) => s + i.price, 0);
  const totalDur = items.reduce((s, i) => s + i.dur, 0);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: TOKENS.bg, position: 'relative' }}>
      <DetailHeader title="Quando?" subtitle={salon.name} back={back}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '6px 0 140px' }}>
        {/* Year-end notice if applicable */}
        <div style={{ padding: '10px 22px 0' }}>
          <div style={{
            display: 'flex', gap: 10, padding: '10px 14px', borderRadius: TOKENS.rMd,
            background: TOKENS.goldSoft, border: `1px solid ${TOKENS.gold}33`,
            fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.text, alignItems: 'center',
          }}>
            <Icons.flame size={16} style={{ color: TOKENS.gold, flexShrink: 0 }}/>
            <span>Alta demanda para festas de fim de ano. Garanta logo.</span>
          </div>
        </div>

        {/* Month label */}
        <div style={{
          padding: '20px 22px 12px',
          fontFamily: TOKENS.serif, fontSize: 22, fontStyle: 'italic',
          color: TOKENS.text, letterSpacing: -0.2,
        }}>Dezembro 2025</div>

        {/* Day strip */}
        <div style={{ padding: '0 14px', display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {days.map((d, i) => {
            const sel = day === i;
            return (
              <button key={i} onClick={() => !d.soldOut && setDay(i)}
                disabled={d.soldOut}
                style={{
                  flex: '0 0 auto', width: 56, padding: '10px 0', borderRadius: TOKENS.rLg,
                  background: sel ? TOKENS.rose : 'transparent',
                  border: sel ? 'none' : `1px solid ${TOKENS.line}`,
                  color: sel ? '#1A1418' : (d.soldOut ? TOKENS.textFaint : TOKENS.text),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                  cursor: d.soldOut ? 'not-allowed' : 'pointer', position: 'relative',
                }}>
                <span style={{
                  fontFamily: TOKENS.sans, fontSize: 10, letterSpacing: 0.6, textTransform: 'uppercase',
                  opacity: 0.7,
                }}>{d.wd}</span>
                <span style={{ fontFamily: TOKENS.serif, fontSize: 22, lineHeight: 1 }}>{d.n}</span>
                {d.hot && !sel && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 5, height: 5, borderRadius: '50%', background: TOKENS.gold,
                  }}/>
                )}
                {d.soldOut && (
                  <span style={{ fontFamily: TOKENS.sans, fontSize: 8, color: TOKENS.textFaint, marginTop: 2 }}>cheio</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Time grid */}
        <div style={{ padding: '24px 22px 0' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            marginBottom: 14,
          }}>
            <h3 style={{
              fontFamily: TOKENS.serif, fontSize: 18, color: TOKENS.text, margin: 0, letterSpacing: -0.2,
            }}>{days[day].wd === 'sáb' ? 'Sábado' : days[day].wd === 'dom' ? 'Domingo' : days[day].wd.charAt(0).toUpperCase() + days[day].wd.slice(1) + 'a-feira'}, {days[day].n} {days[day].mo}</h3>
            <span style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim }}>
              7 horários disponíveis
            </span>
          </div>

          {/* Periods */}
          {[
            { label: 'Manhã', times: ['09:00','09:30','10:00','10:30','11:00','11:30'] },
            { label: 'Tarde', times: ['14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'] },
          ].map(period => (
            <div key={period.label} style={{ marginBottom: 22 }}>
              <div style={{
                fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim,
                letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12,
              }}>{period.label}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {period.times.map((t, i) => {
                  const unavail = i % 5 === 2;
                  const hot = (t === '15:00' || t === '18:30');
                  const sel = time === t;
                  return (
                    <button key={t} onClick={() => !unavail && setTime(t)}
                      disabled={unavail}
                      style={{
                        height: 44, borderRadius: TOKENS.rMd,
                        background: sel ? TOKENS.rose : (unavail ? 'transparent' : TOKENS.surface),
                        border: sel ? 'none' : `1px solid ${unavail ? TOKENS.line : TOKENS.lineStrong}`,
                        color: sel ? '#1A1418' : (unavail ? TOKENS.textFaint : TOKENS.text),
                        fontFamily: TOKENS.sans, fontSize: 13, fontWeight: sel ? 600 : 500,
                        cursor: unavail ? 'not-allowed' : 'pointer',
                        textDecoration: unavail ? 'line-through' : 'none',
                        position: 'relative',
                      }}>
                      {t}
                      {hot && !sel && !unavail && (
                        <span style={{
                          position: 'absolute', top: -4, right: -4,
                          fontSize: 9, color: TOKENS.gold,
                        }}>●</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '16px 22px 22px',
        background: 'linear-gradient(180deg, transparent, rgba(21,16,26,0.95) 30%)',
      }}>
        <div style={{
          background: TOKENS.surfaceHi, borderRadius: TOKENS.rXl,
          padding: 16, display: 'flex', alignItems: 'center', gap: 14,
          border: `1px solid ${TOKENS.line}`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, letterSpacing: 0.4 }}>
              {days[day].wd}, {days[day].n} {days[day].mo} · {time}
            </div>
            <div style={{ fontFamily: TOKENS.serif, fontSize: 22, color: TOKENS.text, marginTop: 2 }}>
              R$ {total || 220},00 · {totalDur || 60} min
            </div>
          </div>
          <Btn variant="primary" onClick={() => go('confirm', salonId, selected, pro, { day, time, days })}>
            Revisar <Icons.arrow size={16}/>
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// CONFIRM / CHECKOUT
// ──────────────────────────────────────────────────────────────────

function ScreenConfirm({ salonId, selected, pro, when, go, back }) {
  const salon = SALONS.find(s => s.id === salonId) || SALONS[0];
  const services = SERVICES[salon.id] || SERVICES.s1;
  const pros = PROFESSIONALS[salon.id] || PROFESSIONALS.s1;
  const items = (selected || []).length ? services.filter(s => selected.includes(s.id)) : [services[0]];
  const proObj = pros.find(p => p.id === pro) || pros[0];
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const fee = 0;
  const total = subtotal + fee;
  const [pay, setPay] = useState3('pix');
  const [reminder, setReminder] = useState3(true);
  const dayInfo = when?.days?.[when.day] || { wd: 'sex', n: 12, mo: 'dez' };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: TOKENS.bg, position: 'relative' }}>
      <DetailHeader title="Confirmar agendamento" subtitle="Revise os detalhes" back={back}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 140px' }}>
        {/* Summary card */}
        <Card padding={0} style={{ overflow: 'hidden', marginBottom: 18 }}>
          <div style={{ display: 'flex', gap: 14, padding: 16 }}>
            <Photo seed={salon.photoSeed} style={{ width: 64, height: 64, borderRadius: TOKENS.rMd, flexShrink: 0 }}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: TOKENS.serif, fontSize: 18, color: TOKENS.text, letterSpacing: -0.2 }}>
                {salon.name}
              </div>
              <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, marginTop: 2 }}>
                {salon.address}
              </div>
            </div>
          </div>
          <Divider/>
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <SumRow icon="calendar" label="Data e hora"
              value={`${dayInfo.wd}, ${dayInfo.n} ${dayInfo.mo} · ${when?.time || '15:00'}`}/>
            <SumRow icon="user" label="Profissional" value={proObj.name}/>
            <SumRow icon="clock" label="Duração total"
              value={`${items.reduce((s, i) => s + i.dur, 0)} min`}/>
          </div>
        </Card>

        {/* Items */}
        <SectionTitle>Serviços</SectionTitle>
        <Card padding={16} style={{ marginBottom: 18 }}>
          {items.map((sv, i) => (
            <div key={sv.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
              padding: '8px 0',
              borderTop: i ? `1px solid ${TOKENS.line}` : 'none',
            }}>
              <div>
                <div style={{ fontFamily: TOKENS.sans, fontSize: 14, color: TOKENS.text, fontWeight: 500 }}>
                  {sv.name}
                </div>
                <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, marginTop: 2 }}>
                  {sv.dur} min
                </div>
              </div>
              <div style={{ fontFamily: TOKENS.sans, fontSize: 14, color: TOKENS.text }}>R$ {sv.price}</div>
            </div>
          ))}
          <Divider style={{ margin: '12px 0' }}/>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          }}>
            <span style={{ fontFamily: TOKENS.sans, fontSize: 13, color: TOKENS.textMid }}>Total</span>
            <span style={{ fontFamily: TOKENS.serif, fontSize: 24, color: TOKENS.gold, fontWeight: 500 }}>
              R$ {total},00
            </span>
          </div>
          <div style={{
            fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, marginTop: 4, textAlign: 'right',
          }}>Pagamento sem taxa adicional</div>
        </Card>

        {/* Payment */}
        <SectionTitle>Pagamento</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {[
            { id: 'pix',  icon: 'pix',  label: 'Pix', sub: 'Confirmação imediata' },
            { id: 'card', icon: 'card', label: 'Crédito · final 4821', sub: 'Em até 3x sem juros' },
            { id: 'salon', icon: 'sparkle', label: 'Pagar no salão', sub: 'Dinheiro, cartão ou Pix presencial' },
          ].map(opt => {
            const I = Icons[opt.icon];
            const sel = pay === opt.id;
            return (
              <div key={opt.id} onClick={() => setPay(opt.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 14,
                  borderRadius: TOKENS.rMd,
                  border: sel ? `1px solid ${TOKENS.rose}` : `1px solid ${TOKENS.line}`,
                  background: sel ? TOKENS.roseSoft : TOKENS.surface,
                  cursor: 'pointer',
                }}>
                <I size={22} style={{ color: sel ? TOKENS.rose : TOKENS.text }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TOKENS.sans, fontSize: 14, color: TOKENS.text, fontWeight: 500 }}>
                    {opt.label}
                  </div>
                  <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, marginTop: 2 }}>
                    {opt.sub}
                  </div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: sel ? `6px solid ${TOKENS.rose}` : `1px solid ${TOKENS.lineStrong}`,
                }}/>
              </div>
            );
          })}
        </div>

        {/* Reminder */}
        <Card padding={14} style={{
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <Icons.bell size={20} style={{ color: TOKENS.rose }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.sans, fontSize: 13, color: TOKENS.text, fontWeight: 500 }}>
              Lembrete automático
            </div>
            <div style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, marginTop: 2 }}>
              Te avisamos 24h e 1h antes
            </div>
          </div>
          <Toggle value={reminder} onChange={setReminder}/>
        </Card>

        <div style={{
          fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim,
          textAlign: 'center', marginTop: 22, lineHeight: 1.6,
        }}>
          Cancelamento gratuito até 4h antes do horário.<br/>
          Ao confirmar, você aceita os termos do Saloon.
        </div>
      </div>

      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '16px 22px 22px',
        background: 'linear-gradient(180deg, transparent, rgba(21,16,26,0.95) 30%)',
      }}>
        <Btn variant="primary" size="lg" full onClick={() => go('success')}>
          Confirmar agendamento · R$ {total},00
        </Btn>
      </div>
    </div>
  );
}

function SumRow({ icon, label, value }) {
  const I = Icons[icon];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 36, height: 36, borderRadius: TOKENS.rSm,
        background: TOKENS.surfaceHi, color: TOKENS.rose,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}><I size={16}/></div>
      <div>
        <div style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, letterSpacing: 0.4 }}>
          {label}
        </div>
        <div style={{ fontFamily: TOKENS.sans, fontSize: 14, color: TOKENS.text, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 44, height: 26, borderRadius: 13,
      background: value ? TOKENS.rose : TOKENS.lineStrong,
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background 0.2s',
    }}>
      <span style={{
        position: 'absolute', top: 3, left: value ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
      }}/>
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────
// SUCCESS
// ──────────────────────────────────────────────────────────────────

function ScreenSuccess({ go }) {
  const [phase, setPhase] = useState3(0);
  React.useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      flex: 1, background: TOKENS.bg,
      display: 'flex', flexDirection: 'column',
      padding: '32px 28px 24px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,180,184,0.18), transparent 60%)',
        opacity: phase >= 1 ? 1 : 0, transition: 'opacity 0.6s',
      }}/>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        {/* Animated check */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: TOKENS.rose,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#1A1418',
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.3)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.4)',
          boxShadow: '0 20px 60px rgba(232,180,184,0.3)',
        }}>
          <Icons.check size={44} strokeWidth={2}/>
        </div>

        <div style={{
          fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600,
          color: TOKENS.gold, letterSpacing: 3, textTransform: 'uppercase',
          marginTop: 32, marginBottom: 12,
          opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s 0.1s',
        }}>Reservado</div>
        <h1 style={{
          fontFamily: TOKENS.serif, fontSize: 36, color: TOKENS.text,
          textAlign: 'center', margin: 0, letterSpacing: -0.6, lineHeight: 1.1,
          opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s 0.15s',
        }}>
          Pronto, Marina.<br/>
          <em style={{ color: TOKENS.rose, fontStyle: 'italic' }}>Seu horário está garantido.</em>
        </h1>
        <p style={{
          fontFamily: TOKENS.sans, fontSize: 14, color: TOKENS.textMid,
          textAlign: 'center', margin: '18px 0 0', maxWidth: 280, lineHeight: 1.55,
          opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s 0.25s',
        }}>
          Sex, 12 dez · 15:30 · Casa Lavanda<br/>
          Enviamos os detalhes por e-mail. Te lembramos 24h antes.
        </p>
      </div>

      <div style={{
        opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.5s 0.35s',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <Btn variant="primary" size="lg" full onClick={() => go('bookings')}>
          Ver meus agendamentos
        </Btn>
        <Btn variant="secondary" size="md" full onClick={() => go('home')}>
          Voltar ao início
        </Btn>
      </div>
    </div>
  );
}

window.SaloonScreens3 = { ScreenSelect, ScreenCalendar, ScreenConfirm, ScreenSuccess, DetailHeader, Toggle };
