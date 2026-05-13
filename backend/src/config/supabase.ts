import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

class SupabaseConfig {
  private static instance: SupabaseClient | null = null;

  private constructor() {}

  public static getClient(): SupabaseClient {
    if (!SupabaseConfig.instance) {
      const url = process.env.SUPABASE_URL || '';
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

      if (!url || !key) {
        console.warn('Supabase credentials not configured. Using mock mode.');
      }

      SupabaseConfig.instance = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return SupabaseConfig.instance;
  }

  public static resetInstance(): void {
    SupabaseConfig.instance = null;
  }
}

export default SupabaseConfig;
