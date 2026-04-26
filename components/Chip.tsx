// components/Chip.tsx — selectable filter pill
import { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';
import { colors, fonts, radii } from '@/constants/tokens';

type Props = {
  active?: boolean;
  onPress?: () => void;
  children: ReactNode;
};

export function Chip({ active, onPress, children }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 36,
        paddingHorizontal: 16,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: active ? colors.rose : colors.line,
        backgroundColor: active ? colors.roseSoft : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{
        color: active ? colors.rose : colors.textMid,
        fontFamily: fonts.sansMedium,
        fontSize: 13,
      }}>
        {children}
      </Text>
    </Pressable>
  );
}
