// components/Icon.tsx — line-art icon set, ported from prototype/saloon-icons.jsx
import { ComponentProps } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors } from '@/constants/tokens';
import type { IconName } from '@/types/salon';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
  strokeWidth?: number;
  style?: ComponentProps<typeof Svg>['style'];
};

export function Icon({
  name,
  size = 22,
  color = colors.text,
  filled = false,
  strokeWidth = 1.5,
  style,
}: IconProps) {
  const stroke = color;
  const sw = strokeWidth;
  const fill = filled ? color : 'none';

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      {renderPath(name, fill)}
    </Svg>
  );
}

function renderPath(name: IconName, fill: string) {
  switch (name) {
    case 'search':
      return (
        <>
          <Circle cx="11" cy="11" r="7" />
          <Path d="m20 20-3.5-3.5" />
        </>
      );
    case 'pin':
      return (
        <>
          <Path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" />
          <Circle cx="12" cy="9" r="2.5" />
        </>
      );
    case 'heart':
      return (
        <Path
          d="M12 20s-7.5-4.5-7.5-10.5a4.5 4.5 0 0 1 8.25-2.5 4.5 4.5 0 0 1 8.25 2.5C21 15.5 12 20 12 20Z"
          fill={fill}
        />
      );
    case 'star':
      return (
        <Path
          d="m12 3 2.7 5.5 6 .9-4.4 4.3 1.1 6.1L12 17l-5.4 2.8 1-6.1L3.4 9.4l6-.9L12 3Z"
          fill={fill}
        />
      );
    case 'clock':
      return (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Path d="M12 7v5l3 2" />
        </>
      );
    case 'calendar':
      return (
        <>
          <Rect x="3.5" y="5" width="17" height="15" rx="2" />
          <Path d="M3.5 10h17M8 3v4M16 3v4" />
        </>
      );
    case 'filter':
      return <Path d="M4 6h16M7 12h10M10 18h4" />;
    case 'arrow':
      return <Path d="M5 12h14m-5-5 5 5-5 5" />;
    case 'back':
      return <Path d="M19 12H5m5 5-5-5 5-5" />;
    case 'close':
      return <Path d="m6 6 12 12M18 6 6 18" />;
    case 'check':
      return <Path d="m4 12 5 5L20 6" />;
    case 'bell':
      return (
        <>
          <Path d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7Z" />
          <Path d="M10 19a2 2 0 0 0 4 0" />
        </>
      );
    case 'user':
      return (
        <>
          <Circle cx="12" cy="8" r="4" />
          <Path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
        </>
      );
    case 'home':
      return (
        <Path d="M4 11 12 4l8 7v9a1 1 0 0 1-1 1h-4v-7h-6v7H5a1 1 0 0 1-1-1v-9Z" />
      );
    case 'bookmark':
      return <Path d="M6 3h12v18l-6-4-6 4V3Z" fill={fill} />;
    case 'scissors':
      return (
        <>
          <Circle cx="6" cy="7" r="3" />
          <Circle cx="6" cy="17" r="3" />
          <Path d="m9 9 11 11M9 15l11-11" />
        </>
      );
    case 'sparkle':
      return <Path d="M12 3v6m0 6v6M3 12h6m6 0h6M6 6l3 3m6 6 3 3M18 6l-3 3m-6 6-3 3" />;
    case 'flame':
      return (
        <Path d="M12 21c4 0 7-3 7-7 0-4-3-5-3-9 0 0-4 1-6 6-1 3-3 3-3 6 0 2.5 2 4 5 4Z" />
      );
    case 'diamond':
      return (
        <>
          <Path d="m12 3 8 7-8 11-8-11 8-7Z" />
          <Path d="M4 10h16M9 10l3-7m3 7-3-7" />
        </>
      );
    case 'more':
      return (
        <>
          <Circle cx="5" cy="12" r="1.5" fill="currentColor" />
          <Circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <Circle cx="19" cy="12" r="1.5" fill="currentColor" />
        </>
      );
    case 'chevron':
      return <Path d="m9 6 6 6-6 6" />;
    case 'chevronD':
      return <Path d="m6 9 6 6 6-6" />;
    case 'chevronU':
      return <Path d="m18 15-6-6-6 6" />;
    case 'plus':
      return <Path d="M12 5v14M5 12h14" />;
    case 'minus':
      return <Path d="M5 12h14" />;
    case 'share':
      return (
        <>
          <Circle cx="6" cy="12" r="2.5" />
          <Circle cx="18" cy="6" r="2.5" />
          <Circle cx="18" cy="18" r="2.5" />
          <Path d="m8 11 8-4M8 13l8 4" />
        </>
      );
    case 'card':
      return (
        <>
          <Rect x="3" y="6" width="18" height="13" rx="2" />
          <Path d="M3 10h18M7 15h3" />
        </>
      );
    case 'pix':
      return (
        <>
          <Path d="m12 3 9 9-9 9-9-9 9-9Z" />
          <Path d="M8 8 12 12 16 8M8 16l4-4 4 4" />
        </>
      );
    case 'hair':
      return (
        <Path d="M12 3c-4 0-7 4-7 9 0 0 2-2 5-2-3 1-5 4-5 7h14c0-3-2-6-5-7 3 0 5 2 5 2 0-5-3-9-7-9Z" />
      );
    case 'nail':
      return (
        <>
          <Path d="M9 4c0-1 1-1.5 3-1.5s3 .5 3 1.5v10c0 2-1 4-3 4s-3-2-3-4V4Z" />
          <Path d="M9 10h6" />
        </>
      );
    case 'face':
      return (
        <>
          <Circle cx="12" cy="12" r="9" />
          <Circle cx="9" cy="10" r="0.8" fill="currentColor" />
          <Circle cx="15" cy="10" r="0.8" fill="currentColor" />
          <Path d="M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5" />
        </>
      );
    case 'brow':
      return <Path d="M3 12c2-3 6-3 9 0M12 12c2-3 6-3 9 0" />;
    case 'lash':
      return (
        <>
          <Path d="M3 14c4-5 14-5 18 0" />
          <Path d="M6 13v3M9 12v4M12 11.5v4.5M15 12v4M18 13v3" />
        </>
      );
    case 'spa':
      return (
        <>
          <Path d="M12 4c-2 4-2 8 0 12 2-4 2-8 0-12Z" />
          <Path d="M5 12c4 0 7 2 7 4M19 12c-4 0-7 2-7 4" />
        </>
      );
    case 'combo':
      return (
        <>
          <Circle cx="8" cy="8" r="4" />
          <Circle cx="16" cy="16" r="4" />
          <Path d="M11 11l2 2" />
        </>
      );
    case 'event':
      return <Path d="m12 3 2 6h6l-5 4 2 7-5-4-5 4 2-7-5-4h6l2-6Z" />;
  }
}
