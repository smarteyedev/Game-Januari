import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (import.meta.env.DEV) {
  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY (dev)')
  }
} else {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing env: VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY')
  }
}

export const supabase = createClient(supabaseUrl ?? '', supabaseKey ?? '')
