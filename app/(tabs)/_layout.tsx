// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { colors, fonts } from '@/constants/tokens';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: 'rgba(21,16,26,0.92)',
        borderTopColor: 'rgba(245,230,211,0.08)',
      },
      tabBarActiveTintColor: colors.rose,
      tabBarInactiveTintColor: colors.textDim,
      tabBarLabelStyle: { fontFamily: fonts.sansMedium, fontSize: 10, letterSpacing: 0.4 },
    }}>
      <Tabs.Screen name="index"    options={{ title: 'Início' }} />
      <Tabs.Screen name="search"   options={{ title: 'Buscar' }} />
      <Tabs.Screen name="bookings" options={{ title: 'Agenda' }} />
      <Tabs.Screen name="profile"  options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
