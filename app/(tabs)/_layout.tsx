// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Icon } from '@/components/Icon';
import { colors, fonts } from '@/constants/tokens';
import type { IconName } from '@/types/salon';

function tabIcon(name: IconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Icon name={name} size={size} color={color} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(21,16,26,0.92)',
          borderTopColor: 'rgba(245,230,211,0.08)',
        },
        tabBarActiveTintColor: colors.rose,
        tabBarInactiveTintColor: colors.textDim,
        tabBarLabelStyle: {
          fontFamily: fonts.sansMedium,
          fontSize: 10,
          letterSpacing: 0.4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Início', tabBarIcon: tabIcon('home') }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: 'Buscar', tabBarIcon: tabIcon('search') }}
      />
      <Tabs.Screen
        name="bookings"
        options={{ title: 'Agenda', tabBarIcon: tabIcon('calendar') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Perfil', tabBarIcon: tabIcon('user') }}
      />
    </Tabs>
  );
}
