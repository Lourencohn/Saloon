// components/GradientOverlay.tsx — dark gradient for legibility over Photo
import { StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient as SvgGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '@/constants/tokens';

type StopDef = { offset: number; color?: string; opacity: number };

type Props = {
  /** Color stops; default: shadow rising from the bottom 70% of the box. */
  stops?: ReadonlyArray<StopDef>;
  id?: string;
};

const DEFAULT_STOPS: StopDef[] = [
  { offset: 0,   opacity: 0    },
  { offset: 0.3, opacity: 0    },
  { offset: 1,   opacity: 0.85 },
];

export function GradientOverlay({ stops = DEFAULT_STOPS, id = 'overlay' }: Props) {
  return (
    <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <SvgGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {stops.map((s, i) => (
            <Stop
              key={i}
              offset={s.offset}
              stopColor={s.color ?? colors.bg}
              stopOpacity={s.opacity}
            />
          ))}
        </SvgGradient>
      </Defs>
      <Rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
    </Svg>
  );
}
