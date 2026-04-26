// app/(tabs)/profile.tsx
// Mirrors prototype/saloon-screens-4.jsx → ScreenProfile
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { Pill } from '@/components/Pill';
import { SectionTitle } from '@/components/SectionTitle';
import { SALONS } from '@/constants/mock';
import { colors, fonts, radii } from '@/constants/tokens';
import { useAgenda } from '@/stores/agenda';
import { useAuth } from '@/stores/auth';
import type { IconName } from '@/types/salon';

const MENU: { i: IconName; l: string; s?: string }[] = [
  { i: 'card',    l: 'Métodos de pagamento', s: '2 cartões salvos' },
  { i: 'bell',    l: 'Notificações',         s: 'Lembretes e ofertas' },
  { i: 'pin',     l: 'Endereços',            s: 'São Paulo · Vila Madalena' },
  { i: 'sparkle', l: 'Preferências',         s: 'Profissional e estilo favoritos' },
  { i: 'user',    l: 'Privacidade e dados' },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const user = useAuth(s => s.user);
  const logout = useAuth(s => s.logout);
  const bookings = useAgenda(s => s.bookings);

  const totalBookings = bookings.length;
  const totalInvested = bookings.reduce((sum, b) => sum + b.price, 0);
  const ratedBookings = bookings.filter(b => b.rated && b.rating);
  const avgRating = ratedBookings.length
    ? (ratedBookings.reduce((sum, b) => sum + (b.rating ?? 0), 0) / ratedBookings.length).toFixed(1)
    : '—';

  const stats = [
    { n: String(totalBookings), l: 'Atendimentos' },
    { n: formatBRL(totalInvested), l: 'Investido' },
    { n: avgRating, l: 'Sua nota' },
  ];

  const memberLabel = formatMembership(user?.memberSince);
  const favorites = SALONS.filter(s => s.favorite);

  const goSalon = (id: string) => router.push(`/salon/${id}` as never);

  const onLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Você poderá entrar de novo a qualquer momento.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout },
      ],
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 32, paddingHorizontal: 22 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 24,
      }}>
        <Text style={{
          fontFamily: fonts.serif, fontSize: 28, color: colors.text, letterSpacing: -0.4,
        }}>
          Perfil
        </Text>
        <Pressable
          hitSlop={8}
          style={{
            width: 40, height: 40, borderRadius: 20,
            borderWidth: 1, borderColor: colors.lineStrong,
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="more" size={18} color={colors.text} />
        </Pressable>
      </View>

      <Card padding={20} style={{
        marginBottom: 18,
        flexDirection: 'row', gap: 16, alignItems: 'center',
      }}>
        <Photo seed={user?.avatarSeed ?? 3} radius={36} style={{ width: 72, height: 72 }} />
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.serif, fontSize: 22, color: colors.text, letterSpacing: -0.2,
            }}
          >
            {user?.name ?? 'Visitante'}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: fonts.sans, fontSize: 12, color: colors.textDim, marginTop: 2,
            }}
          >
            {user?.email ?? '—'}
          </Text>
          <View style={{ marginTop: 8, flexDirection: 'row' }}>
            <Pill tone="gold" size="xs">★ Saloon Membro · {memberLabel}</Pill>
          </View>
        </View>
      </Card>

      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 24 }}>
        {stats.map(s => (
          <Card
            key={s.l}
            padding={14}
            style={{ flex: 1, alignItems: 'center' }}
          >
            <Text style={{
              fontFamily: fonts.serif, fontSize: 24, color: colors.gold, lineHeight: 24,
            }}>
              {s.n}
            </Text>
            <Text style={{
              fontFamily: fonts.sansMedium, fontSize: 10, color: colors.textDim,
              marginTop: 6, letterSpacing: 0.6, textTransform: 'uppercase',
              textAlign: 'center',
            }}>
              {s.l}
            </Text>
          </Card>
        ))}
      </View>

      <SectionTitle action="Ver todos">Salões favoritos</SectionTitle>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 12, paddingBottom: 4 }}
        style={{ marginBottom: 24, marginHorizontal: -22, paddingHorizontal: 22 }}
      >
        {favorites.map(s => (
          <Pressable
            key={s.id}
            onPress={() => goSalon(s.id)}
            style={{ width: 140 }}
          >
            <Photo
              seed={s.photoSeed}
              radius={radii.md}
              style={{ width: 140, height: 140, marginBottom: 10 }}
            />
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.serif, fontSize: 15, color: colors.text, letterSpacing: -0.1,
              }}
            >
              {s.name}
            </Text>
            <Text style={{
              fontFamily: fonts.sans, fontSize: 11, color: colors.textDim, marginTop: 2,
            }}>
              {s.neighborhood}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <SectionTitle>Conta</SectionTitle>
      <Card padding={0} style={{ overflow: 'hidden' }}>
        {MENU.map((row, i) => (
          <Pressable
            key={row.l}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
              paddingVertical: 14,
              paddingHorizontal: 16,
              borderBottomWidth: i < MENU.length - 1 ? 1 : 0,
              borderBottomColor: colors.line,
            }}
          >
            <Icon name={row.i} size={18} color={colors.rose} />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: fonts.sansMedium, fontSize: 14, color: colors.text,
              }}>
                {row.l}
              </Text>
              {row.s && (
                <Text style={{
                  fontFamily: fonts.sans, fontSize: 11, color: colors.textDim, marginTop: 2,
                }}>
                  {row.s}
                </Text>
              )}
            </View>
            <Icon name="chevron" size={16} color={colors.textDim} />
          </Pressable>
        ))}
      </Card>

      <Card padding={0} style={{ overflow: 'hidden', marginTop: 12 }}>
        <Pressable
          onPress={onLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
          }}
        >
          <Icon name="arrow" size={18} color={colors.roseDeep} />
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: fonts.sansMedium, fontSize: 14, color: colors.roseDeep,
            }}>
              Sair da conta
            </Text>
            {user?.email && (
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.sans, fontSize: 11, color: colors.textDim, marginTop: 2,
                }}
              >
                Conectada como {user.email}
              </Text>
            )}
          </View>
          <Icon name="chevron" size={16} color={colors.roseDeep} />
        </Pressable>
      </Card>

      <Text style={{
        textAlign: 'center', marginTop: 24,
        fontFamily: fonts.serifItalic,
        fontSize: 11, color: colors.textFaint,
        letterSpacing: 0.4,
      }}>
        Saloon · v1.4.2
      </Text>
    </ScrollView>
  );
}

function formatBRL(value: number): string {
  if (value === 0) return 'R$ 0';
  if (value < 1000) return `R$ ${value}`;
  const k = (value / 1000).toFixed(1).replace('.', ',');
  return `R$ ${k}k`;
}

function formatMembership(iso: string | undefined): string {
  if (!iso) return 'novo';
  const start = new Date(iso);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12
    + (now.getMonth() - start.getMonth());
  if (months < 1) return 'recém-chegada';
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'ano' : 'anos'}`;
}
