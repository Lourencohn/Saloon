// components/LogoSvg.tsx — wordmark "SALOON" puro vetor (gradient rosé→gold)
// Para a marca completa (S + rosto), use <Logo /> com PNG transparente —
// vetorizar o desenho do rosto perderia o gradient pintado. Este componente
// cobre o caso onde só o wordmark é necessário e precisa ser infinitamente nítido.
import { StyleProp, View, ViewStyle } from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Text as SvgText,
} from 'react-native-svg';

import { fonts } from '@/constants/tokens';

type LogoSvgProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ViewStyle>;
};

const VB_W = 800;
const VB_H = 140;

export function LogoSvg({ width = 180, height, style }: LogoSvgProps) {
  const w = width;
  const h = height ?? Math.round(w * (VB_H / VB_W));

  return (
    <View style={[{ width: w, height: h }, style]}>
      <Svg width={w} height={h} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Defs>
          <LinearGradient id="rose-gold" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0"   stopColor="#E8B4B8" />
            <Stop offset="0.5" stopColor="#D4AF8F" />
            <Stop offset="1"   stopColor="#C97B82" />
          </LinearGradient>
        </Defs>
        <SvgText
          x={VB_W / 2}
          y={VB_H * 0.78}
          fontFamily={fonts.serif}
          fontSize={120}
          fill="url(#rose-gold)"
          textAnchor="middle"
          // letterSpacing renderiza como "tracking" no SVG: tipografia editorial
          letterSpacing={18}
        >
          SALOON
        </SvgText>
      </Svg>
    </View>
  );
}
