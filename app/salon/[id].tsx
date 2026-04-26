// app/salon/[id].tsx
// Mirrors prototype/saloon-screens-2.jsx → ScreenSalon
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Btn } from '@/components/Btn';
import { Card } from '@/components/Card';
import { Divider } from '@/components/Divider';
import { GradientOverlay } from '@/components/GradientOverlay';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { Pill } from '@/components/Pill';
import { ServiceRow } from '@/components/ServiceRow';
import { PROFESSIONALS, REVIEW_DEFAULT, REVIEWS_BY_SALON, SALONS, SERVICES } from '@/constants/mock';
import { colors, fonts, radii } from '@/constants/tokens';
import { useBooking } from '@/stores/booking';
import type { IconName, Professional, Review, Salon, Service } from '@/types/salon';

type Tab = 'servicos' | 'profissionais' | 'avaliacoes' | 'sobre';

export default function SalonScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const setSalon = useBooking(s => s.setSalon);
  const toggleService = useBooking(s => s.toggleService);

  const salon = useMemo<Salon>(
    () => SALONS.find(s => s.id === id) ?? SALONS[0],
    [id],
  );
  const services = SERVICES[salon.id] ?? [];
  const pros = PROFESSIONALS[salon.id] ?? [];
  const reviews = REVIEWS_BY_SALON[salon.id] ?? REVIEW_DEFAULT;
  const cats = useMemo(() => Array.from(new Set(services.map(s => s.cat))), [services]);

  const [tab, setTab] = useState<Tab>('servicos');
  const [fav, setFav] = useState(!!salon.favorite);

  const goSelect = (presetServiceId?: string) => {
    setSalon(salon.id);
    if (presetServiceId) toggleService(presetServiceId);
    router.push({ pathname: '/booking/select', params: { salonId: salon.id } } as never);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View>
        <Photo seed={salon.photoSeed} radius={0} height={320}>
          <GradientOverlay
            stops={[
              { offset: 0,   opacity: 0.6 },
              { offset: 0.3, opacity: 0   },
              { offset: 0.7, opacity: 0.4 },
              { offset: 1,   opacity: 1   },
            ]}
          />
        </Photo>

        <View style={{
          position: 'absolute', top: insets.top + 4, left: 16, right: 16,
          flexDirection: 'row', justifyContent: 'space-between',
        }}>
          <ChromeBtn icon="back" onPress={() => router.back()} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <ChromeBtn icon="share" />
            <ChromeBtn
              icon="heart"
              filled={fav}
              color={fav ? colors.rose : colors.text}
              onPress={() => setFav(f => !f)}
            />
          </View>
        </View>

        <View style={{
          position: 'absolute', bottom: 16, right: 16,
          paddingVertical: 6, paddingHorizontal: 12,
          borderRadius: radii.pill,
          backgroundColor: 'rgba(21,16,26,0.7)',
          flexDirection: 'row', alignItems: 'center', gap: 6,
        }}>
          <Icon name="sparkle" size={13} color={colors.text} />
          <Text style={{
            fontFamily: fonts.sansMedium, fontSize: 12, color: colors.text,
          }}>
            1 / 24 fotos
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 22, marginTop: -16 }}>
        {/* Title */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {salon.badges.map(b => <Pill key={b} tone="gold" size="xs">{b}</Pill>)}
          </View>
          <Text style={{
            fontFamily: fonts.serif, fontSize: 32, color: colors.text,
            letterSpacing: -0.4, lineHeight: 34,
          }}>
            {salon.name}
          </Text>
          <Text style={{
            fontFamily: fonts.sans, fontSize: 13, color: colors.textMid, marginTop: 6,
          }}>
            {salon.tagline}
          </Text>
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 10,
            marginTop: 14, flexWrap: 'wrap',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={14} filled color={colors.gold} />
              <Text style={{
                fontFamily: fonts.sansBold, fontSize: 13, color: colors.text,
              }}>
                {salon.rating}
              </Text>
              <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textDim }}>
                ({salon.reviews})
              </Text>
            </View>
            <Text style={{ color: colors.textDim }}>·</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="pin" size={13} color={colors.textMid} />
              <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textMid }}>
                {salon.neighborhood} · {salon.distance}
              </Text>
            </View>
            <Text style={{ color: colors.textDim }}>·</Text>
            <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textMid }}>
              {salon.price}
            </Text>
          </View>
        </View>

        {/* Live availability */}
        <Card padding={16} style={{
          marginBottom: 24,
          borderColor: 'rgba(155,184,154,0.18)',
        }}>
          <View style={{
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <View style={{ flex: 1 }}>
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4,
              }}>
                <View style={{
                  width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success,
                }} />
                <Text style={{
                  fontFamily: fonts.sansBold,
                  fontSize: 11,
                  color: colors.success,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}>
                  Disponível {salon.waitTime}
                </Text>
              </View>
              <Text style={{
                fontFamily: fonts.serifItalic, fontSize: 19, color: colors.text,
              }}>
                Próximo horário · {salon.nextSlot}
              </Text>
            </View>
            <Btn size="sm" variant="primary" onPress={() => goSelect()}>
              Agendar
            </Btn>
          </View>
        </Card>

        {/* Tabs */}
        <View style={{
          flexDirection: 'row', gap: 26,
          borderBottomWidth: 1, borderBottomColor: colors.line,
          marginBottom: 22,
        }}>
          {([
            { id: 'servicos',      label: 'Serviços' },
            { id: 'profissionais', label: 'Profissionais' },
            { id: 'avaliacoes',    label: 'Avaliações' },
            { id: 'sobre',         label: 'Sobre' },
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
                  fontSize: 13,
                  color: on ? colors.text : colors.textDim,
                }}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Tab content */}
        {tab === 'servicos' && (
          <ServicesTab cats={cats} services={services} onAdd={goSelect} />
        )}
        {tab === 'profissionais' && (
          <ProfessionalsTab pros={pros} />
        )}
        {tab === 'avaliacoes' && (
          <ReviewsTab rating={salon.rating} totalReviews={salon.reviews} reviews={reviews} />
        )}
        {tab === 'sobre' && (
          <AboutTab salon={salon} />
        )}
      </View>
    </ScrollView>
  );
}

function ChromeBtn({
  icon, onPress, color, filled,
}: {
  icon: IconName;
  onPress?: () => void;
  color?: string;
  filled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={{
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(21,16,26,0.6)',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      <Icon name={icon} size={icon === 'back' ? 20 : 18} filled={filled} color={color ?? colors.text} />
    </Pressable>
  );
}

function ServicesTab({
  cats, services, onAdd,
}: {
  cats: string[];
  services: Service[];
  onAdd: (sid: string) => void;
}) {
  return (
    <View>
      {cats.map(c => (
        <View key={c} style={{ marginBottom: 20 }}>
          <Text style={{
            fontFamily: fonts.sansBold,
            fontSize: 11,
            color: colors.textDim,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            {c}
          </Text>
          <View>
            {services.filter(s => s.cat === c).map(sv => (
              <ServiceRow key={sv.id} service={sv} onPress={() => onAdd(sv.id)} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

function ProfessionalsTab({ pros }: { pros: Professional[] }) {
  if (!pros.length) {
    return (
      <Text style={{ color: colors.textDim, fontFamily: fonts.sans, fontSize: 13 }}>
        Em breve, profissionais cadastrados.
      </Text>
    );
  }
  return (
    <View style={{ gap: 12 }}>
      {pros.map(p => (
        <Card key={p.id} padding={14} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <Photo seed={p.photoSeed} radius={30} style={{ width: 60, height: 60 }} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontFamily: fonts.serif, fontSize: 17, color: colors.text }}>
                {p.name}
              </Text>
              {p.fav && <Pill tone="gold" size="xs">Seu favorito</Pill>}
            </View>
            <Text style={{
              fontFamily: fonts.sans, fontSize: 12, color: colors.textDim, marginTop: 2,
            }}>
              {p.role}
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4,
            }}>
              <Icon name="star" size={12} filled color={colors.gold} />
              <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textMid }}>
                {p.rating} · {p.reviews} avaliações
              </Text>
            </View>
          </View>
          <Icon name="chevron" size={18} color={colors.textDim} />
        </Card>
      ))}
    </View>
  );
}

function ReviewsTab({
  rating, totalReviews, reviews,
}: {
  rating: number;
  totalReviews: number;
  reviews: Review[];
}) {
  const dist = [88, 9, 2, 1, 1]; // 5..1
  return (
    <View>
      <View style={{
        flexDirection: 'row', gap: 24, alignItems: 'center', paddingBottom: 22,
      }}>
        <View>
          <Text style={{
            fontFamily: fonts.serif, fontSize: 48, color: colors.text, lineHeight: 48,
          }}>
            {rating.toFixed(1)}
          </Text>
          <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <Icon key={i} name="star" size={14} filled color={colors.gold} />
            ))}
          </View>
          <Text style={{
            fontFamily: fonts.sans, fontSize: 11, color: colors.textDim, marginTop: 4,
          }}>
            {totalReviews} avaliações
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map((n, i) => (
            <View key={n} style={{
              flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4,
            }}>
              <Text style={{
                fontFamily: fonts.sans, fontSize: 11, color: colors.textDim, width: 8,
              }}>
                {n}
              </Text>
              <View style={{
                flex: 1, height: 4,
                backgroundColor: colors.line, borderRadius: 2,
              }}>
                <View style={{
                  width: `${dist[i]}%`, height: '100%',
                  backgroundColor: colors.gold, borderRadius: 2,
                }} />
              </View>
            </View>
          ))}
        </View>
      </View>
      <Divider />
      <View style={{ gap: 18, paddingTop: 18 }}>
        {reviews.map(r => (
          <View key={r.name}>
            <View style={{
              flexDirection: 'row', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: 6,
            }}>
              <Text style={{
                fontFamily: fonts.sansBold, fontSize: 13, color: colors.text,
              }}>
                {r.name}
                {r.verified && (
                  <Text style={{ color: colors.success }}> ✓</Text>
                )}
              </Text>
              <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textDim }}>
                {r.date}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Icon
                  key={i}
                  name="star"
                  size={11}
                  filled
                  color={i <= r.rating ? colors.gold : colors.lineStrong}
                />
              ))}
            </View>
            <Text style={{
              fontFamily: fonts.sans, fontSize: 13, lineHeight: 20, color: colors.textMid,
            }}>
              {r.text}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function AboutTab({ salon }: { salon: Salon }) {
  const rows: { i: IconName; l: string; v: string | undefined }[] = [
    { i: 'pin',      l: 'Endereço',  v: salon.address },
    { i: 'clock',    l: 'Horário',   v: salon.hours   },
    { i: 'calendar', l: 'Realizou',  v: salon.bookings ? `${salon.bookings} agendamentos pelo Saloon` : undefined },
  ];
  return (
    <View style={{ paddingBottom: 20 }}>
      {salon.about && (
        <Text style={{
          fontFamily: fonts.sans, fontSize: 14, lineHeight: 23, color: colors.textMid,
        }}>
          {salon.about}
        </Text>
      )}
      <View style={{ marginTop: 20, gap: 12 }}>
        {rows.filter(r => r.v).map(r => (
          <View key={r.l} style={{ flexDirection: 'row', gap: 14 }}>
            <Icon name={r.i} size={18} color={colors.rose} style={{ marginTop: 2 }} />
            <View>
              <Text style={{
                fontFamily: fonts.sansMedium, fontSize: 11, color: colors.textDim,
                textTransform: 'uppercase', letterSpacing: 1,
              }}>
                {r.l}
              </Text>
              <Text style={{
                fontFamily: fonts.sans, fontSize: 14, color: colors.text, marginTop: 2,
              }}>
                {r.v}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
