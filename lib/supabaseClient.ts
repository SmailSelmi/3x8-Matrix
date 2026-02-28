// lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://iykvicqotfcjzovkwiyz.supabase.co";

const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_LXOlD9PMoprhVDAqbgVEHQ_VrL7rzIF";

// Browser-side client — uses the publishable key.
// Safe to expose in the browser when RLS is enabled on your tables.
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
