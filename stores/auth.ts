// stores/auth.ts — auth state persisted to AsyncStorage
// Backend stub: when Supabase Auth is wired, replace `login` body with
// supabase.auth.signInWithPassword and rehydrate `user` from session.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarSeed: number;
  memberSince: string; // ISO
};

type AuthResult = { ok: true } | { ok: false; reason: string };

type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => void;
  setHydrated: (v: boolean) => void;
};

function deriveName(email: string): string {
  const local = email.split('@')[0] ?? 'cliente';
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0]?.toUpperCase() + w.slice(1))
    .join(' ') || 'Cliente';
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      login: async (email, password) => {
        const trimmed = email.trim().toLowerCase();
        if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
          return { ok: false, reason: 'E-mail inválido' };
        }
        if (password.length < 4) {
          return { ok: false, reason: 'Senha precisa ter ao menos 4 caracteres' };
        }
        // Mock auth — replace with supabase.auth.signInWithPassword later.
        await new Promise(r => setTimeout(r, 350));
        set({
          user: {
            id: `u_${Date.now().toString(36)}`,
            email: trimmed,
            name: deriveName(trimmed),
            avatarSeed: 3,
            memberSince: new Date().toISOString(),
          },
        });
        return { ok: true };
      },

      register: async (name, email, password) => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        if (trimmedName.length < 2) {
          return { ok: false, reason: 'Conte-nos seu nome (ao menos 2 letras)' };
        }
        if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
          return { ok: false, reason: 'E-mail inválido' };
        }
        if (password.length < 4) {
          return { ok: false, reason: 'Senha precisa ter ao menos 4 caracteres' };
        }
        // Mock signup — replace with supabase.auth.signUp later.
        await new Promise(r => setTimeout(r, 450));
        set({
          user: {
            id: `u_${Date.now().toString(36)}`,
            email: trimmedEmail,
            name: trimmedName,
            avatarSeed: Math.floor(Math.random() * 8),
            memberSince: new Date().toISOString(),
          },
        });
        return { ok: true };
      },

      logout: () => set({ user: null }),
    }),
    {
      name: 'saloon-auth',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ user: s.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
