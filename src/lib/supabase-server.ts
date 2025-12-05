import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Fungsi Asli (JANGAN DIUBAH isinya agar dashboard lain aman)
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore if called from Server Component
          }
        },
      },
    }
  );
}

// --- PERBAIKAN: Export Alias ---
// Ini menambal error "Module has no exported member createSupabaseServerClient"
export const createSupabaseServerClient = createServerSupabaseClient;