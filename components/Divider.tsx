// components/Divider.tsx — 1px hairline rule
import { StyleProp, View, ViewStyle } from 'react-native';
import { colors } from '@/constants/tokens';

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[{ height: 1, backgroundColor: colors.line }, style]} />
  );
}
