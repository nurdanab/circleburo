// src/supabaseClient.js
// Теперь используем наш собственный API вместо Supabase
import { apiClient } from './apiClient';

// Экспортируем apiClient как supabase для совместимости
export { apiClient as supabase };
