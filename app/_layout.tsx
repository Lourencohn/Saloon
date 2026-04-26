// app/_layout.tsx — root layout: fonts, providers, auth gate
import { useEffect } from 'react';
import { View } from 'react-native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts,
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Inter_400Regular, Inter_500Medium, Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { colors } from '@/constants/tokens';
import { useAuth } from '@/stores/auth';
import '../global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_500Medium_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  const authHydrated = useAuth(s => s.hydrated);
  const initializeAuth = useAuth(s => s.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (!fontsLoaded || !authHydrated) {
    return <View style={{ flex: 1, backgroundColor: colors.bg }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <AuthGate />
          <Stack screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="salon/[id]" />
            <Stack.Screen name="booking" />
            <Stack.Screen name="review/[id]" />
          </Stack>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AuthGate() {
  const segments = useSegments();
  const router = useRouter();
  const user = useAuth(s => s.user);
  const navState = useRootNavigationState();
  const navReady = !!navState?.key;

  useEffect(() => {
    if (!navReady) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/onboarding' as never);
    } else if (user && inAuthGroup) {
      router.replace('/' as never);
    }
  }, [navReady, user, segments, router]);

  return null;
}
