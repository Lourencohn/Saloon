// components/Sheet.tsx — bottom sheet modal
import { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, radii } from '@/constants/tokens';
import { Icon } from '@/components/Icon';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export function Sheet({ visible, onClose, title, children }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}
      />
      <View style={{
        position: 'absolute',
        left: 0, right: 0, bottom: 0,
        backgroundColor: colors.surface,
        borderTopLeftRadius: radii.xl,
        borderTopRightRadius: radii.xl,
        paddingTop: 12,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 22,
        maxHeight: '88%',
      }}>
        <View style={{
          width: 40, height: 4, borderRadius: 2,
          backgroundColor: colors.lineStrong,
          alignSelf: 'center',
          marginBottom: 18,
        }} />

        {title && (
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 18,
          }}>
            <Text style={{
              fontFamily: fonts.serif,
              fontSize: 24,
              color: colors.text,
              letterSpacing: -0.3,
            }}>
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              hitSlop={8}
              style={{
                width: 32, height: 32, borderRadius: 16,
                backgroundColor: colors.surfaceHi,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="close" size={16} color={colors.text} />
            </Pressable>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </View>
    </Modal>
  );
}
