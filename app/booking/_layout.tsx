// app/booking/_layout.tsx — booking flow stack
import { Stack } from 'expo-router';
import { colors } from '@/constants/tokens';

export default function BookingLayout() {
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.bg },
      animation: 'slide_from_right',
    }}>
      <Stack.Screen name="select" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="confirm" />
      <Stack.Screen name="success" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
