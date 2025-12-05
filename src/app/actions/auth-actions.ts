"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase Admin (Bypass RLS - Wajib untuk Register awal karena user belum ada di tabel profiles)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function registerSimpleUserAction(data: any) {
  try {
    const client = await clerkClient();

    // 1. Update Metadata Clerk (Menandakan role user & status)
    await client.users.updateUser(data.userId, {
      publicMetadata: {
        role: "user",
        status: "Menunggu Validasi"
      }
    });

    // 2. Insert Data Profil ke Supabase
    // Pastikan kolom-kolom ini sudah ada di tabel profiles (termasuk username)
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: data.userId,           // ID dari Clerk
      nama_lengkap: data.nama_lengkap,
      nik: data.nik,
      username: data.username,   // Pastikan kolom ini sudah ditambahkan di DB
      email: data.email,
      no_telepon: data.no_telepon,
      alamat: data.alamat,
      role: 'user',
      status: 'Menunggu Validasi'
    });

    if (profileError) {
      // Menangani error duplikat data (Unique Violation)
      if (profileError.code === '23505') {
        let msg = "Data sudah terdaftar.";
        if (profileError.message.includes("nik")) msg = "NIK tersebut sudah terdaftar.";
        if (profileError.message.includes("username")) msg = "Username tersebut sudah dipakai.";
        if (profileError.message.includes("email")) msg = "Email tersebut sudah terdaftar.";
        
        // Jika gagal insert DB, hapus user di Clerk agar tidak nyangkut (Orphan user)
        await client.users.deleteUser(data.userId);
        throw new Error(msg);
      }
      
      // Error lainnya
      console.error("Database Insert Error:", profileError);
      await client.users.deleteUser(data.userId); // Cleanup Clerk user
      throw new Error("Gagal menyimpan data profil ke database.");
    }

    return { success: true };

  } catch (error: any) {
    console.error("Registration Action Error:", error);
    return { success: false, error: error.message };
  }
}