// app/booking/success.tsx
// Mirrors prototype/saloon-screens-3.jsx → ScreenSuccess
import { useEffect, useMemo } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Btn } from '@/components/Btn';
import { Icon } from '@/components/Icon';
import { SALONS } from '@/constants/mock';
import { colors, fonts } from '@/constants/tokens';
import { useSalon } from '@/hooks/useSalons';
import { useAuth } from '@/stores/auth';
import { useBooking } from '@/stores/booking';

const WEEKDAYS = ['dom','seg','ter','qua','qui','sex','sáb'];
const MONTHS = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

export default function SuccessScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const salonId = useBooking(s => s.salonId);
  const startsAt = useBooking(s => s.startsAt);
  const reset = useBooking(s => s.reset);
  const userName = useAuth(s => s.user?.name);
  const firstName = userName?.split(' ')[0] ?? 'tudo';
  const { data } = useSalon(salonId ?? '');

  const fallbackSalon = useMemo(
    () => SALONS.find(s => s.id === salonId) ?? SALONS[0],
    [salonId],
  );
  const salon = data ?? fallbackSalon;

  const halo = useSharedValue(0);
  const checkScale = useSharedValue(0.3);
  const textOpacity = useSharedValue(0);
  const textTranslate = useSharedValue(12);
  const ctaOpacity = useSharedValue(0);

  useEffect(() => {
    halo.value = withDelay(60, withTiming(1, { duration: 600 }));
    checkScale.value = withDelay(80, withSpring(1, { damping: 10, stiffness: 110 }));
    textOpacity.value = withDelay(560, withTiming(1, { duration: 500, easing: Easing.out(Easing.cubic) }));
    textTranslate.value = withDelay(560, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
    ctaOpacity.value = withDelay(820, withTiming(1, { duration: 500 }));
  }, [halo, checkScale, textOpacity, textTranslate, ctaOpacity]);

  const haloStyle = useAnimatedStyle(() => ({ opacity: halo.value }));
  const checkStyle = useAnimatedStyle(() => ({ transform: [{ scale: checkScale.value }] }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslate.value }],
  }));
  const ctaStyle = useAnimatedStyle(() => ({ opacity: ctaOpacity.value }));

  const goBookings = () => {
    reset();
    router.replace('/bookings' as never);
  };
  const goHome = () => {
    reset();
    router.replace('/' as never);
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.bg,
      paddingTop: insets.top + 32,
      paddingBottom: insets.bottom + 24,
      paddingHorizontal: 28,
    }}>
      <Animated.View style={[{
        position: 'absolute',
        top: '20%',
        left: '50%',
        marginLeft: -240,
        width: 480, height: 480, borderRadius: 240,
        backgroundColor: 'rgba(232,180,184,0.18)',
      }, haloStyle]} />

      <View style={{
        flex: 1,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Animated.View style={[{
          width: 96, height: 96, borderRadius: 48,
          backgroundColor: colors.rose,
          alignItems: 'center', justifyContent: 'center',
          shadowColor: colors.rose,
          shadowOpacity: 0.3,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: 20 },
          elevation: 12,
        }, checkStyle]}>
          <Icon name="check" size={44} color={colors.ink} strokeWidth={2} />
        </Animated.View>

        <Animated.View style={[{ alignItems: 'center', marginTop: 32 }, textStyle]}>
          <Text style={{
            fontFamily: fonts.sansBold,
            fontSize: 11,
            color: colors.gold,
            letterSpacing: 3,
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Reservado
          </Text>
          <Text style={{
            fontFamily: fonts.serif,
            fontSize: 36,
            color: colors.text,
            textAlign: 'center',
            letterSpacing: -0.6,
            lineHeight: 40,
          }}>
            Pronto, {firstName}.{'\n'}
            <Text style={{
              fontFamily: fonts.serifItalic,
              color: colors.rose,
            }}>
              Seu horário está garantido.
            </Text>
          </Text>
          <Text style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            color: colors.textMid,
            textAlign: 'center',
            lineHeight: 22,
            marginTop: 18,
            maxWidth: 280,
          }}>
            {prettyWhen(startsAt)} · {salon.name}{'\n'}
            Enviamos os detalhes por e-mail. Te lembramos 24h antes.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[ctaStyle, { gap: 10 }]}>
        <Btn variant="primary" size="lg" full onPress={goBookings}>
          Ver meus agendamentos
        </Btn>
        <Btn variant="secondary" size="md" full onPress={goHome}>
          Voltar ao início
        </Btn>
      </Animated.View>
    </View>
  );
}

function prettyWhen(iso: string | undefined): string {
  if (!iso) return 'Sex, 12 dez · 15:30';
  const [date, time] = iso.split('T');
  const d = new Date(date);
  const wd = WEEKDAYS[d.getDay()];
  const cap = wd.charAt(0).toUpperCase() + wd.slice(1);
  return `${cap}, ${d.getDate()} ${MONTHS[d.getMonth()]} · ${time.slice(0, 5)}`;
}
