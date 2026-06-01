import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const url  = process.env.EXPO_PUBLIC_SUPABASE_URL  || '';
const key  = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Configured = both env vars present (non-empty, non-placeholder)
export const IS_CONFIGURED =
  url.startsWith('https://') && key.length > 20;

// Expo-compatible secure storage adapter for Supabase auth session
const ExpoSecureStoreAdapter = {
  getItem:    (k) => SecureStore.getItemAsync(k),
  setItem:    (k, v) => SecureStore.setItemAsync(k, v),
  removeItem: (k) => SecureStore.deleteItemAsync(k),
};

export const supabase = IS_CONFIGURED
  ? createClient(url, key, {
      auth: {
        storage: ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// ── Helpers ───────────────────────────────────────────────────────────

export async function getProfile(userId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return data;
}

export async function updateProfile(userId, patch) {
  if (!supabase) return;
  await supabase.from('profiles').update(patch).eq('id', userId);
}

export async function getNearbyBooks(district, city) {
  if (!supabase) return null;
  // Real build: filter by proximity (district/city centroid).
  // For now: return all available books.
  const { data } = await supabase
    .from('books')
    .select(`
      *,
      current_owner:profiles(id, name, photo_url, district, city),
      ownership(id, owner_id, city, country, date_received, rating, review_text,
        owner:profiles(id, name, photo_url))
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false });
  return data;
}

export async function getBook(bookId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('books')
    .select(`
      *,
      current_owner:profiles(id, name, photo_url, district, city),
      ownership(*, owner:profiles(id, name, photo_url))
    `)
    .eq('id', bookId)
    .single();
  return data;
}

export async function addBook({ isbn, title, author, coverUrl, condition, rating, reviewText, price, isFree, genre, userId, city, country }) {
  if (!supabase) return null;
  const { data: book, error } = await supabase
    .from('books')
    .insert({
      isbn, title, author,
      cover_image_url: coverUrl,
      current_owner: userId,
      condition,
      price: isFree ? 0 : parseFloat(price),
      is_free: isFree,
      genre: genre || '',
      is_available: true,
    })
    .select()
    .single();
  if (error || !book) return null;
  // Create first ownership/passport entry
  await supabase.from('ownership').insert({
    book_id: book.id,
    owner_id: userId,
    city, country,
    condition, rating, review_text: reviewText,
  });
  return book;
}

export async function getThreads(userId) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id(id, name, photo_url),
      receiver:profiles!receiver_id(id, name, photo_url),
      book:books(id, title, isbn, price, is_free, condition)
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  return data;
}

export async function sendMessage({ senderId, receiverId, bookId, content }) {
  if (!supabase) return null;
  const { data } = await supabase
    .from('messages')
    .insert({ sender_id: senderId, receiver_id: receiverId, book_id: bookId, content })
    .select()
    .single();
  return data;
}

export async function upsertConsent(userId, prefs) {
  if (!supabase) return;
  await supabase.from('consents').upsert({
    user_id: userId,
    ...prefs,
    policy_version: '1.0',
  }, { onConflict: 'user_id,policy_version' });
}
