// components/AuthField.tsx — labeled text input for login/register
import { ReactNode } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, fonts, radii } from '@/constants/tokens';
import { Icon } from '@/components/Icon';
import type { IconName } from '@/types/salon';

type Props = {
  label: string;
  icon: IconName;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  right?: ReactNode;
};

export function AuthField({
  label, icon, value, onChangeText, placeholder,
  secureTextEntry, keyboardType, autoCapitalize, autoComplete, textContentType, right,
}: Props) {
  return (
    <View>
      <Text style={{
        fontFamily: fonts.sansBold,
        fontSize: 11,
        color: colors.textDim,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        marginBottom: 6,
      }}>
        {label}
      </Text>
      <View style={{
        height: 52,
        borderRadius: radii.md,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.lineStrong,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        gap: 12,
      }}>
        <Icon name={icon} size={18} color={colors.textDim} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textDim}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          style={{
            flex: 1,
            color: colors.text,
            fontFamily: fonts.sans,
            fontSize: 15,
            padding: 0,
          }}
        />
        {right}
      </View>
    </View>
  );
}
