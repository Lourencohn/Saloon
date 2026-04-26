// components/DetailHeader.tsx — back button + title + subtitle row for stack screens
import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/constants/tokens';
import { Icon } from '@/components/Icon';

type Props = {
  title: string;
  subtitle?: string;
  onBack: () => void;
  action?: ReactNode;
};

export function DetailHeader({ title, subtitle, onBack, action }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={{
      paddingTop: insets.top + 4,
      paddingBottom: 14,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.line,
      backgroundColor: colors.bg,
    }}>
      <Pressable
        onPress={onBack}
        hitSlop={8}
        style={{
          width: 40, height: 40, borderRadius: 20,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Icon name="back" size={22} color={colors.text} />
      </Pressable>
      <View style={{ flex: 1 }}>
        {subtitle && (
          <Text style={{
            fontFamily: fonts.sansMedium,
            fontSize: 11,
            color: colors.textDim,
            letterSpacing: 0.4,
          }}>
            {subtitle}
          </Text>
        )}
        <Text style={{
          fontFamily: fonts.serif,
          fontSize: 19,
          color: colors.text,
          letterSpacing: -0.2,
        }}>
          {title}
        </Text>
      </View>
      {action}
    </View>
  );
}
