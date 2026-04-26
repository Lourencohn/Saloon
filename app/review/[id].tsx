// app/review/[id].tsx
// Mirrors prototype/saloon-screens-4.jsx → ScreenReview
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { Btn } from '@/components/Btn';
import { Chip } from '@/components/Chip';
import { DetailHeader } from '@/components/DetailHeader';
import { Icon } from '@/components/Icon';
import { Photo } from '@/components/Photo';
import { BOOKINGS } from '@/constants/mock';
import { colors, fonts, radii } from '@/constants/tokens';
import { useBookings, useCreateReview } from '@/hooks/useBookings';
import { useAuth } from '@/stores/auth';
import { useAgenda } from '@/stores/agenda';

const TAG_OPTIONS = [
  'Atendimento atencioso',
  'Pontual',
  'Resultado impecável',
  'Ambiente acolhedor',
  'Vou voltar',
  'Custo-benefício',
];

const RATING_LABELS = ['', 'Insatisfeita', 'Não foi bem', 'Razoável', 'Muito bom', 'Perfeito'];

export default function ReviewScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuth(s => s.user);
  const { data } = useBookings(user?.id);
  const createReview = useCreateReview();

  const fallbackBookings = useAgenda(s => s.bookings);
  const markRated = useAgenda(s => s.markRated);

  const booking = useMemo(
    () => (data?.length ? data : fallbackBookings).find(b => b.id === id) ?? BOOKINGS[3],
    [id, data, fallbackBookings],
  );

  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTag = (t: string) =>
    setTags(s => (s.includes(t) ? s.filter(x => x !== t) : [...s, t]));

  const onSubmit = async () => {
    if (!rating || !booking.id || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      if (user && booking.salonId) {
        await createReview.mutateAsync({
          bookingId: booking.id,
          userId: user.id,
          salonId: booking.salonId,
          rating,
          tags,
          comment: text,
        });
      } else {
        markRated(booking.id, rating);
      }
      router.replace('/bookings' as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível enviar sua avaliação.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <DetailHeader
        title="Avaliar atendimento"
        subtitle={booking.salon}
        onBack={() => router.back()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 24, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <Photo
            seed={booking.photoSeed}
            radius={42}
            style={{ width: 84, height: 84, marginBottom: 16 }}
          />
          <Text style={{
            fontFamily: fonts.sansMedium, fontSize: 12, color: colors.textDim, letterSpacing: 0.4,
          }}>
            {booking.date}
          </Text>
          <Text style={{
            fontFamily: fonts.serif, fontSize: 22, color: colors.text,
            marginTop: 4, letterSpacing: -0.2, textAlign: 'center',
          }}>
            {booking.service}
          </Text>
        </View>

        <Text style={{
          fontFamily: fonts.serifItalic,
          fontSize: 26,
          color: colors.text,
          textAlign: 'center',
          marginBottom: 22,
        }}>
          Como foi sua experiência?
        </Text>

        <View style={{
          flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 12,
        }}>
          {[1, 2, 3, 4, 5].map(i => (
            <Pressable
              key={i}
              onPress={() => setRating(i)}
              hitSlop={8}
              style={({ pressed }) => ({
                transform: [{ scale: rating === i ? 1.15 : pressed ? 0.95 : 1 }],
              })}
            >
              <Icon
                name="star"
                size={42}
                filled={i <= rating}
                strokeWidth={1.2}
                color={i <= rating ? colors.gold : colors.lineStrong}
              />
            </Pressable>
          ))}
        </View>

        <Text style={{
          fontFamily: fonts.sansMedium,
          fontSize: 13,
          color: colors.rose,
          textAlign: 'center',
          minHeight: 18,
          marginBottom: 32,
          opacity: rating ? 1 : 0,
        }}>
          {RATING_LABELS[rating]}
        </Text>

        {rating > 0 && (
          <>
            <Text style={sectionLabel}>Marque o que combinou</Text>
            <View style={{
              flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 28,
            }}>
              {TAG_OPTIONS.map(t => (
                <Chip
                  key={t}
                  active={tags.includes(t)}
                  onPress={() => toggleTag(t)}
                >
                  {t}
                </Chip>
              ))}
            </View>

            <Text style={sectionLabel}>Conte mais (opcional)</Text>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="O que mais marcou no atendimento?"
              placeholderTextColor={colors.textDim}
              multiline
              textAlignVertical="top"
              style={{
                minHeight: 100,
                padding: 14,
                borderRadius: radii.md,
                backgroundColor: colors.surface,
                borderWidth: 1,
                borderColor: colors.line,
                color: colors.text,
                fontFamily: fonts.sans,
                fontSize: 13,
                lineHeight: 20,
              }}
            />
          </>
        )}
        {error && (
          <Text style={{
            fontFamily: fonts.sansMedium,
            fontSize: 12,
            color: colors.rose,
            textAlign: 'center',
            marginTop: 14,
          }}>
            {error}
          </Text>
        )}
      </ScrollView>

      <View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        paddingHorizontal: 22,
        paddingTop: 16,
        paddingBottom: insets.bottom + 16,
        backgroundColor: colors.bg,
      }}>
        <Btn
          variant="primary"
          size="lg"
          full
          disabled={rating === 0 || submitting}
          onPress={onSubmit}
        >
          {submitting ? 'Enviando…' : 'Enviar avaliação'}
        </Btn>
      </View>
    </View>
  );
}

const sectionLabel = {
  fontFamily: fonts.sansBold,
  fontSize: 11,
  color: colors.textDim,
  letterSpacing: 1.5,
  textTransform: 'uppercase' as const,
  marginBottom: 12,
};
