// app/booking/calendar.tsx
// Mirrors prototype/saloon-screens-3.jsx → ScreenCalendar
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { DetailHeader } from '@/components/DetailHeader';
import { Icon } from '@/components/Icon';
import { SALONS, SERVICES } from '@/constants/mock';
import { colors, fonts, radii } from '@/constants/tokens';
import { useSalon } from '@/hooks/useSalons';
import { useBooking } from '@/stores/booking';

import { StickyCta } from './select';

const WEEKDAYS = ['dom','seg','ter','qua','qui','sex','sáb'];
const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

const PERIODS = [
  { label: 'Manhã', times: ['09:00','09:30','10:00','10:30','11:00','11:30'] },
  { label: 'Tarde', times: ['14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30'] },
] as const;

const HOT_TIMES = new Set(['15:00', '18:30']);

type DayInfo = {
  n: number;     // day of month
  wd: string;    // 'seg', 'ter', ...
  mo: string;    // 'dez', ...
  iso: string;   // YYYY-MM-DD
  hot: boolean;
  soldOut: boolean;
};

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { salonId } = useLocalSearchParams<{ salonId: string }>();
  const { data } = useSalon(salonId ?? '');

  const fallbackSalon = useMemo(
    () => SALONS.find(s => s.id === salonId) ?? SALONS[0],
    [salonId],
  );
  const salon = data ?? fallbackSalon;
  const services = data?.services ?? SERVICES[salon.id] ?? [];

  const serviceIds = useBooking(s => s.serviceIds);
  const setStartsAt = useBooking(s => s.setStartsAt);

  const selected = services.filter(s => serviceIds.includes(s.id));
  const total = selected.reduce((sum, i) => sum + i.price, 0);
  const totalDur = selected.reduce((sum, i) => sum + i.dur, 0);

  const [dayIdx, setDayIdx] = useState(0);
  const [time, setTime] = useState('15:00');

  const days = useMemo<DayInfo[]>(() => buildDays(), []);
  const day = days[dayIdx];
  const monthLabel = MONTHS_FULL[new Date(day.iso).getMonth()] + ' ' + new Date(day.iso).getFullYear();

  const onConfirm = () => {
    const iso = combineDayTime(day.iso, time);
    setStartsAt(iso);
    router.push({
      pathname: '/booking/confirm',
      params: { salonId: salon.id },
    } as never);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DetailHeader title="Quando?" subtitle={salon.name} onBack={() => router.back()} />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 6, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 22, paddingTop: 10 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 10,
            paddingVertical: 10, paddingHorizontal: 14,
            borderRadius: radii.md,
            backgroundColor: colors.goldSoft,
            borderWidth: 1, borderColor: 'rgba(212,175,143,0.35)',
          }}>
            <Icon name="flame" size={16} color={colors.gold} />
            <Text style={{
              flex: 1, fontFamily: fonts.sans, fontSize: 12, color: colors.text,
            }}>
              Alta demanda para festas de fim de ano. Garanta logo.
            </Text>
          </View>
        </View>

        <Text style={{
          paddingHorizontal: 22,
          paddingTop: 20,
          paddingBottom: 12,
          fontFamily: fonts.serifItalic,
          fontSize: 22,
          color: colors.text,
          letterSpacing: -0.2,
        }}>
          {monthLabel}
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 14 }}
        >
          {days.map((d, i) => {
            const sel = dayIdx === i;
            return (
              <Pressable
                key={d.iso}
                onPress={() => !d.soldOut && setDayIdx(i)}
                disabled={d.soldOut}
                style={{
                  width: 56, paddingVertical: 10,
                  borderRadius: radii.lg,
                  backgroundColor: sel ? colors.rose : 'transparent',
                  borderWidth: sel ? 0 : 1,
                  borderColor: colors.line,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  fontFamily: fonts.sansMedium,
                  fontSize: 10,
                  color: sel ? colors.ink : (d.soldOut ? colors.textFaint : colors.text),
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                  opacity: 0.7,
                }}>
                  {d.wd}
                </Text>
                <Text style={{
                  fontFamily: fonts.serif,
                  fontSize: 22,
                  lineHeight: 24,
                  color: sel ? colors.ink : (d.soldOut ? colors.textFaint : colors.text),
                  marginTop: 2,
                }}>
                  {d.n}
                </Text>
                {d.hot && !sel && (
                  <View style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 5, height: 5, borderRadius: 2.5,
                    backgroundColor: colors.gold,
                  }} />
                )}
                {d.soldOut && (
                  <Text style={{
                    fontFamily: fonts.sans, fontSize: 8, color: colors.textFaint, marginTop: 2,
                  }}>
                    cheio
                  </Text>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={{ paddingHorizontal: 22, paddingTop: 24 }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 14,
          }}>
            <Text style={{
              fontFamily: fonts.serif, fontSize: 18, color: colors.text, letterSpacing: -0.2,
            }}>
              {prettyDayLabel(day)}
            </Text>
            <Text style={{
              fontFamily: fonts.sans, fontSize: 11, color: colors.textDim,
            }}>
              7 horários disponíveis
            </Text>
          </View>

          {PERIODS.map(period => (
            <View key={period.label} style={{ marginBottom: 22 }}>
              <Text style={{
                fontFamily: fonts.sansBold,
                fontSize: 11,
                color: colors.textDim,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                {period.label}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {period.times.map((t, i) => {
                  const unavail = i % 5 === 2;
                  const hot = HOT_TIMES.has(t);
                  const sel = time === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => !unavail && setTime(t)}
                      disabled={unavail}
                      style={{
                        width: '23%',
                        height: 44,
                        borderRadius: radii.md,
                        backgroundColor: sel ? colors.rose : (unavail ? 'transparent' : colors.surface),
                        borderWidth: sel ? 0 : 1,
                        borderColor: unavail ? colors.line : colors.lineStrong,
                        alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Text style={{
                        fontFamily: sel ? fonts.sansBold : fonts.sansMedium,
                        fontSize: 13,
                        color: sel ? colors.ink : (unavail ? colors.textFaint : colors.text),
                        textDecorationLine: unavail ? 'line-through' : 'none',
                      }}>
                        {t}
                      </Text>
                      {hot && !sel && !unavail && (
                        <Text style={{
                          position: 'absolute', top: -6, right: -2,
                          fontSize: 10, color: colors.gold,
                        }}>
                          ●
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <StickyCta
        insetBottom={insets.bottom}
        subtitle={`${day.wd}, ${day.n} ${day.mo} · ${time}`}
        title={`R$ ${total || 220},00 · ${totalDur || 60} min`}
        actionLabel="Revisar"
        onPress={onConfirm}
      />
    </View>
  );
}

function buildDays(): DayInfo[] {
  const out: DayInfo[] = [];
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({
      n: d.getDate(),
      wd: WEEKDAYS[d.getDay()],
      mo: MONTHS[d.getMonth()],
      iso: toISODate(d),
      hot: i >= 7 && i <= 11,
      soldOut: i === 5 || i === 8,
    });
  }
  return out;
}

function toISODate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function combineDayTime(isoDate: string, time: string): string {
  return `${isoDate}T${time}:00`;
}

function prettyDayLabel(d: DayInfo): string {
  if (d.wd === 'sáb') return `Sábado, ${d.n} ${d.mo}`;
  if (d.wd === 'dom') return `Domingo, ${d.n} ${d.mo}`;
  const cap = d.wd.charAt(0).toUpperCase() + d.wd.slice(1);
  return `${cap}a-feira, ${d.n} ${d.mo}`;
}
