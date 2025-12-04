import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

// Client untuk penggunaan di Client Component (tanpa auth otomatis)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Client untuk penggunaan di Server Component & Server Actions
export async function createSupabaseServerClient() {
  // Ambil token sesi dari Clerk
  const { getToken } = await auth();
  
  // Pastikan Anda sudah membuat template JWT bernama 'supabase' di dashboard Clerk
  const token = await getToken({ template: "supabase" });

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          // Suntikkan token Bearer ke header Authorization
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
}