// components/SalonRow.tsx — list row for salons (Home, Search)
import { Pressable, Text, View } from 'react-native';
import { colors, fonts, radii } from '@/constants/tokens';
import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { Pill } from '@/components/Pill';
import type { Salon } from '@/types/salon';

type Props = {
  salon: Salon;
  fav?: boolean;
  onFav?: () => void;
  onPress?: () => void;
};

export function SalonRow({ salon, fav, onFav, onPress }: Props) {
  return (
    <Card onPress={onPress} padding={12} style={{ flexDirection: 'row', gap: 14 }}>
      <Photo
        seed={salon.photoSeed}
        radius={radii.md}
        style={{ width: 96, height: 96 }}
      />
      <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 8,
        }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.serif,
                fontSize: 18,
                color: colors.text,
                letterSpacing: -0.2,
              }}
            >
              {salon.name}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: fonts.sans,
                fontSize: 12,
                color: colors.textDim,
                marginTop: 2,
              }}
            >
              {salon.tagline}
            </Text>
          </View>
          {onFav && (
            <Pressable onPress={onFav} hitSlop={8}>
              <Icon
                name="heart"
                size={20}
                filled={fav}
                color={fav ? colors.rose : colors.textDim}
              />
            </Pressable>
          )}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="star" size={11} filled color={colors.gold} />
          <Text style={{ fontFamily: fonts.sansBold, fontSize: 11, color: colors.text }}>
            {salon.rating}
          </Text>
          <DotSep />
          <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textMid }}>
            {salon.distance}
          </Text>
          <DotSep />
          <Text style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.textMid }}>
            {salon.price}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
          <Pill tone={salon.waitTime === 'agora' ? 'live' : 'quiet'} size="xs">
            {salon.waitTime === 'agora' ? `● ${salon.waitTime}` : salon.waitTime}
          </Pill>
          {salon.badges.slice(0, 1).map(b => (
            <Pill key={b} tone="gold" size="xs">{b}</Pill>
          ))}
        </View>
      </View>
    </Card>
  );
}

function DotSep() {
  return (
    <Text style={{ color: colors.textDim, fontSize: 11, fontFamily: fonts.sans }}>
      ·
    </Text>
  );
}
