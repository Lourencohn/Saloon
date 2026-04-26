// components/Photo.tsx — gradient mesh placeholder evoking salon imagery
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Rect, Stop } from 'react-native-svg';
import { radii } from '@/constants/tokens';

const PALETTES: ReadonlyArray<readonly [string, string, string]> = [
  ['#3A2530', '#7A4A52', '#C97B82'],   // mauve
  ['#2D2028', '#5A3D45', '#E8B4B8'],   // rose
  ['#2A2030', '#6B4A55', '#D4AF8F'],   // gold-mauve
  ['#251820', '#5A3540', '#B89094'],   // dusty
  ['#2E2028', '#7A5560', '#E8B4B8'],   // peach-rose
  ['#1F1820', '#4A3540', '#D4AF8F'],   // deep gold
  ['#332028', '#8A5A65', '#F0C8CC'],   // pink
  ['#1A1418', '#4D3038', '#C97B82'],   // ember
];

type PhotoProps = {
  seed?: number;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export function Photo({
  seed = 0,
  height,
  radius = radii.lg,
  style,
  children,
}: PhotoProps) {
  const palette = PALETTES[seed % PALETTES.length];
  const angleDeg = 20 + ((seed * 37) % 140);

  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.sin(rad);
  const dy = -Math.cos(rad);
  const x1 = (0.5 - dx / 2).toFixed(3);
  const y1 = (0.5 - dy / 2).toFixed(3);
  const x2 = (0.5 + dx / 2).toFixed(3);
  const y2 = (0.5 + dy / 2).toFixed(3);

  const gradId = `photo-${seed}`;
  const sheenId = `photo-sheen-${seed}`;

  return (
    <View
      style={[
        { borderRadius: radius, overflow: 'hidden', height, backgroundColor: palette[0] },
        style,
      ]}
    >
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id={gradId} x1={x1} y1={y1} x2={x2} y2={y2}>
            <Stop offset="0" stopColor={palette[0]} />
            <Stop offset="0.5" stopColor={palette[1]} />
            <Stop offset="1" stopColor={palette[2]} />
          </SvgGradient>
          <SvgGradient id={sheenId} x1="0.3" y1="0.3" x2="0.9" y2="0.9">
            <Stop offset="0" stopColor="#ffffff" stopOpacity="0.08" />
            <Stop offset="0.6" stopColor="#ffffff" stopOpacity="0" />
          </SvgGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${gradId})`} />
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${sheenId})`} />
      </Svg>
      {children}
    </View>
  );
}
