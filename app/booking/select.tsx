// app/booking/select.tsx
// Mirrors prototype/saloon-screens-3.jsx → ScreenSelect
import { useEffect, useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Btn } from '@/components/Btn';
import { DetailHeader } from '@/components/DetailHeader';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { ServiceRow } from '@/components/ServiceRow';
import { PROFESSIONALS, SALONS, SERVICES } from '@/constants/mock';
import { colors, fonts, radii } from '@/constants/tokens';
import { useSalon } from '@/hooks/useSalons';
import { useBooking } from '@/stores/booking';

export default function SelectScreen() {
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
  const pros = data?.professionals ?? PROFESSIONALS[salon.id] ?? [];

  const setSalon = useBooking(s => s.setSalon);
  const serviceIds = useBooking(s => s.serviceIds);
  const toggleService = useBooking(s => s.toggleService);
  const professionalId = useBooking(s => s.professionalId);
  const setProfessional = useBooking(s => s.setProfessional);

  useEffect(() => {
    if (salon.id !== useBooking.getState().salonId) {
      setSalon(salon.id);
    }
  }, [salon.id, setSalon]);

  useEffect(() => {
    if (professionalId === undefined && pros[0]) {
      setProfessional(pros[0].id);
    }
  }, [professionalId, pros, setProfessional]);

  const selected = services.filter(s => serviceIds.includes(s.id));
  const total = selected.reduce((sum, i) => sum + i.price, 0);
  const totalDur = selected.reduce((sum, i) => sum + i.dur, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DetailHeader
        title="Escolher serviços"
        subtitle={salon.name}
        onBack={() => router.back()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 8, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={sectionLabel}>Profissional</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
          style={{ marginBottom: 22, marginHorizontal: -22, paddingHorizontal: 22 }}
        >
          <ProChip
            active={!professionalId}
            label="Qualquer um"
            onPress={() => setProfessional(null)}
            avatar={
              <View style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: !professionalId ? colors.ink : colors.surfaceHi,
                alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon
                  name="sparkle"
                  size={16}
                  color={!professionalId ? colors.text : colors.text}
                />
              </View>
            }
          />
          {pros.map(p => (
            <ProChip
              key={p.id}
              active={professionalId === p.id}
              label={p.name.split(' ')[0]}
              avatar={
                <Photo seed={p.photoSeed} radius={16} style={{ width: 32, height: 32 }} />
              }
              fav={p.fav}
              onPress={() => setProfessional(p.id)}
            />
          ))}
        </ScrollView>

        <Text style={sectionLabel}>Serviços</Text>
        <View>
          {services.map(sv => (
            <ServiceRow
              key={sv.id}
              service={sv}
              selected={serviceIds.includes(sv.id)}
              onPress={() => toggleService(sv.id)}
            />
          ))}
        </View>

        {selected.length === 1 && (
          <View style={{
            marginTop: 18,
            paddingVertical: 14, paddingHorizontal: 16,
            borderRadius: radii.md,
            backgroundColor: colors.goldSoft,
            borderWidth: 1, borderColor: 'rgba(212,175,143,0.35)',
            flexDirection: 'row', alignItems: 'center', gap: 12,
          }}>
            <Icon name="combo" size={20} color={colors.gold} />
            <View style={{ flex: 1 }}>
              <Text style={{
                fontFamily: fonts.sansMedium, fontSize: 13, color: colors.text,
              }}>
                Adicione um combo e economize 15%
              </Text>
              <Text style={{
                fontFamily: fonts.sans, fontSize: 12, color: colors.textMid, marginTop: 2,
              }}>
                Cabelo + unhas no mesmo horário
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {selected.length > 0 && (
        <StickyCta
          insetBottom={insets.bottom}
          subtitle={`${selected.length} serviço${selected.length > 1 ? 's' : ''} · ${totalDur} min`}
          title={`R$ ${total},00`}
          actionLabel="Escolher horário"
          onPress={() =>
            router.push({
              pathname: '/booking/calendar',
              params: { salonId: salon.id },
            } as never)
          }
        />
      )}
    </View>
  );
}

const sectionLabel = {
  fontFamily: fonts.sansBold,
  fontSize: 11,
  color: colors.textDim,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  marginBottom: 12,
};

function ProChip({
  active, label, avatar, fav, onPress,
}: {
  active: boolean;
  label: string;
  avatar: React.ReactNode;
  fav?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 8,
        paddingVertical: 8, paddingLeft: 8, paddingRight: 14,
        borderRadius: radii.pill,
        backgroundColor: active ? colors.text : 'transparent',
        borderWidth: active ? 0 : 1,
        borderColor: colors.line,
      }}
    >
      {avatar}
      <Text style={{
        fontFamily: fonts.sansMedium,
        fontSize: 13,
        color: active ? colors.ink : colors.text,
      }}>
        {label}
      </Text>
      {fav && <Icon name="heart" size={11} filled color={colors.rose} />}
    </Pressable>
  );
}

export function StickyCta({
  insetBottom, subtitle, title, actionLabel, onPress, disabled,
}: {
  insetBottom: number;
  subtitle: string;
  title: string;
  actionLabel: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      paddingHorizontal: 22,
      paddingTop: 16,
      paddingBottom: insetBottom + 16,
      backgroundColor: colors.bg,
    }}>
      <View style={{
        backgroundColor: colors.surfaceHi,
        borderRadius: radii.xl,
        borderWidth: 1, borderColor: colors.line,
        padding: 16,
        flexDirection: 'row', alignItems: 'center', gap: 14,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontFamily: fonts.sansMedium, fontSize: 11, color: colors.textDim, letterSpacing: 0.4,
          }}>
            {subtitle}
          </Text>
          <Text style={{
            fontFamily: fonts.serif, fontSize: 24, color: colors.text, marginTop: 2,
          }}>
            {title}
          </Text>
        </View>
        <Btn
          variant="primary"
          onPress={onPress}
          disabled={disabled}
          iconRight={<Icon name="arrow" size={16} color={colors.ink} />}
        >
          {actionLabel}
        </Btn>
      </View>
    </View>
  );
}
