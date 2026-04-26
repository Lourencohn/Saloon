// components/Btn.tsx — primary action button (rose / secondary / ghost / gold)
import { ReactNode } from 'react';
import { Platform, Pressable, StyleProp, Text, ViewStyle } from 'react-native';
import { colors, fonts, radii } from '@/constants/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold';
type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, { h: number; px: number; fs: number }> = {
  sm: { h: 36, px: 18, fs: 13 },
  md: { h: 48, px: 22, fs: 14 },
  lg: { h: 56, px: 24, fs: 15 },
};

const VARIANTS: Record<Variant, {
  bg: string; fg: string; border?: string; iosShadow?: string;
}> = {
  primary:   { bg: colors.rose,    fg: colors.ink,  border: colors.roseDeep,         iosShadow: colors.rose },
  secondary: { bg: 'transparent',  fg: colors.text, border: colors.lineStrong                              },
  ghost:     { bg: 'transparent',  fg: colors.rose                                                         },
  gold:      { bg: colors.gold,    fg: colors.ink,  border: 'rgba(212,175,143,0.6)', iosShadow: colors.gold },
};

type BtnProps = {
  children: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  full?: boolean;
  disabled?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Btn({
  children, onPress, variant = 'primary', size = 'md',
  full, disabled, iconLeft, iconRight, style,
}: BtnProps) {
  const s = SIZES[size];
  const v = VARIANTS[variant];

  const iosShadow = Platform.OS === 'ios' && v.iosShadow ? {
    shadowColor: v.iosShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
  } : null;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      android_ripple={{ color: 'rgba(0,0,0,0.12)' }}
      style={[
        {
          height: s.h,
          paddingHorizontal: s.px,
          backgroundColor: v.bg,
          borderRadius: radii.pill,
          borderWidth: v.border ? 1.5 : 0,
          borderColor: v.border ?? 'transparent',
          alignSelf: full ? 'stretch' : 'auto',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          gap: 8,
          overflow: 'hidden',
          opacity: disabled ? 0.55 : 1,
        },
        iosShadow,
        style,
      ]}
    >
      {iconLeft}
      <Text
        numberOfLines={1}
        style={{
          color: v.fg,
          fontSize: s.fs,
          fontFamily: fonts.sansBold,
          letterSpacing: 0.3,
          includeFontPadding: false,
          textAlign: 'center',
        }}
      >
        {children}
      </Text>
      {iconRight}
    </Pressable>
  );
}

// Tiny helper used elsewhere if needed.
export function btnFg(variant: Variant = 'primary'): string {
  return VARIANTS[variant].fg;
}
