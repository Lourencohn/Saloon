// lib/supabase.ts — Supabase client (lazy-constructed so missing env doesn't
// break the bundle). Replace the placeholders in .env once a real project
// exists; until then nothing in the app touches Supabase at runtime.
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createClient,
  type SupabaseClient,
} from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

function client(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const anon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon || url.includes('YOUR_PROJECT')) {
    throw new Error(
      'Supabase env não configurado. Defina EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY no .env (ou em eas.json) antes de chamar supabase.*',
    );
  }
  _client = createClient(url, anon, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
  return _client;
}

// Proxy that constructs the real client on first property access.
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop, receiver) {
    return Reflect.get(client(), prop, receiver);
  },
});
