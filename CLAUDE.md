# Saloon — Mobile App

> "Sua rotina de beleza, sem esforço."
> Um iFood dos salões de beleza — descubra, agende e gerencie cuidados de beleza em poucos toques.

## 📁 Estrutura

```
saloon/
├── app/                      # Expo Router (file-based routing)
│   ├── (auth)/               # Onboarding, login
│   ├── (tabs)/               # Home, Buscar, Agenda, Perfil
│   ├── salon/[id].tsx        # Detalhe do salão
│   ├── booking/              # select → calendar → confirm → success
│   └── review/[id].tsx
├── components/               # UI primitives (Btn, Card, Pill, Photo…)
├── constants/
│   └── tokens.ts             # Cores, tipografia, radii
├── lib/
│   ├── supabase.ts
│   └── notifications.ts
├── hooks/
├── stores/                   # Zustand
├── types/
├── prototype/                # ⚠️ Protótipo HTML — referência visual (não rodar)
└── supabase/
    └── schema.sql
```

## 🚀 Quick start

```bash
git clone https://github.com/Lourencohn/Saloon.git
cd Saloon
npm install
npx expo start
```

Crie um `.env` na raiz (veja `.env.example`):
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

## 🛠️ Stack

| Camada | Ferramenta |
|---|---|
| Runtime | Expo SDK 51 + React Native |
| Linguagem | TypeScript |
| Navegação | expo-router |
| Estilos | NativeWind (Tailwind para RN) |
| Estado | Zustand |
| Data | TanStack Query + Supabase |
| Backend | Supabase (Postgres + Auth + Storage + Realtime) |
| Animações | react-native-reanimated + moti |
| Notificações | expo-notifications |
| Pagamento | Stripe + Pix (Mercado Pago) |
| Build | EAS Build / EAS Submit |

## 🎨 Design tokens (do protótipo)

```ts
// constants/tokens.ts
export const colors = {
  bg:        '#15101A',
  surface:   '#1E1822',
  surfaceHi: '#2A2230',
  line:      'rgba(245,230,211,0.08)',
  lineStrong:'rgba(245,230,211,0.16)',

  text:      '#F5E6D3',
  textMid:   '#C9B8A8',
  textDim:   '#9A8A85',
  textFaint: '#5E5359',

  rose:      '#E8B4B8',  // primary accent
  roseDeep:  '#C97B82',
  gold:      '#D4AF8F',  // secondary
  success:   '#9BB89A',
};

export const fonts = {
  serif: 'CormorantGaramond_500Medium',
  serifItalic: 'CormorantGaramond_500Medium_Italic',
  sans: 'Inter_500Medium',
  sansBold: 'Inter_600SemiBold',
};

export const radii = { sm: 8, md: 14, lg: 20, xl: 28, pill: 999 };
```

## 🗺️ Telas (mapeadas do protótipo)

| Tela | Arquivo | Referência (prototype/) |
|---|---|---|
| Onboarding | `app/(auth)/onboarding.tsx` | saloon-screens-1.jsx → ScreenOnboarding |
| Home | `app/(tabs)/index.tsx` | saloon-screens-1.jsx → ScreenHome |
| Buscar | `app/(tabs)/search.tsx` | saloon-screens-2.jsx → ScreenSearch |
| Detalhe salão | `app/salon/[id].tsx` | saloon-screens-2.jsx → ScreenSalon |
| Selecionar serviços | `app/booking/select.tsx` | saloon-screens-3.jsx → ScreenSelect |
| Calendário | `app/booking/calendar.tsx` | saloon-screens-3.jsx → ScreenCalendar |
| Confirmação | `app/booking/confirm.tsx` | saloon-screens-3.jsx → ScreenConfirm |
| Sucesso | `app/booking/success.tsx` | saloon-screens-3.jsx → ScreenSuccess |
| Agenda | `app/(tabs)/bookings.tsx` | saloon-screens-4.jsx → ScreenBookings |
| Avaliação | `app/review/[id].tsx` | saloon-screens-4.jsx → ScreenReview |
| Perfil | `app/(tabs)/profile.tsx` | saloon-screens-4.jsx → ScreenProfile |

## 🤝 Trabalhando com Claude Code

**Workflow recomendado:**

1. Para cada tela, peça ao Claude Code:
   > "Implemente `app/(tabs)/index.tsx` (Home) seguindo `prototype/saloon-screens-1.jsx → ScreenHome`. Use os tokens de `constants/tokens.ts`, NativeWind e os componentes em `components/`. Mantenha a tipografia Cormorant para títulos e Inter para corpo."

2. Para o backend, comece pelo schema:
   > "Aplique `supabase/schema.sql` no projeto Supabase e gere os tipos TypeScript em `types/database.ts` via `supabase gen types`."

3. Para queries:
   > "Crie hooks em `hooks/` para useSalons, useSalon(id), useBookings, useCreateBooking — usando TanStack Query e o cliente Supabase de `lib/supabase.ts`."

**Regras de ouro:**
- Não invente cores/tipos fora de `constants/tokens.ts`
- Componentes pequenos e tipados
- Animações com `react-native-reanimated` (não `Animated` legacy)
- Toda lista de salões/serviços passa por TanStack Query (cache + offline)

## 📦 Roadmap

- [x] Protótipo de UI (HTML/React)
- [ ] Setup Expo + tokens + fontes
- [ ] Auth (Supabase magic link / Apple / Google)
- [ ] Schema + seed de dados
- [ ] Telas principais (home, busca, salão)
- [ ] Fluxo de agendamento
- [ ] Notificações push (lembretes 24h/1h + Réveillon)
- [ ] Pix + cartão
- [ ] Avaliações
- [ ] EAS submit (TestFlight + Play Internal)
