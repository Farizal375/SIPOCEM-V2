import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

// Pastikan variabel environment tersedia di .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}

/**
 * Client Supabase untuk Server Actions (Authenticated).
 * Menggunakan token dari Clerk untuk mengakses data yang diproteksi RLS.
 */
export async function createSupabaseServerClient() {
  const { getToken } = await auth();
  
  // Mengambil token JWT dari Clerk menggunakan template bernama "supabase"
  // (Sesuai dengan konfigurasi di Dashboard Clerk Anda)
  const token = await getToken({ template: "supabase" });

  const headers: HeadersInit = {};
  
  // Hanya tambahkan header Authorization jika token berhasil didapatkan
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers,
    },
  });
}

/**
 * Client Supabase Biasa (Unauthenticated).
 * Gunakan ini hanya untuk data publik atau login client-side manual (jarang dipakai di pola ini).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);