// components/ServiceRow.tsx — service line item with optional select state
import { Pressable, Text, View } from 'react-native';
import { colors, fonts } from '@/constants/tokens';
import { Icon } from '@/components/Icon';
import type { Service } from '@/types/salon';

type Props = {
  service: Service;
  selected?: boolean;
  onPress?: () => void;
};

export function ServiceRow({ service: sv, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        gap: 14,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.line,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{
          fontFamily: fonts.sansMedium,
          fontSize: 14,
          color: colors.text,
        }}>
          {sv.name}
        </Text>
        {sv.desc && (
          <Text style={{
            fontFamily: fonts.sans,
            fontSize: 12,
            color: colors.textDim,
            marginTop: 4,
          }}>
            {sv.desc}
          </Text>
        )}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginTop: 8,
        }}>
          <Icon name="clock" size={12} color={colors.textMid} />
          <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.textMid }}>
            {sv.dur} min
          </Text>
          <Text style={{ color: colors.textDim, fontSize: 11 }}>·</Text>
          <Text style={{
            fontFamily: fonts.sansBold,
            fontSize: 12,
            color: colors.gold,
          }}>
            R$ {sv.price}
          </Text>
        </View>
      </View>
      <View style={{
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: selected ? colors.rose : 'transparent',
        borderWidth: selected ? 0 : 1,
        borderColor: colors.lineStrong,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon
          name={selected ? 'check' : 'plus'}
          size={16}
          color={selected ? colors.ink : colors.text}
        />
      </View>
    </Pressable>
  );
}
