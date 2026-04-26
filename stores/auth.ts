// stores/auth.ts — Supabase Auth session mirrored into Zustand
import { create } from 'zustand';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  avatarSeed: number;
  memberSince: string;
};

type AuthResult = { ok: true } | { ok: false; reason: string };

type AuthState = {
  user: AuthUser | null;
  hydrated: boolean;
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (name: string, email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

let initialized = false;

export const useAuth = create<AuthState>((set) => ({
  user: null,
  hydrated: false,

  initialize: async () => {
    if (initialized) return;
    initialized = true;

    if (!isSupabaseConfigured()) {
      set({ user: null, hydrated: true });
      return;
    }

    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      set({ user: await buildAuthUser(data.session.user.id, data.session.user.email ?? null) });
    }

    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        set({ user: null, hydrated: true });
        return;
      }

      buildAuthUser(session.user.id, session.user.email ?? null).then(user => {
        set({ user, hydrated: true });
      });
    });

    set(s => ({ ...s, hydrated: true }));
  },

  login: async (email, password) => {
    const trimmed = email.trim().toLowerCase();
    if (!isSupabaseConfigured()) {
      return { ok: false, reason: 'Configure o .env do Supabase antes de entrar.' };
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      return { ok: false, reason: 'E-mail inválido' };
    }
    if (password.length < 6) {
      return { ok: false, reason: 'Senha precisa ter ao menos 6 caracteres' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmed,
      password,
    });

    if (error) return { ok: false, reason: translateAuthError(error.message) };
    if (data.user) set({ user: await buildAuthUser(data.user.id, data.user.email ?? trimmed) });
    return { ok: true };
  },

  register: async (name, email, password) => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!isSupabaseConfigured()) {
      return { ok: false, reason: 'Configure o .env do Supabase antes de criar conta.' };
    }
    if (trimmedName.length < 2) {
      return { ok: false, reason: 'Conte-nos seu nome (ao menos 2 letras)' };
    }
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      return { ok: false, reason: 'E-mail inválido' };
    }
    if (password.length < 6) {
      return { ok: false, reason: 'Senha precisa ter ao menos 6 caracteres' };
    }

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
      options: { data: { name: trimmedName } },
    });

    if (error) return { ok: false, reason: translateAuthError(error.message) };

    // Sem session = confirmação por e-mail está ativa no Supabase. Não logamos
    // o usuário (não temos JWT, qualquer query falharia em silêncio); orientamos
    // a confirmar o e-mail antes.
    if (!data.session) {
      return {
        ok: false,
        reason: 'Conta criada. Confirme seu e-mail para entrar (ou desative a confirmação no painel do Supabase).',
      };
    }

    if (data.user) {
      await upsertProfile(data.user.id, trimmedName, trimmedEmail);
      set({ user: await buildAuthUser(data.user.id, trimmedEmail) });
    }
    return { ok: true };
  },

  logout: async () => {
    if (isSupabaseConfigured()) await supabase.auth.signOut();
    set({ user: null });
  },
}));

async function buildAuthUser(id: string, email: string | null): Promise<AuthUser> {
  const { data } = await supabase
    .from('profiles')
    .select('name,email,avatar_url,created_at')
    .eq('id', id)
    .maybeSingle();

  return {
    id,
    email: data?.email ?? email ?? '',
    name: data?.name ?? deriveName(email ?? ''),
    avatarSeed: hash(id),
    memberSince: data?.created_at ?? new Date().toISOString(),
  };
}

async function upsertProfile(id: string, name: string, email: string) {
  await supabase
    .from('profiles')
    .upsert({ id, name, email }, { onConflict: 'id' });
}

function deriveName(email: string): string {
  const local = email.split('@')[0] ?? 'cliente';
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w[0]?.toUpperCase() + w.slice(1))
    .join(' ') || 'Cliente';
}

function hash(value: string): number {
  return Array.from(value).reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % 8;
}

function translateAuthError(message: string): string {
  if (/invalid login credentials/i.test(message)) return 'E-mail ou senha incorretos.';
  if (/already registered|already exists/i.test(message)) return 'Este e-mail já está cadastrado.';
  if (/email rate limit/i.test(message)) {
    return 'Muitas tentativas em pouco tempo. Tente de novo em 1 hora ou desative a confirmação por e-mail no Supabase.';
  }
  if (/email not confirmed/i.test(message)) {
    return 'E-mail ainda não confirmado. Cheque sua caixa de entrada (ou desative a confirmação no Supabase).';
  }
  if (/over_email_send_rate_limit/i.test(message)) {
    return 'Limite de e-mails do Supabase atingido. Aguarde 1h ou configure SMTP próprio.';
  }
  if (/password/i.test(message)) return 'A senha precisa ter ao menos 6 caracteres.';
  return message;
}
