// app/(tabs)/search.tsx
// Mirrors prototype/saloon-screens-2.jsx → ScreenSearch
import { useMemo, useState } from 'react';
import {
  Pressable, ScrollView, Text, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Btn } from '@/components/Btn';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { SalonRow } from '@/components/SalonRow';
import { Sheet } from '@/components/Sheet';
import { CATEGORIES, SALONS } from '@/constants/mock';
import { colors, fonts, radii } from '@/constants/tokens';
import { useFavorites, useToggleFavorite } from '@/hooks/useFavorites';
import { useSalons } from '@/hooks/useSalons';
import { useAuth } from '@/stores/auth';

const QUICK_CHIPS = [
  'Disponível agora', 'Até 2 km', 'Combo', 'Aceita Pix', 'Aberto até 21h',
];

type Filters = {
  cat: string;
  dist: number;     // km
  price: number;    // 1..4
  time: 'now' | 'today' | 'week' | 'any';
};

const DEFAULT_FILTERS: Filters = { cat: 'all', dist: 5, price: 3, time: 'any' };

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [favs, setFavs] = useState<Record<string, boolean>>({ s1: true, s4: true });
  const user = useAuth(s => s.user);
  const { data } = useSalons();
  const { data: favoriteIds = [] } = useFavorites(user?.id);
  const toggleFavorite = useToggleFavorite();
  const salons = data?.length ? data : SALONS;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byText = !q ? salons : salons.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.neighborhood.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q)
    );
    if (filters.cat === 'all') return byText;
    return byText.filter(s => s.badges.some(b => b.toLowerCase().includes(filters.cat)));
  }, [query, salons, filters.cat]);

  const isFav = (id: string) => favoriteIds.includes(id) || !!favs[id];
  const toggleFav = (id: string) => {
    if (user) {
      toggleFavorite.mutate({ userId: user.id, salonId: id, favorite: favoriteIds.includes(id) });
    }
    setFavs(f => ({ ...f, [id]: !f[id] }));
  };

  const goSalon = (id: string) =>
    router.push(`/salon/${id}` as never);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{
        paddingTop: insets.top + 4,
        paddingHorizontal: 16,
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={{
              width: 40, height: 40, borderRadius: 20,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="back" size={22} color={colors.text} />
          </Pressable>
          <View style={{
            flex: 1, height: 44,
            borderRadius: radii.pill,
            backgroundColor: colors.surface,
            borderWidth: 1, borderColor: colors.lineStrong,
            paddingHorizontal: 16,
            flexDirection: 'row', alignItems: 'center', gap: 10,
          }}>
            <Icon name="search" size={18} color={colors.textDim} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholder="Buscar salão, serviço, bairro"
              placeholderTextColor={colors.textDim}
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fonts.sans,
                fontSize: 14,
                padding: 0,
              }}
            />
          </View>
          <Pressable
            onPress={() => setShowFilter(true)}
            hitSlop={8}
            style={{
              width: 44, height: 44, borderRadius: 22,
              borderWidth: 1, borderColor: colors.lineStrong,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="filter" size={18} color={colors.text} />
            <View style={{
              position: 'absolute', top: 6, right: 6,
              width: 8, height: 8, borderRadius: 4,
              backgroundColor: colors.rose,
            }} />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginTop: 14 }}
          style={{ marginTop: 14 }}
        >
          {QUICK_CHIPS.map((c, i) => (
            <View
              key={c}
              style={{
                height: 32, paddingHorizontal: 14,
                borderRadius: radii.pill,
                backgroundColor: i === 0 ? colors.roseSoft : 'transparent',
                borderWidth: 1,
                borderColor: i === 0 ? colors.roseDeep : colors.line,
                flexDirection: 'row', alignItems: 'center', gap: 6,
              }}
            >
              <Text style={{
                color: i === 0 ? colors.rose : colors.textMid,
                fontFamily: fonts.sansMedium,
                fontSize: 12,
              }}>
                {i === 0 ? `● ${c}` : c}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 22, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{
          fontFamily: fonts.sansMedium,
          fontSize: 12,
          color: colors.textDim,
          letterSpacing: 0.4,
          marginBottom: 14,
        }}>
          {filtered.length} resultados · ordenado por relevância
        </Text>
        <View style={{ gap: 14 }}>
          {filtered.map(s => (
            <SalonRow
              key={s.id}
              salon={s}
              fav={isFav(s.id)}
              onFav={() => toggleFav(s.id)}
              onPress={() => goSalon(s.id)}
            />
          ))}
        </View>
      </ScrollView>

      <Sheet
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        title="Filtros"
      >
        <FilterGroup label="Categoria">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[{ id: 'all', label: 'Tudo' }, ...CATEGORIES.slice(0, 6)].map(c => (
              <Chip
                key={c.id}
                active={filters.cat === c.id}
                onPress={() => setFilters({ ...filters, cat: c.id })}
              >
                {c.label}
              </Chip>
            ))}
          </View>
        </FilterGroup>

        <FilterGroup label="Distância" value={`Até ${filters.dist} km`}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {[1, 2, 5, 10].map(km => (
              <Chip
                key={km}
                active={filters.dist === km}
                onPress={() => setFilters({ ...filters, dist: km })}
              >
                {km} km
              </Chip>
            ))}
          </View>
        </FilterGroup>

        <FilterGroup label="Preço">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['$', '$$', '$$$', '$$$$'].map((p, i) => (
              <Chip
                key={p}
                active={filters.price === i + 1}
                onPress={() => setFilters({ ...filters, price: i + 1 })}
              >
                {p}
              </Chip>
            ))}
          </View>
        </FilterGroup>

        <FilterGroup label="Disponibilidade">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {([
              { id: 'now',   label: 'Agora' },
              { id: 'today', label: 'Hoje' },
              { id: 'week',  label: 'Esta semana' },
              { id: 'any',   label: 'Qualquer' },
            ] as const).map(t => (
              <Chip
                key={t.id}
                active={filters.time === t.id}
                onPress={() => setFilters({ ...filters, time: t.id })}
              >
                {t.label}
              </Chip>
            ))}
          </View>
        </FilterGroup>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Btn
              variant="secondary"
              full
              onPress={() => setFilters(DEFAULT_FILTERS)}
            >
              Limpar
            </Btn>
          </View>
          <View style={{ flex: 1 }}>
            <Btn
              variant="primary"
              full
              onPress={() => setShowFilter(false)}
            >
              Aplicar filtros
            </Btn>
          </View>
        </View>
      </Sheet>
    </View>
  );
}

function FilterGroup({
  label, value, children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 22 }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 12,
      }}>
        <Text style={{
          fontFamily: fonts.sansMedium,
          fontSize: 13,
          color: colors.text,
          letterSpacing: 0.2,
        }}>
          {label}
        </Text>
        {value && (
          <Text style={{
            fontFamily: fonts.sans,
            fontSize: 12,
            color: colors.rose,
          }}>
            {value}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}
