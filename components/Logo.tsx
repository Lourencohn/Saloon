// components/Logo.tsx — marca Saloon (PNG transparente, fundo neutro)
import { StyleProp, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

const SOURCES = {
  full:     require('../assets/logo-mark.png'),
  symbol:   require('../assets/logo-symbol.png'),
  wordmark: require('../assets/logo-wordmark.png'),
} as const;

const ASPECTS: Record<keyof typeof SOURCES, number> = {
  full:     800 / 536,
  symbol:   259 / 344,
  wordmark: 800 / 177,
};

type LogoVariant = keyof typeof SOURCES;

type LogoProps = {
  variant?: LogoVariant;
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

export function Logo({ variant = 'full', width = 140, height, style }: LogoProps) {
  const aspect = ASPECTS[variant];
  const w = width;
  const h = height ?? Math.round(w / aspect);

  return (
    <View style={[{ width: w, height: h }, style]}>
      <Image
        source={SOURCES[variant]}
        contentFit="contain"
        cachePolicy="memory-disk"
        priority="high"
        style={{ width: '100%', height: '100%' }}
        accessibilityLabel="Saloon"
      />
    </View>
  );
}
