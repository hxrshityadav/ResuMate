import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isConfigured = supabaseUrl &&
  supabaseUrl !== "your_supabase_project_url" &&
  supabaseUrl.startsWith("http");

const createMockSupabase = () => {
  console.warn("Supabase is not configured. Running with mock client.");

  const mockQuery = () => {
    const chain = {
      select: () => Promise.resolve({ data: [], error: null }),
      insert: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ data: [], error: null }),
      delete: () => Promise.resolve({ data: [], error: null }),
      eq: () => Promise.resolve({ data: [], error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
    };
    return chain;
  };

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } }
      }),
      signOut: () => Promise.resolve({ error: null }),
      signInWithPassword: () => Promise.resolve({ data: {}, error: new Error("Supabase not configured") }),
      signUp: () => Promise.resolve({ data: {}, error: new Error("Supabase not configured") }),
      signInWithOAuth: () => Promise.resolve({ data: {}, error: new Error("Supabase not configured") }),
      resetPasswordForEmail: () => Promise.resolve({ data: {}, error: new Error("Supabase not configured") }),
    },
    from: mockQuery,
  };
};

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabase();
