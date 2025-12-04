// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Создаем фиктивный клиент для случаев, когда переменные окружения отсутствуют
const createMockSupabase = () => ({
  from: () => ({
    insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    select: () => Promise.resolve({ data: [], error: null }),
    update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
  })
});

// Проверяем, что переменные окружения доступны
let supabase;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are missing, using mock client');
  supabase = createMockSupabase();
} else {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };
