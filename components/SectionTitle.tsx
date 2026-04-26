// components/SectionTitle.tsx — serif heading with optional action label
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '@/constants/tokens';

type Props = {
  children: ReactNode;
  action?: string;
  onActionPress?: () => void;
};

export function SectionTitle({ children, action, onActionPress }: Props) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 14,
    }}>
      <Text style={{
        fontFamily: fonts.serif,
        fontSize: 22,
        color: colors.text,
        letterSpacing: -0.2,
      }}>
        {children}
      </Text>
      {action && (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={{
            fontFamily: fonts.sansMedium,
            fontSize: 12,
            color: colors.rose,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
          }}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
