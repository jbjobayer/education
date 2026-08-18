import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Sanitizes Supabase URL to ensure strictly valid ASCII/ISO-8859-1 format without hidden unicode chars
 */
export const cleanSupabaseUrl = (rawUrl: string): string => {
  if (!rawUrl) return '';
  let url = String(rawUrl)
    .replace(/[\u200B-\u200D\uFEFF\u2060\u180E\u00A0]/g, '') // remove zero-width & non-breaking spaces
    .replace(/[^\x20-\x7E]/g, '') // remove all non-ASCII characters
    .trim();

  // Strip trailing slashes
  url = url.replace(/\/+$/, '');

  // Add https:// if missing
  if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
};

/**
 * Sanitizes Supabase Key (JWT / Anon key) to ensure strictly valid ASCII/ISO-8859-1 format
 */
export const cleanSupabaseKey = (rawKey: string): string => {
  if (!rawKey) return '';
  return String(rawKey)
    .replace(/[\u200B-\u200D\uFEFF\u2060\u180E\u00A0\s\r\n\t]/g, '') // remove whitespace & zero-width
    .replace(/[^\x20-\x7E]/g, '') // remove any non-ASCII character that crashes Headers.set
    .trim();
};

// Get credentials from Vite env or user configured localStorage
const getStoredConfig = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = cleanSupabaseUrl(metaEnv.VITE_SUPABASE_URL || '');
  const envKey = cleanSupabaseKey(metaEnv.VITE_SUPABASE_ANON_KEY || '');

  const localUrl = typeof window !== 'undefined' ? cleanSupabaseUrl(localStorage.getItem('tamreen_supabase_url') || '') : '';
  const localKey = typeof window !== 'undefined' ? cleanSupabaseKey(localStorage.getItem('tamreen_supabase_key') || '') : '';

  return {
    supabaseUrl: localUrl || envUrl || '',
    supabaseAnonKey: localKey || envKey || ''
  };
};

let clientInstance: SupabaseClient | null = null;
let lastUsedConfig = { url: '', key: '' };

export const getSupabase = (): SupabaseClient | null => {
  const { supabaseUrl, supabaseAnonKey } = getStoredConfig();

  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
    return null;
  }

  // Reuse instance if config hasn't changed
  if (clientInstance && lastUsedConfig.url === supabaseUrl && lastUsedConfig.key === supabaseAnonKey) {
    return clientInstance;
  }

  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
    lastUsedConfig = { url: supabaseUrl, key: supabaseAnonKey };
  } catch (e) {
    console.error('Failed to create Supabase client:', e);
    return null;
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
    const cleanedUrl = cleanSupabaseUrl(url);
    const cleanedKey = cleanSupabaseKey(key);

    if (cleanedUrl && cleanedKey) {
      localStorage.setItem('tamreen_supabase_url', cleanedUrl);
      localStorage.setItem('tamreen_supabase_key', cleanedKey);
    } else {
      localStorage.removeItem('tamreen_supabase_url');
      localStorage.removeItem('tamreen_supabase_key');
    }
    clientInstance = null; // reset client instance to reload with new config
    lastUsedConfig = { url: '', key: '' };
  }
};

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const { supabaseUrl, supabaseAnonKey } = getStoredConfig();
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      success: false,
      message: 'Supabase Project URL এবং Anon Key প্রদান করুন।'
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Supabase ক্লায়েন্ট তৈরি করা যায়নি। URL ও Key পরীক্ষা করুন।'
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
          message: 'Supabase সফলভাবে কানেক্টেড! (ডাটাবেজ প্রস্তুত)'
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
    const errMsg = String(err?.message || err || 'অজানা সমস্যা');
    return {
      success: false,
      message: `কানেকশন ব্যর্থ: ${errMsg}`
    };
  }
};

