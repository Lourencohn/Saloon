// Saloon — screens 4: bookings, year-end notif, profile, review

const { useState: useState4 } = React;

// ──────────────────────────────────────────────────────────────────
// MEUS AGENDAMENTOS
// ──────────────────────────────────────────────────────────────────

function ScreenBookings({ go, showYearEnd }) {
  const [tab, setTab] = useState4('upcoming');
  const upcoming = BOOKINGS.filter(b => b.status === 'confirmed');
  const past = BOOKINGS.filter(b => b.status === 'past');
  return (
    <div style={{ flex: 1, overflow: 'auto', background: TOKENS.bg }}>
      <div style={{ padding: '8px 22px 0' }}>
        <h1 style={{
          fontFamily: TOKENS.serif, fontSize: 32, color: TOKENS.text,
          margin: '0 0 4px', letterSpacing: -0.4,
        }}>Sua agenda</h1>
        <p style={{
          fontFamily: TOKENS.sans, fontSize: 13, color: TOKENS.textDim,
          margin: '0 0 22px',
        }}>2 horários marcados · 14 atendimentos no histórico</p>
      </div>

      {/* Tabs */}
      <div style={{
        padding: '0 22px',
        display: 'flex', gap: 26, borderBottom: `1px solid ${TOKENS.line}`,
        marginBottom: 18,
      }}>
        {[
          { id: 'upcoming', label: 'Próximos' },
          { id: 'past',     label: 'Histórico' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '12px 0',
            borderBottom: tab === t.id ? `2px solid ${TOKENS.rose}` : '2px solid transparent',
            color: tab === t.id ? TOKENS.text : TOKENS.textDim,
            fontFamily: TOKENS.sans, fontSize: 14, fontWeight: tab === t.id ? 600 : 500,
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ padding: '0 22px 24px' }}>
        {tab === 'upcoming' && (
          <>
            {/* Year-end smart reminder */}
            {showYearEnd && (
              <Card padding={16} style={{
                marginBottom: 16,
                background: 'linear-gradient(135deg, rgba(212,175,143,0.10), rgba(232,180,184,0.06))',
                border: `1px solid ${TOKENS.gold}33`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Icons.diamond size={16} style={{ color: TOKENS.gold }}/>
                  <span style={{
                    fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600, letterSpacing: 1.5,
                    textTransform: 'uppercase', color: TOKENS.gold,
                  }}>Lembrete · Réveillon</span>
                </div>
                <div style={{ fontFamily: TOKENS.serif, fontSize: 19, color: TOKENS.text, letterSpacing: -0.2, marginBottom: 6 }}>
                  Você ainda não marcou para 31/12.
                </div>
                <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid, marginBottom: 12 }}>
                  Faltam 8 vagas em Casa Lavanda — onde você foi nos últimos 3 anos.
                </div>
                <Btn size="sm" variant="gold" onClick={() => go('search')}>
                  Garantir horário <Icons.arrow size={14}/>
                </Btn>
              </Card>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {upcoming.map(b => <UpcomingCard key={b.id} booking={b}/>)}
            </div>
          </>
        )}
        {tab === 'past' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {past.map(b => (
              <PastCard key={b.id} booking={b} onReview={() => go('review', b.id)}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UpcomingCard({ booking }) {
  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', gap: 14 }}>
        <Photo seed={booking.photoSeed} style={{ width: 64, height: 64, borderRadius: TOKENS.rMd, flexShrink: 0 }}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4,
          }}>
            <Pill tone="live" size="xs">● confirmado</Pill>
            {booking.daysAway <= 3 && <Pill tone="quiet" size="xs">em {booking.daysAway} dias</Pill>}
          </div>
          <div style={{ fontFamily: TOKENS.serif, fontSize: 18, color: TOKENS.text, letterSpacing: -0.2 }}>
            {booking.salon}
          </div>
          <div style={{
            fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid, marginTop: 4,
          }}>{booking.service}</div>
        </div>
      </div>
      <Divider/>
      <div style={{
        padding: '14px 16px', display: 'flex', gap: 18, alignItems: 'center',
        background: 'rgba(245,230,211,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icons.calendar size={14} style={{ color: TOKENS.rose }}/>
          <span style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.text }}>{booking.date}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icons.clock size={14} style={{ color: TOKENS.rose }}/>
          <span style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.text }}>{booking.time}</span>
        </div>
        <span style={{ flex: 1 }}/>
        <Btn size="sm" variant="secondary">Detalhes</Btn>
      </div>
    </Card>
  );
}

function PastCard({ booking, onReview }) {
  return (
    <Card padding={14} style={{ display: 'flex', gap: 14 }}>
      <Photo seed={booking.photoSeed} style={{ width: 56, height: 56, borderRadius: TOKENS.rMd, flexShrink: 0 }}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: TOKENS.serif, fontSize: 16, color: TOKENS.text, letterSpacing: -0.2,
        }}>{booking.salon}</div>
        <div style={{
          fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textMid, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>{booking.service}</div>
        <div style={{
          fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, marginTop: 4,
        }}>{booking.date} · R$ {booking.price}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
        {booking.rated ? (
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map(i => (
              <Icons.star key={i} size={11} filled
                style={{ color: i <= booking.rating ? TOKENS.gold : TOKENS.lineStrong }}/>
            ))}
          </div>
        ) : (
          <button onClick={onReview} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: TOKENS.rose, fontFamily: TOKENS.sans, fontSize: 12, fontWeight: 500,
            padding: 0,
          }}>Avaliar →</button>
        )}
        <button style={{
          background: 'transparent', border: `1px solid ${TOKENS.line}`,
          color: TOKENS.text, fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 500,
          padding: '4px 10px', borderRadius: TOKENS.rPill, cursor: 'pointer',
        }}>Repetir</button>
      </div>
    </Card>
  );
}

// ──────────────────────────────────────────────────────────────────
// REVIEW (post-service rating)
// ──────────────────────────────────────────────────────────────────

function ScreenReview({ bookingId, back, go }) {
  const booking = BOOKINGS.find(b => b.id === bookingId) || BOOKINGS[3];
  const [rating, setRating] = useState4(0);
  const [tags, setTags] = useState4([]);
  const [text, setText] = useState4('');
  const tagOptions = ['Atendimento atencioso','Pontual','Resultado impecável','Ambiente acolhedor','Vou voltar','Custo-benefício'];
  const toggle = (t) => setTags(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);
  const labels = ['', 'Insatisfeita', 'Não foi bem', 'Razoável', 'Muito bom', 'Perfeito'];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: TOKENS.bg, position: 'relative' }}>
      <DetailHeader title="Avaliar atendimento" subtitle={booking.salon} back={back}/>
      <div style={{ flex: 1, overflow: 'auto', padding: '24px 22px 140px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <Photo seed={booking.photoSeed}
            style={{ width: 84, height: 84, borderRadius: '50%', margin: '0 auto 16px' }}/>
          <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, letterSpacing: 0.4 }}>
            {booking.date}
          </div>
          <div style={{ fontFamily: TOKENS.serif, fontSize: 22, color: TOKENS.text, marginTop: 4, letterSpacing: -0.2 }}>
            {booking.service}
          </div>
        </div>

        <div style={{
          fontFamily: TOKENS.serif, fontSize: 26, color: TOKENS.text,
          textAlign: 'center', marginBottom: 22, fontStyle: 'italic',
        }}>Como foi sua experiência?</div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
          {[1,2,3,4,5].map(i => (
            <button key={i} onClick={() => setRating(i)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              transition: 'transform 0.2s',
              transform: rating === i ? 'scale(1.15)' : 'scale(1)',
            }}>
              <Icons.star size={42} filled={i <= rating}
                strokeWidth={1.2}
                style={{ color: i <= rating ? TOKENS.gold : TOKENS.lineStrong }}/>
            </button>
          ))}
        </div>
        <div style={{
          fontFamily: TOKENS.sans, fontSize: 13, color: TOKENS.rose,
          textAlign: 'center', minHeight: 18, marginBottom: 32,
          opacity: rating ? 1 : 0,
        }}>{labels[rating]}</div>

        {rating > 0 && (
          <>
            <div style={{
              fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600,
              color: TOKENS.textDim, letterSpacing: 1.5, textTransform: 'uppercase',
              marginBottom: 12,
            }}>Marque o que combinou</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {tagOptions.map(t => (
                <Chip key={t} active={tags.includes(t)} onClick={() => toggle(t)}>{t}</Chip>
              ))}
            </div>

            <div style={{
              fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600,
              color: TOKENS.textDim, letterSpacing: 1.5, textTransform: 'uppercase',
              marginBottom: 12,
            }}>Conte mais (opcional)</div>
            <textarea value={text} onChange={e => setText(e.target.value)}
              placeholder="O que mais marcou no atendimento?"
              style={{
                width: '100%', minHeight: 100, padding: 14,
                borderRadius: TOKENS.rMd,
                background: TOKENS.surface, border: `1px solid ${TOKENS.line}`,
                color: TOKENS.text, fontFamily: TOKENS.sans, fontSize: 13,
                resize: 'none', outline: 'none', boxSizing: 'border-box',
                lineHeight: 1.5,
              }}/>
          </>
        )}
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '16px 22px 22px',
        background: 'linear-gradient(180deg, transparent, rgba(21,16,26,0.95) 30%)',
      }}>
        <Btn variant="primary" size="lg" full disabled={rating === 0}
          onClick={() => go('bookings')}>
          Enviar avaliação
        </Btn>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// PROFILE
// ──────────────────────────────────────────────────────────────────

function ScreenProfile({ go }) {
  return (
    <div style={{ flex: 1, overflow: 'auto', background: TOKENS.bg }}>
      <div style={{ padding: '8px 22px 24px' }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
        }}>
          <h1 style={{
            fontFamily: TOKENS.serif, fontSize: 28, color: TOKENS.text, margin: 0, letterSpacing: -0.4,
          }}>Perfil</h1>
          <button style={{
            width: 40, height: 40, borderRadius: '50%', border: `1px solid ${TOKENS.lineStrong}`,
            background: 'transparent', color: TOKENS.text, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}><Icons.more size={18}/></button>
        </div>

        {/* User card */}
        <Card padding={20} style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 18 }}>
          <Photo seed={3} style={{ width: 72, height: 72, borderRadius: '50%' }}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.serif, fontSize: 22, color: TOKENS.text, letterSpacing: -0.2 }}>
              Marina Beltrão
            </div>
            <div style={{ fontFamily: TOKENS.sans, fontSize: 12, color: TOKENS.textDim, marginTop: 2 }}>
              marina.b@email.com
            </div>
            <div style={{ marginTop: 8 }}>
              <Pill tone="gold" size="xs">★ Saloon Membro · 2 anos</Pill>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
          {[
            { n: '14',   l: 'Atendimentos' },
            { n: 'R$ 3,2k', l: 'Investido' },
            { n: '4.9',  l: 'Sua nota' },
          ].map(s => (
            <Card key={s.l} padding={14} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: TOKENS.serif, fontSize: 24, color: TOKENS.gold,
                lineHeight: 1, fontWeight: 500,
              }}>{s.n}</div>
              <div style={{
                fontFamily: TOKENS.sans, fontSize: 10, color: TOKENS.textDim,
                marginTop: 6, letterSpacing: 0.6, textTransform: 'uppercase',
              }}>{s.l}</div>
            </Card>
          ))}
        </div>

        {/* Favorites */}
        <SectionTitle action="Ver todos">Salões favoritos</SectionTitle>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 24, paddingBottom: 4 }}>
          {SALONS.filter(s => s.favorite).map(s => (
            <div key={s.id} onClick={() => go('salon', s.id)} style={{
              flex: '0 0 auto', width: 140, cursor: 'pointer',
            }}>
              <Photo seed={s.photoSeed} h={140} style={{ borderRadius: TOKENS.rMd, marginBottom: 10 }}/>
              <div style={{
                fontFamily: TOKENS.serif, fontSize: 15, color: TOKENS.text, letterSpacing: -0.1,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{s.name}</div>
              <div style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, marginTop: 2 }}>
                {s.neighborhood}
              </div>
            </div>
          ))}
        </div>

        {/* Menu */}
        <SectionTitle>Conta</SectionTitle>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {[
            { i: 'card',     l: 'Métodos de pagamento', s: '2 cartões salvos' },
            { i: 'bell',     l: 'Notificações', s: 'Lembretes e ofertas' },
            { i: 'pin',      l: 'Endereços', s: 'São Paulo · Vila Madalena' },
            { i: 'sparkle',  l: 'Preferências', s: 'Profissional e estilo favoritos' },
            { i: 'user',     l: 'Privacidade e dados', s: '' },
          ].map((row, i, arr) => {
            const I = Icons[row.i];
            return (
              <div key={row.l} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                borderBottom: i < arr.length - 1 ? `1px solid ${TOKENS.line}` : 'none',
                cursor: 'pointer',
              }}>
                <I size={18} style={{ color: TOKENS.rose }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: TOKENS.sans, fontSize: 14, color: TOKENS.text, fontWeight: 500 }}>
                    {row.l}
                  </div>
                  {row.s && (
                    <div style={{ fontFamily: TOKENS.sans, fontSize: 11, color: TOKENS.textDim, marginTop: 2 }}>
                      {row.s}
                    </div>
                  )}
                </div>
                <Icons.chevron size={16} style={{ color: TOKENS.textDim }}/>
              </div>
            );
          })}
        </Card>

        <button style={{
          width: '100%', marginTop: 24, padding: 14,
          background: 'transparent', border: 'none',
          color: TOKENS.textDim, fontFamily: TOKENS.sans, fontSize: 13, fontWeight: 500,
          cursor: 'pointer',
        }}>Sair da conta</button>

        <div style={{
          textAlign: 'center', marginTop: 14,
          fontFamily: TOKENS.serif, fontSize: 11, fontStyle: 'italic',
          color: TOKENS.textFaint, letterSpacing: 0.4,
        }}>Saloon · v1.4.2</div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// YEAR-END NOTIFICATION (push-style modal)
// ──────────────────────────────────────────────────────────────────

function YearEndModal({ onClose, go }) {
  return (
    <Sheet onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: TOKENS.goldSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: TOKENS.gold, margin: '0 auto 18px',
        }}>
          <Icons.flame size={32}/>
        </div>
        <div style={{
          fontFamily: TOKENS.sans, fontSize: 11, fontWeight: 600, letterSpacing: 2,
          textTransform: 'uppercase', color: TOKENS.gold, marginBottom: 12,
        }}>Lembrete · Réveillon a 22 dias</div>
        <h2 style={{
          fontFamily: TOKENS.serif, fontSize: 28, color: TOKENS.text,
          margin: '0 0 14px', letterSpacing: -0.4, lineHeight: 1.1,
        }}>
          Não fique sem horário<br/>
          <em style={{ color: TOKENS.rose, fontStyle: 'italic' }}>nesse fim de ano.</em>
        </h2>
        <p style={{
          fontFamily: TOKENS.sans, fontSize: 14, color: TOKENS.textMid,
          margin: '0 auto 24px', maxWidth: 320, lineHeight: 1.55,
        }}>
          Os melhores salões já estão com 73% das vagas tomadas para 28–31/12. Bloqueie o seu agora.
        </p>
        <Btn variant="primary" size="lg" full onClick={() => { onClose(); go('search'); }}>
          Ver horários disponíveis
        </Btn>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: TOKENS.textDim, fontFamily: TOKENS.sans, fontSize: 13,
          marginTop: 14, padding: 8,
        }}>Lembrar mais tarde</button>
      </div>
    </Sheet>
  );
}

window.SaloonScreens4 = {
  ScreenBookings, ScreenReview, ScreenProfile, YearEndModal,
};
