// app/(tabs)/bookings.tsx
// Mirrors prototype/saloon-screens-4.jsx → ScreenBookings
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Btn } from '@/components/Btn';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { Pill } from '@/components/Pill';
import { colors, fonts, radii } from '@/constants/tokens';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/stores/auth';
import { useAgenda } from '@/stores/agenda';
import type { Booking, IconName } from '@/types/salon';

type Tab = 'upcoming' | 'past';

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [showYearEnd, setShowYearEnd] = useState(true);

  const userId = useAuth(s => s.user?.id);
  const fallbackBookings = useAgenda(s => s.bookings);
  const { data } = useBookings(userId);
  const bookings = data?.length ? data : fallbackBookings;
  const upcoming = useMemo(() => bookings.filter(b => b.status === 'confirmed'), [bookings]);
  const past = useMemo(() => bookings.filter(b => b.status === 'past'), [bookings]);

  const goSearch = () => router.push('/search' as never);
  const goReview = (id: string) => router.push(`/review/${id}` as never);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ paddingHorizontal: 22 }}>
        <Text style={{
          fontFamily: fonts.serif, fontSize: 32, color: colors.text, letterSpacing: -0.4,
        }}>
          Sua agenda
        </Text>
        <Text style={{
          fontFamily: fonts.sans, fontSize: 13, color: colors.textDim, marginTop: 4, marginBottom: 22,
        }}>
          {upcoming.length} horários marcados · {past.length} atendimentos no histórico
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        gap: 26,
        paddingHorizontal: 22,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
        marginBottom: 18,
      }}>
        {([
          { id: 'upcoming', label: 'Próximos' },
          { id: 'past',     label: 'Histórico' },
        ] as const).map(t => {
          const on = tab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setTab(t.id)}
              style={{
                paddingVertical: 12,
                borderBottomWidth: 2,
                borderBottomColor: on ? colors.rose : 'transparent',
                marginBottom: -1,
              }}
            >
              <Text style={{
                fontFamily: on ? fonts.sansBold : fonts.sansMedium,
                fontSize: 14,
                color: on ? colors.text : colors.textDim,
              }}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ paddingHorizontal: 22, paddingBottom: 24 }}>
        {tab === 'upcoming' && (
          <>
            {showYearEnd && (
              <YearEndReminder onAction={goSearch} />
            )}
            {upcoming.length === 0 ? (
              <EmptyState
                icon="calendar"
                title="Nada marcado por aqui"
                hint="Encontre um salão e garanta seu próximo horário."
                ctaLabel="Explorar salões"
                onPress={goSearch}
              />
            ) : (
              <View style={{ gap: 14 }}>
                {upcoming.map(b => <UpcomingCard key={b.id} booking={b} />)}
              </View>
            )}
          </>
        )}
        {tab === 'past' && (
          past.length === 0 ? (
            <EmptyState
              icon="clock"
              title="Sem histórico ainda"
              hint="Quando você concluir um atendimento, ele aparece aqui."
            />
          ) : (
            <View style={{ gap: 14 }}>
              {past.map(b => (
                <PastCard
                  key={b.id}
                  booking={b}
                  onReview={() => goReview(b.id)}
                />
              ))}
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}

function UpcomingCard({ booking }: { booking: Booking }) {
  return (
    <Card padding={0} style={{ overflow: 'hidden' }}>
      <View style={{ padding: 16, flexDirection: 'row', gap: 14 }}>
        <Photo
          seed={booking.photoSeed}
          radius={radii.md}
          style={{ width: 64, height: 64 }}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4, flexWrap: 'wrap',
          }}>
            <Pill tone="live" size="xs">● confirmado</Pill>
            {booking.daysAway !== undefined && booking.daysAway <= 3 && (
              <Pill tone="quiet" size="xs">em {booking.daysAway} dias</Pill>
            )}
          </View>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.serif, fontSize: 18, color: colors.text, letterSpacing: -0.2,
            }}
          >
            {booking.salon}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.sans, fontSize: 12, color: colors.textMid, marginTop: 4,
            }}
          >
            {booking.service}
          </Text>
        </View>
      </View>
      <Divider />
      <View style={{
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 18,
        backgroundColor: 'rgba(245,230,211,0.02)',
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="calendar" size={14} color={colors.rose} />
          <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text }}>
            {booking.date}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="clock" size={14} color={colors.rose} />
          <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.text }}>
            {booking.time}
          </Text>
        </View>
        <View style={{ flex: 1 }} />
        <Btn size="sm" variant="secondary">Detalhes</Btn>
      </View>
    </Card>
  );
}

function PastCard({
  booking, onReview,
}: {
  booking: Booking;
  onReview: () => void;
}) {
  return (
    <Card padding={14} style={{ flexDirection: 'row', gap: 14 }}>
      <Photo
        seed={booking.photoSeed}
        radius={radii.md}
        style={{ width: 56, height: 56 }}
      />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fonts.serif, fontSize: 16, color: colors.text, letterSpacing: -0.2,
          }}
        >
          {booking.salon}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fonts.sans, fontSize: 12, color: colors.textMid, marginTop: 2,
          }}
        >
          {booking.service}
        </Text>
        <Text style={{
          fontFamily: fonts.sans, fontSize: 11, color: colors.textDim, marginTop: 4,
        }}>
          {booking.date} · R$ {booking.price}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        {booking.rated ? (
          <View style={{ flexDirection: 'row', gap: 1 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Icon
                key={i}
                name="star"
                size={11}
                filled
                color={i <= (booking.rating ?? 0) ? colors.gold : colors.lineStrong}
              />
            ))}
          </View>
        ) : (
          <Pressable onPress={onReview} hitSlop={8}>
            <Text style={{
              fontFamily: fonts.sansMedium, fontSize: 12, color: colors.rose,
            }}>
              Avaliar →
            </Text>
          </Pressable>
        )}
        <Pressable
          hitSlop={8}
          style={{
            borderWidth: 1, borderColor: colors.line,
            borderRadius: radii.pill,
            paddingVertical: 4, paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontFamily: fonts.sansMedium, fontSize: 11, color: colors.text }}>
            Repetir
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

function YearEndReminder({ onAction }: { onAction: () => void }) {
  return (
    <Card padding={16} style={{
      marginBottom: 16,
      borderColor: 'rgba(212,175,143,0.2)',
    }}>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
      }}>
        <Icon name="diamond" size={16} color={colors.gold} />
        <Text style={{
          fontFamily: fonts.sansBold, fontSize: 11,
          letterSpacing: 1.5, textTransform: 'uppercase',
          color: colors.gold,
        }}>
          Lembrete · Réveillon
        </Text>
      </View>
      <Text style={{
        fontFamily: fonts.serif, fontSize: 19, color: colors.text,
        letterSpacing: -0.2, marginBottom: 6,
      }}>
        Você ainda não marcou para 31/12.
      </Text>
      <Text style={{
        fontFamily: fonts.sans, fontSize: 12, color: colors.textMid, marginBottom: 12,
      }}>
        Faltam 8 vagas em Casa Lavanda — onde você foi nos últimos 3 anos.
      </Text>
      <Btn
        size="sm"
        variant="gold"
        onPress={onAction}
        iconRight={<Icon name="arrow" size={14} color={colors.ink} />}
      >
        Garantir horário
      </Btn>
    </Card>
  );
}

function EmptyState({
  icon, title, hint, ctaLabel, onPress,
}: {
  icon: IconName;
  title: string;
  hint: string;
  ctaLabel?: string;
  onPress?: () => void;
}) {
  return (
    <View style={{
      alignItems: 'center',
      paddingVertical: 36,
      paddingHorizontal: 18,
    }}>
      <View style={{
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: colors.surfaceHi,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon name={icon} size={22} color={colors.rose} />
      </View>
      <Text style={{
        fontFamily: fonts.serifItalic, fontSize: 22, color: colors.text,
        textAlign: 'center', letterSpacing: -0.2, marginBottom: 8,
      }}>
        {title}
      </Text>
      <Text style={{
        fontFamily: fonts.sans, fontSize: 13, color: colors.textMid,
        textAlign: 'center', maxWidth: 260, marginBottom: ctaLabel ? 18 : 0,
        lineHeight: 20,
      }}>
        {hint}
      </Text>
      {ctaLabel && onPress && (
        <Btn
          variant="primary"
          size="sm"
          onPress={onPress}
          iconRight={<Icon name="arrow" size={14} color={colors.ink} />}
        >
          {ctaLabel}
        </Btn>
      )}
    </View>
  );
}
