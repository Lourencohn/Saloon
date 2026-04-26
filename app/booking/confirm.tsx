// app/booking/confirm.tsx
// Mirrors prototype/saloon-screens-3.jsx → ScreenConfirm
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Btn } from '@/components/Btn';
import { Card } from '@/components/Card';
import { DetailHeader } from '@/components/DetailHeader';
import { Divider } from '@/components/Divider';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { SectionTitle } from '@/components/SectionTitle';
import { Toggle } from '@/components/Toggle';
import { PROFESSIONALS, SALONS, SERVICES } from '@/constants/mock';
import { colors, fonts, radii } from '@/constants/tokens';
import { useCreateBooking } from '@/hooks/useBookings';
import { useSalon } from '@/hooks/useSalons';
import { useAuth } from '@/stores/auth';
import { useBooking } from '@/stores/booking';
import type { IconName } from '@/types/salon';

const PAY_OPTIONS: { id: 'pix' | 'card' | 'at_salon'; icon: IconName; label: string; sub: string }[] = [
  { id: 'pix',      icon: 'pix',     label: 'Pix',                       sub: 'Confirmação imediata' },
  { id: 'card',     icon: 'card',    label: 'Crédito · final 4821',      sub: 'Em até 3x sem juros' },
  { id: 'at_salon', icon: 'sparkle', label: 'Pagar no salão',            sub: 'Dinheiro, cartão ou Pix presencial' },
];

const WEEKDAYS_FULL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

export default function ConfirmScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { salonId } = useLocalSearchParams<{ salonId: string }>();
  const user = useAuth(s => s.user);
  const { data } = useSalon(salonId ?? '');
  const createBooking = useCreateBooking();

  const fallbackSalon = useMemo(
    () => SALONS.find(s => s.id === salonId) ?? SALONS[0],
    [salonId],
  );
  const salon = data ?? fallbackSalon;
  const services = data?.services ?? SERVICES[salon.id] ?? [];
  const pros = data?.professionals ?? PROFESSIONALS[salon.id] ?? [];

  const serviceIds = useBooking(s => s.serviceIds);
  const professionalId = useBooking(s => s.professionalId);
  const startsAt = useBooking(s => s.startsAt);
  const paymentMethod = useBooking(s => s.paymentMethod);
  const setPayment = useBooking(s => s.setPayment);
  const remind = useBooking(s => s.remind);
  const setRemind = useBooking(s => s.setRemind);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = serviceIds.length
    ? services.filter(s => serviceIds.includes(s.id))
    : services.slice(0, 1);
  const subtotal = items.reduce((sum, i) => sum + i.price, 0);
  const totalDur = items.reduce((sum, i) => sum + i.dur, 0);
  const fee = 0;
  const total = subtotal + fee;

  const proObj = pros.find(p => p.id === professionalId) ?? pros[0];
  const dateLabel = formatDateLabel(startsAt);

  const onConfirm = async () => {
    if (submitting) return;
    if (!user) {
      setError('Entre na sua conta para confirmar o agendamento.');
      return;
    }
    if (!startsAt) {
      setError('Escolha um horário antes de confirmar.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createBooking.mutateAsync({
        userId: user.id,
        salonId: salon.id,
        professionalId: professionalId ?? proObj?.id ?? null,
        startsAt,
        services: items,
        paymentMethod: paymentMethod ?? 'pix',
        remind,
      });
      router.replace('/booking/success' as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível confirmar o agendamento.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DetailHeader
        title="Confirmar agendamento"
        subtitle="Revise os detalhes"
        onBack={() => router.back()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 16, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary */}
        <Card padding={0} style={{ overflow: 'hidden', marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', gap: 14, padding: 16 }}>
            <Photo seed={salon.photoSeed} radius={radii.md} style={{ width: 64, height: 64 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: fonts.serif, fontSize: 18, color: colors.text, letterSpacing: -0.2,
              }}>
                {salon.name}
              </Text>
              <Text style={{
                fontFamily: fonts.sans, fontSize: 12, color: colors.textDim, marginTop: 2,
              }}>
                {salon.address}
              </Text>
            </View>
          </View>
          <Divider />
          <View style={{ padding: 16, gap: 14 }}>
            <SumRow icon="calendar" label="Data e hora" value={dateLabel} />
            {proObj && <SumRow icon="user" label="Profissional" value={proObj.name} />}
            <SumRow icon="clock" label="Duração total" value={`${totalDur} min`} />
          </View>
        </Card>

        {/* Items */}
        <SectionTitle>Serviços</SectionTitle>
        <Card padding={16} style={{ marginBottom: 18 }}>
          {items.map((sv, i) => (
            <View
              key={sv.id}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingVertical: 8,
                borderTopWidth: i ? 1 : 0,
                borderTopColor: colors.line,
              }}
            >
              <View style={{ flex: 1, paddingRight: 12 }}>
                <Text style={{
                  fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text,
                }}>
                  {sv.name}
                </Text>
                <Text style={{
                  fontFamily: fonts.sans, fontSize: 12, color: colors.textDim, marginTop: 2,
                }}>
                  {sv.dur} min
                </Text>
              </View>
              <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.text }}>
                R$ {sv.price}
              </Text>
            </View>
          ))}
          <Divider style={{ marginVertical: 12 }} />
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline',
          }}>
            <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.textMid }}>
              Total
            </Text>
            <Text style={{
              fontFamily: fonts.serif, fontSize: 24, color: colors.gold,
            }}>
              R$ {total},00
            </Text>
          </View>
          <Text style={{
            fontFamily: fonts.sans, fontSize: 11, color: colors.textDim,
            textAlign: 'right', marginTop: 4,
          }}>
            Pagamento sem taxa adicional
          </Text>
        </Card>

        {/* Payment */}
        <SectionTitle>Pagamento</SectionTitle>
        <View style={{ gap: 10, marginBottom: 18 }}>
          {PAY_OPTIONS.map(opt => {
            const sel = paymentMethod === opt.id;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setPayment(opt.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  padding: 14,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: sel ? colors.rose : colors.line,
                  backgroundColor: sel ? colors.roseSoft : colors.surface,
                }}
              >
                <Icon
                  name={opt.icon}
                  size={22}
                  color={sel ? colors.rose : colors.text}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text,
                  }}>
                    {opt.label}
                  </Text>
                  <Text style={{
                    fontFamily: fonts.sans, fontSize: 12, color: colors.textDim, marginTop: 2,
                  }}>
                    {opt.sub}
                  </Text>
                </View>
                <View style={{
                  width: 22, height: 22, borderRadius: 11,
                  borderWidth: sel ? 6 : 1,
                  borderColor: sel ? colors.rose : colors.lineStrong,
                }} />
              </Pressable>
            );
          })}
        </View>

        {/* Reminder */}
        <Card padding={14} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="bell" size={20} color={colors.rose} />
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: fonts.sansMedium, fontSize: 13, color: colors.text,
            }}>
              Lembrete automático
            </Text>
            <Text style={{
              fontFamily: fonts.sans, fontSize: 11, color: colors.textDim, marginTop: 2,
            }}>
              Te avisamos 24h e 1h antes
            </Text>
          </View>
          <Toggle value={remind} onChange={setRemind} />
        </Card>

        <Text style={{
          fontFamily: fonts.sans, fontSize: 11, color: colors.textDim,
          textAlign: 'center', marginTop: 22, lineHeight: 18,
        }}>
          Cancelamento gratuito até 4h antes do horário.{'\n'}
          Ao confirmar, você aceita os termos do Saloon.
        </Text>
        {error && (
          <Text style={{
            fontFamily: fonts.sansMedium,
            fontSize: 12,
            color: colors.rose,
            textAlign: 'center',
            marginTop: 14,
          }}>
            {error}
          </Text>
        )}
      </ScrollView>

      <View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        paddingHorizontal: 22,
        paddingTop: 16,
        paddingBottom: insets.bottom + 16,
        backgroundColor: colors.bg,
      }}>
        <Btn
          variant="primary"
          size="lg"
          full
          onPress={onConfirm}
          disabled={submitting}
          iconLeft={submitting ? <ActivityIndicator size="small" color={colors.ink} /> : undefined}
        >
          {submitting
            ? 'Processando…'
            : paymentMethod === 'pix'
              ? `Pagar com Pix · R$ ${total},00`
              : paymentMethod === 'card'
                ? `Pagar no cartão · R$ ${total},00`
                : `Confirmar agendamento · R$ ${total},00`}
        </Btn>
      </View>
    </View>
  );
}

function formatShortDate(iso: string | undefined): string {
  if (!iso) return 'Hoje';
  const d = new Date(iso.split('T')[0]);
  if (Number.isNaN(d.getTime())) return 'Hoje';
  const wd = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.getDay()];
  return `${wd}, ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function extractTime(iso: string | undefined): string {
  if (!iso) return '15:00';
  const part = iso.split('T')[1] ?? '15:00:00';
  return part.slice(0, 5);
}

function daysFromNow(iso: string | undefined): number {
  if (!iso) return 0;
  const target = new Date(iso.split('T')[0]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = target.getTime() - today.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

function SumRow({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <View style={{
        width: 36, height: 36, borderRadius: radii.sm,
        backgroundColor: colors.surfaceHi,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={16} color={colors.rose} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontFamily: fonts.sansMedium, fontSize: 11, color: colors.textDim, letterSpacing: 0.4,
        }}>
          {label}
        </Text>
        <Text style={{
          fontFamily: fonts.sans, fontSize: 14, color: colors.text, marginTop: 2,
        }}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function formatDateLabel(iso: string | undefined): string {
  if (!iso) return 'Hoje · 15:00';
  const [date, time] = iso.split('T');
  if (!date || !time) return 'Hoje · 15:00';
  const d = new Date(date);
  const wd = WEEKDAYS_FULL[d.getDay()].slice(0, 3).toLowerCase();
  const cap = wd.charAt(0).toUpperCase() + wd.slice(1);
  return `${cap}, ${d.getDate()} ${MONTHS[d.getMonth()]} · ${time.slice(0, 5)}`;
}
