// components/Pill.tsx — small status/category pill
import { ReactNode } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@/constants/tokens';

type Tone = 'rose' | 'gold' | 'quiet' | 'solid' | 'live';
type Size = 'xs' | 'sm' | 'md';

const TONES: Record<Tone, { bg: string; fg: string }> = {
  rose:  { bg: colors.roseSoft,             fg: colors.rose    },
  gold:  { bg: colors.goldSoft,             fg: colors.gold    },
  quiet: { bg: 'rgba(245,230,211,0.06)',    fg: colors.textMid },
  solid: { bg: colors.rose,                 fg: colors.ink     },
  live:  { bg: 'rgba(155,184,154,0.16)',    fg: colors.success },
};

const SIZES: Record<Size, { fs: number; py: number; px: number; ls: number }> = {
  xs: { fs: 10, py: 3, px: 8,  ls: 0.6 },
  sm: { fs: 11, py: 4, px: 10, ls: 0.5 },
  md: { fs: 12, py: 6, px: 12, ls: 0.4 },
};

type PillProps = {
  children: ReactNode;
  tone?: Tone;
  size?: Size;
  style?: StyleProp<ViewStyle>;
};

export function Pill({ children, tone = 'rose', size = 'sm', style }: PillProps) {
  const t = TONES[tone];
  const s = SIZES[size];
  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: t.bg,
          paddingVertical: s.py,
          paddingHorizontal: s.px,
          borderRadius: radii.pill,
        },
        style,
      ]}
    >
      <Text
        style={{
          color: t.fg,
          fontSize: s.fs,
          fontFamily: fonts.sansMedium,
          letterSpacing: s.ls,
          textTransform: size === 'xs' ? 'uppercase' : 'none',
        }}
      >
        {children}
      </Text>
    </View>
  );
}
