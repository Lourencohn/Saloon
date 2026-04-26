// app/(auth)/onboarding.tsx
// Mirrors prototype/saloon-screens-1.jsx → ScreenOnboarding
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { Btn } from '@/components/Btn';
import { GradientOverlay } from '@/components/GradientOverlay';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { colors, fonts } from '@/constants/tokens';

export default function Onboarding() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const goRegister = () => router.push('/(auth)/register' as never);
  const goLogin = () => router.push('/(auth)/login' as never);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Photo
        seed={0}
        radius={0}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <GradientOverlay
        stops={[
          { offset: 0,    opacity: 0.2  },
          { offset: 0.5,  opacity: 0.6  },
          { offset: 1,    opacity: 0.96 },
        ]}
      />

      <View style={{
        flex: 1,
        paddingTop: insets.top + 32,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 28,
        justifyContent: 'flex-end',
      }}>
        <Text style={{
          fontFamily: fonts.sansBold,
          fontSize: 11,
          letterSpacing: 3,
          color: colors.gold,
          textTransform: 'uppercase',
          marginBottom: 18,
        }}>
          Saloon
        </Text>

        <Text style={{
          fontFamily: fonts.serif,
          fontSize: 52,
          lineHeight: 50,
          color: colors.text,
          letterSpacing: -1.4,
        }}>
          Sua rotina{'\n'}de beleza,{'\n'}
          <Text style={{
            fontFamily: fonts.serifItalic,
            color: colors.rose,
          }}>
            sem esforço.
          </Text>
        </Text>

        <Text style={{
          fontFamily: fonts.sans,
          fontSize: 15,
          lineHeight: 23,
          color: colors.textMid,
          marginTop: 24,
          marginBottom: 36,
          maxWidth: 320,
        }}>
          Descubra salões próximos, veja horários em tempo real e agende em poucos toques.
        </Text>

        <Btn
          variant="primary"
          size="lg"
          full
          onPress={goRegister}
          iconRight={<Icon name="arrow" size={18} color={colors.ink} />}
        >
          Começar
        </Btn>

        <Pressable onPress={goLogin} hitSlop={8} style={{ marginTop: 18, alignItems: 'center' }}>
          <Text style={{
            fontFamily: fonts.sans,
            fontSize: 13,
            color: colors.textDim,
          }}>
            Já tem conta?{' '}
            <Text style={{ color: colors.text, fontFamily: fonts.sansMedium }}>
              Entrar
            </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
