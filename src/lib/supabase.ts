import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get credentials from Vite env or user configured localStorage
const getStoredConfig = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL;
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY;

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('tamreen_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('tamreen_supabase_key') : null;

  return {
    supabaseUrl: localUrl || envUrl || '',
    supabaseAnonKey: localKey || envKey || ''
  };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient | null => {
  const { supabaseUrl, supabaseAnonKey } = getStoredConfig();

  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }

  return clientInstance;
};

export const isSupabaseConfigured = (): boolean => {
  const { supabaseUrl, supabaseAnonKey } = getStoredConfig();
  return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));
};

export const getSupabaseConfig = () => {
  return getStoredConfig();
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('tamreen_supabase_url', url.trim());
      localStorage.setItem('tamreen_supabase_key', key.trim());
    } else {
      localStorage.removeItem('tamreen_supabase_url');
      localStorage.removeItem('tamreen_supabase_key');
    }
    clientInstance = null; // reset client instance to reload with new config
  }
};

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Supabase URL অথবা Anon Key কনফিগার করা হয়নি।'
    };
  }

  try {
    // Attempt a lightweight ping query on courses or exams table
    const { error } = await client.from('courses').select('id').limit(1);
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, we still connected to Supabase
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        return {
          success: true,
          message: 'Supabase কানেক্টেড! তবে টেবিল তৈরি করা প্রয়োজন।'
        };
      }
      return {
        success: false,
        message: `Supabase ত্রুটি: ${error.message}`
      };
    }
    return {
      success: true,
      message: 'Supabase ডাটাবেজ সফলভাবে কানেক্টেড রয়েছে!'
    };
  } catch (err: any) {
    return {
      success: false,
      message: `কানেকশন ব্যর্থ: ${err?.message || 'অজানা সমস্যা'}`
    };
  }
};
