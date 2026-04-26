// app/(tabs)/index.tsx — Home screen
// Mirrors prototype/saloon-screens-1.jsx → ScreenHome
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { GradientOverlay } from '@/components/GradientOverlay';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { Pill } from '@/components/Pill';
import { SalonRow } from '@/components/SalonRow';
import { SectionTitle } from '@/components/SectionTitle';
import { Btn } from '@/components/Btn';
import { CATEGORIES, SALONS } from '@/constants/mock';
import { colors, fonts, radii } from '@/constants/tokens';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useSalons } from '@/hooks/useSalons';
import { useAuth } from '@/stores/auth';
import type { IconName, Salon } from '@/types/salon';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuth(s => s.user);
  const userName = user?.name;
  const firstName = userName?.split(' ')[0] ?? 'visitante';

  const [cat, setCat] = useState<string>('all');
  const [favs, setFavs] = useState<Record<string, boolean>>({ s1: true, s4: true });
  const [showYearEnd, setShowYearEnd] = useState(true);
  const { data } = useSalons();
  const { data: favoriteIds = [] } = useFavorites(user?.id);
  const toggleFavorite = useToggleFavorite();
  const salons = data?.length ? data : SALONS;

  const featured = salons[0];
  const list = salons.slice(1);

  const isFav = (id: string) => favoriteIds.includes(id) || !!favs[id];
  const toggleFav = (id: string) => {
    if (user) {
      toggleFavorite.mutate({ userId: user.id, salonId: id, favorite: favoriteIds.includes(id) });
    }
    setFavs(f => ({ ...f, [id]: !f[id] }));
  };

  const goSearch = () => router.push('/search' as never);
  const goSalon = (id: string) => router.push(`/salon/${id}` as never);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Header
        firstName={firstName}
        onBellPress={() => { /* notifications, future */ }}
      />

      <View style={{ paddingHorizontal: 22, paddingBottom: 16 }}>
        <SearchTrigger onPress={goSearch} />
        <LiveStrip count={14} />
      </View>

      {showYearEnd && (
        <YearEndBanner
          onDismiss={() => setShowYearEnd(false)}
          onAction={goSearch}
        />
      )}

      <CategoryRow active={cat} onChange={setCat} />

      <View style={{ paddingHorizontal: 22, paddingBottom: 24 }}>
        <SectionTitle action="Ver todos" onActionPress={goSearch}>
          Selecionados para você
        </SectionTitle>
        <FeaturedCard
          salon={featured}
          fav={isFav(featured.id)}
          onFav={() => toggleFav(featured.id)}
          onPress={() => goSalon(featured.id)}
        />
      </View>

      <View style={{ paddingHorizontal: 22, paddingBottom: 28 }}>
        <SectionTitle>Próximos a você</SectionTitle>
        <View style={{ gap: 14 }}>
          {list.map(s => (
            <SalonRow
              key={s.id}
              salon={s}
              fav={isFav(s.id)}
              onFav={() => toggleFav(s.id)}
              onPress={() => goSalon(s.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

// ─── Header ──────────────────────────────────────────────────────────

function Header({ firstName, onBellPress }: { firstName: string; onBellPress: () => void }) {
  return (
    <View style={{
      paddingHorizontal: 22,
      paddingBottom: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={1}
          style={{
            fontFamily: fonts.sansMedium,
            fontSize: 12,
            color: colors.textDim,
            letterSpacing: 0.4,
          }}
        >
          {greeting()}, {firstName}
        </Text>
        <Text style={{
          fontFamily: fonts.serifItalic,
          fontSize: 26,
          color: colors.text,
          letterSpacing: -0.3,
          marginTop: 2,
        }}>
          O que vamos cuidar hoje?
        </Text>
      </View>
      <Pressable
        onPress={onBellPress}
        hitSlop={8}
        style={{
          width: 44, height: 44, borderRadius: 22,
          borderWidth: 1, borderColor: colors.lineStrong,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="bell" size={20} color={colors.text} />
        <View style={{
          position: 'absolute', top: 8, right: 9,
          width: 8, height: 8, borderRadius: 4,
          backgroundColor: colors.rose,
          borderWidth: 2, borderColor: colors.bg,
        }} />
      </Pressable>
    </View>
  );
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5)  return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// ─── Search trigger ──────────────────────────────────────────────────

function SearchTrigger({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        marginTop: 18,
        height: 52,
        borderRadius: radii.pill,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
        paddingHorizontal: 18,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Icon name="search" size={20} color={colors.textDim} />
      <Text style={{
        flex: 1,
        color: colors.textDim,
        fontFamily: fonts.sans,
        fontSize: 14,
      }}>
        Buscar serviço, salão ou bairro
      </Text>
      <Icon name="filter" size={18} color={colors.textDim} />
    </Pressable>
  );
}

// ─── Live availability ───────────────────────────────────────────────

function LiveStrip({ count }: { count: number }) {
  return (
    <View style={{
      marginTop: 14,
      paddingVertical: 10,
      paddingHorizontal: 14,
      borderRadius: radii.md,
      backgroundColor: 'rgba(155,184,154,0.08)',
      borderWidth: 1,
      borderColor: 'rgba(155,184,154,0.18)',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    }}>
      <View style={{
        width: 8, height: 8, borderRadius: 4,
        backgroundColor: colors.success,
      }} />
      <Text style={{
        flex: 1,
        fontFamily: fonts.sans,
        fontSize: 12,
        color: colors.textMid,
      }}>
        <Text style={{ color: colors.text, fontFamily: fonts.sansBold }}>
          {count} salões
        </Text>
        {' com horário disponível agora'}
      </Text>
    </View>
  );
}

// ─── Year-end banner ─────────────────────────────────────────────────

function YearEndBanner({
  onDismiss, onAction,
}: { onDismiss: () => void; onAction: () => void }) {
  return (
    <View style={{ paddingHorizontal: 22, paddingBottom: 18 }}>
      <View style={{
        position: 'relative',
        borderRadius: radii.lg,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.goldSoft,
        padding: 18,
      }}>
        <Pressable
          onPress={onDismiss}
          hitSlop={8}
          style={{ position: 'absolute', top: 10, right: 10, padding: 4 }}
        >
          <Icon name="close" size={16} color={colors.textDim} />
        </Pressable>

        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8,
        }}>
          <Icon name="flame" size={18} color={colors.gold} />
          <Text style={{
            fontFamily: fonts.sansBold,
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            color: colors.gold,
          }}>
            Alta demanda · Fim de ano
          </Text>
        </View>

        <Text style={{
          fontFamily: fonts.serif,
          fontSize: 22,
          lineHeight: 26,
          color: colors.text,
          letterSpacing: -0.3,
          marginBottom: 6,
          maxWidth: 280,
        }}>
          Antes que esgote: garanta seu horário para as festas.
        </Text>

        <Text style={{
          fontFamily: fonts.sans,
          fontSize: 13,
          color: colors.textMid,
          marginBottom: 14,
        }}>
          73% dos horários entre 20–31 dez já estão ocupados.
        </Text>

        <Btn
          size="sm"
          variant="gold"
          onPress={onAction}
          iconRight={<Icon name="arrow" size={14} color={colors.ink} />}
        >
          Ver disponibilidade
        </Btn>
      </View>
    </View>
  );
}

// ─── Category row ────────────────────────────────────────────────────

function CategoryRow({
  active, onChange,
}: { active: string; onChange: (id: string) => void }) {
  const items: { id: string; label: string; icon: IconName }[] = [
    { id: 'all', label: 'Tudo', icon: 'sparkle' },
    ...CATEGORIES,
  ];

  return (
    <View style={{ paddingTop: 6, paddingBottom: 18 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 22, gap: 10 }}
      >
        {items.map(c => {
          const on = active === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => onChange(c.id)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                height: 40,
                paddingHorizontal: 16,
                borderRadius: radii.pill,
                backgroundColor: on ? colors.text : 'transparent',
                borderWidth: on ? 0 : 1,
                borderColor: colors.line,
              }}
            >
              <Icon
                name={c.icon}
                size={16}
                color={on ? colors.ink : colors.textMid}
              />
              <Text style={{
                fontFamily: on ? fonts.sansBold : fonts.sansMedium,
                fontSize: 13,
                color: on ? colors.ink : colors.textMid,
              }}>
                {c.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── Featured card ───────────────────────────────────────────────────

function FeaturedCard({
  salon, fav, onFav, onPress,
}: {
  salon: Salon; fav: boolean; onFav: () => void; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={{ borderRadius: radii.xl, overflow: 'hidden' }}>
      <Photo seed={salon.photoSeed} height={360} radius={radii.xl}>
        <GradientOverlay />

        <Pressable
          onPress={onFav}
          hitSlop={8}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 40, height: 40, borderRadius: 20,
            backgroundColor: 'rgba(21,16,26,0.5)',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon
            name="heart"
            size={20}
            filled={fav}
            color={fav ? colors.rose : colors.text}
          />
        </Pressable>

        <View style={{
          position: 'absolute', top: 16, left: 16,
          flexDirection: 'row', gap: 6,
        }}>
          <Pill tone="solid" size="xs">Curadoria</Pill>
          <Pill tone="live" size="xs">● disponível agora</Pill>
        </View>

        <View style={{ position: 'absolute', left: 20, right: 20, bottom: 20 }}>
          <Text style={{
            fontFamily: fonts.serif, fontSize: 28, color: colors.text,
            letterSpacing: -0.4,
          }}>
            {salon.name}
          </Text>
          <Text style={{
            fontFamily: fonts.sans, fontSize: 13, color: colors.textMid, marginTop: 4,
          }}>
            {salon.tagline}
          </Text>
          <View style={{
            flexDirection: 'row', gap: 14, marginTop: 12, alignItems: 'center',
          }}>
            <MetaItem icon="star" iconFilled iconColor={colors.gold}>
              <Text style={{ color: colors.text, fontFamily: fonts.sansBold }}>
                {salon.rating}
              </Text>
              {` · ${salon.reviews}`}
            </MetaItem>
            <MetaItem icon="pin">{salon.distance}</MetaItem>
            <MetaItem icon="clock">{salon.nextSlot}</MetaItem>
          </View>
        </View>
      </Photo>
    </Pressable>
  );
}

function MetaItem({
  icon, iconFilled, iconColor, children,
}: {
  icon: IconName;
  iconFilled?: boolean;
  iconColor?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Icon
        name={icon}
        size={13}
        filled={iconFilled}
        color={iconColor ?? colors.textMid}
      />
      <Text style={{
        fontFamily: fonts.sans, fontSize: 12, color: colors.textMid,
      }}>
        {children}
      </Text>
    </View>
  );
}
