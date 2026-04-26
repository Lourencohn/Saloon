// app/(auth)/register.tsx — create account (mock for now)
import { useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView,
  Text, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AuthField } from '@/components/AuthField';
import { Btn } from '@/components/Btn';
import { Icon } from '@/components/Icon';
import { colors, fonts, radii } from '@/constants/tokens';
import { useAuth } from '@/stores/auth';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const register = useAuth(s => s.register);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    const res = await register(name, email, password);
    setLoading(false);
    if (!res.ok) setError(res.reason);
    // navigation handled by AuthGate in root _layout
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 28,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={() => router.back()}
          hitSlop={8}
          style={{
            width: 40, height: 40, borderRadius: 20,
            alignItems: 'center', justifyContent: 'center',
            marginLeft: -8,
          }}
        >
          <Icon name="back" size={22} color={colors.text} />
        </Pressable>

        <View style={{ flex: 1, justifyContent: 'center', paddingVertical: 32 }}>
          <Text style={{
            fontFamily: fonts.sansBold,
            fontSize: 11,
            letterSpacing: 3,
            color: colors.gold,
            textTransform: 'uppercase',
            marginBottom: 14,
          }}>
            Saloon
          </Text>

          <Text style={{
            fontFamily: fonts.serif,
            fontSize: 38,
            lineHeight: 40,
            color: colors.text,
            letterSpacing: -0.8,
            marginBottom: 8,
          }}>
            Comece sua{'\n'}
            <Text style={{ fontFamily: fonts.serifItalic, color: colors.rose }}>
              rotina de cuidado.
            </Text>
          </Text>

          <Text style={{
            fontFamily: fonts.sans,
            fontSize: 14,
            lineHeight: 22,
            color: colors.textMid,
            marginBottom: 32,
          }}>
            Em poucos toques você descobre salões e marca seu primeiro horário.
          </Text>

          <View style={{ gap: 12, marginBottom: 18 }}>
            <AuthField
              label="Como podemos te chamar?"
              icon="user"
              value={name}
              onChangeText={t => { setName(t); setError(null); }}
              placeholder="Seu primeiro nome"
              autoCapitalize="words"
              textContentType="givenName"
            />
            <AuthField
              label="E-mail"
              icon="bell"
              value={email}
              onChangeText={t => { setEmail(t); setError(null); }}
              placeholder="voce@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
            />
            <AuthField
              label="Senha"
              icon="diamond"
              value={password}
              onChangeText={t => { setPassword(t); setError(null); }}
              placeholder="Mínimo 4 caracteres"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              textContentType="newPassword"
              right={
                <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={8}>
                  <Text style={{
                    color: colors.rose,
                    fontFamily: fonts.sansMedium,
                    fontSize: 12,
                  }}>
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </Text>
                </Pressable>
              }
            />
          </View>

          {error && (
            <View style={{
              flexDirection: 'row', alignItems: 'center', gap: 8,
              padding: 12, borderRadius: radii.md,
              backgroundColor: 'rgba(201,123,130,0.12)',
              borderWidth: 1, borderColor: colors.roseDeep,
              marginBottom: 16,
            }}>
              <Icon name="close" size={14} color={colors.roseDeep} />
              <Text style={{
                color: colors.rose, fontFamily: fonts.sansMedium, fontSize: 13, flex: 1,
              }}>
                {error}
              </Text>
            </View>
          )}

          <Btn
            variant="primary"
            size="lg"
            full
            onPress={onSubmit}
            disabled={loading}
            iconRight={<Icon name="arrow" size={18} color={colors.ink} />}
          >
            {loading ? 'Criando conta…' : 'Criar conta'}
          </Btn>

          <Text style={{
            marginTop: 14,
            textAlign: 'center',
            color: colors.textDim,
            fontFamily: fonts.sans,
            fontSize: 11,
            lineHeight: 18,
          }}>
            Ao criar a conta você concorda com os{' '}
            <Text style={{ color: colors.text, fontFamily: fonts.sansMedium }}>
              termos
            </Text>
            {' e a '}
            <Text style={{ color: colors.text, fontFamily: fonts.sansMedium }}>
              política de privacidade
            </Text>
            {' do Saloon.'}
          </Text>
        </View>

        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 12,
          marginVertical: 24,
        }}>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
          <Text style={{
            color: colors.textDim,
            fontFamily: fonts.sansMedium,
            fontSize: 11,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}>
            ou
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: colors.line }} />
        </View>

        <View style={{ alignItems: 'center', gap: 8 }}>
          <Text style={{
            fontFamily: fonts.sans, fontSize: 13, color: colors.textMid,
          }}>
            Já tem conta?
          </Text>
          <Pressable
            hitSlop={8}
            onPress={() => router.replace('/(auth)/login' as never)}
          >
            <Text style={{
              fontFamily: fonts.sansBold,
              fontSize: 14,
              color: colors.text,
            }}>
              Entrar
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
