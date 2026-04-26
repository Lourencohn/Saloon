// components/Photo.tsx — local mock photos for the MVP
import { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { radii } from '@/constants/tokens';

const PHOTO_SOURCES = [
  require('../pictures/optimized/giorgio-trovato-gb6gtiTZKB8-unsplash.jpg'),
  require('../pictures/optimized/rafaella-mendes-diniz-et_78QkMMQs-unsplash.jpg'),
  require('../pictures/optimized/caroline-badran-OIEU0eopPT4-unsplash.jpg'),
  require('../pictures/optimized/sunny-ng-KVIlNRoGwxk-unsplash.jpg'),
  require('../pictures/optimized/joshua-rondeau-ZnHRNtwXg6Q-unsplash.jpg'),
  require('../pictures/optimized/samela-carvalho-hxp1rPHSUzI-unsplash.jpg'),
  require('../pictures/optimized/nora-hutton-tCJ44OIqceU-unsplash.jpg'),
  require('../pictures/optimized/jessica-donnelly-irXGNGSuWW4-unsplash.jpg'),
  require('../pictures/optimized/enecta-cannabis-extracts-80wCkpt-IKE-unsplash.jpg'),
  require('../pictures/optimized/baylee-gramling-MMz03PyCOZg-unsplash.jpg'),
  require('../pictures/optimized/bryony-elena-tXwBDZS2JxQ-unsplash.jpg'),
  require('../pictures/optimized/mathilde-langevin-FDRaYqiTY1k-unsplash.jpg'),
  require('../pictures/optimized/pablo-escobar-zRkla85Xe2o-unsplash.jpg'),
  require('../pictures/optimized/bermix-studio-xA_djNkH0Yo-unsplash.jpg'),
  require('../pictures/optimized/adam-winger-FkAZqQJTbXM-unsplash.jpg'),
  require('../pictures/optimized/stefan-stefancik-QXevDflbl8A-unsplash.jpg'),
  require('../pictures/optimized/jesse-donoghoe-2aiP_wxNrfU-unsplash.jpg'),
  require('../pictures/optimized/hayley-kim-studios-sRSRuxkOuzI-unsplash.jpg'),
  require('../pictures/optimized/nataliya-melnychuk-dFBhXJHKNeo-unsplash.jpg'),
  require('../pictures/optimized/michael-dam-mEZ3PoFGs_k-unsplash.jpg'),
  require('../pictures/optimized/laura-chouette-t1uTqt6qhWI-unsplash.jpg'),
  require('../pictures/optimized/adam-winger-WXmHwPcFamo-unsplash.jpg'),
  require('../pictures/optimized/lindsay-cash-Md_DhaFsnCQ-unsplash.jpg'),
  require('../pictures/optimized/jodene-isakowitz-hvqHtZqNMeI-unsplash.jpg'),
  require('../pictures/optimized/stefan-lehner-IYa5Dnj9qWE-unsplash.jpg'),
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
  const source = PHOTO_SOURCES[((seed % PHOTO_SOURCES.length) + PHOTO_SOURCES.length) % PHOTO_SOURCES.length];

  return (
    <View
      style={[
        { borderRadius: radius, overflow: 'hidden', height, backgroundColor: '#2A2230' },
        style,
      ]}
    >
      <Image
        source={source}
        contentFit="cover"
        cachePolicy="memory-disk"
        priority="high"
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}
