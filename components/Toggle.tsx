// components/Toggle.tsx — switch matching design system
import { Pressable, View } from 'react-native';
import { colors } from '@/constants/tokens';

type Props = {
  value: boolean;
  onChange: (v: boolean) => void;
};

export function Toggle({ value, onChange }: Props) {
  return (
    <Pressable
      onPress={() => onChange(!value)}
      hitSlop={8}
      style={{
        width: 44,
        height: 26,
        borderRadius: 13,
        backgroundColor: value ? colors.rose : colors.lineStrong,
        justifyContent: 'center',
      }}
    >
      <View style={{
        position: 'absolute',
        top: 3,
        left: value ? 21 : 3,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
      }} />
    </Pressable>
  );
}
