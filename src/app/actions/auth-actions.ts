"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase dengan SERVICE ROLE KEY (Bypass RLS untuk insert awal)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Pastikan variable ini ada di .env.local
);

export async function registerUserAction(data: any) {
  try {
    const client = await clerkClient();

    // 1. Update Metadata Clerk (Set Role & Status)
    // data.userId didapat dari Clerk client-side setelah signUp.create
    await client.users.updateUser(data.userId, {
      publicMetadata: {
        role: "user",
        status: "Menunggu Validasi"
      }
    });

    // 2. Insert Data Profil ke Supabase
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: data.userId,
      nama_lengkap: data.nama_lengkap,
      email: data.email,
      nik: data.nik_ibu,
      jenis_kelamin: data.jenis_kelamin_ibu,
      alamat: data.alamat,
      no_telepon: data.no_telepon,
      no_jkn: data.no_jkn_ibu,
      faskes: data.faskes_ibu,
      pendidikan_terakhir: data.pendidikan_ibu,
      pekerjaan: data.pekerjaan_ibu,
      gol_darah: data.gol_darah_ibu,
      tempat_lahir: data.tempat_lahir_ibu,
      tanggal_lahir: data.tanggal_lahir_ibu,
      asuransi: data.asuransi_ibu,
      role: 'user',
      status: 'Menunggu Validasi'
    });

    if (profileError) throw new Error("DB Profile Error: " + profileError.message);

    // 3. Insert Data Suami
    if (data.nama_suami) {
      await supabaseAdmin.from('suami').insert({
        profile_id: data.userId,
        nama_lengkap: data.nama_suami,
        nik: data.nik_suami,
        jenis_kelamin: "Laki-laki",
        no_telepon: data.no_telepon_suami,
        // ... field lainnya
      });
    }

    // 4. Insert Data Anak (Looping)
    if (data.data_anak && data.data_anak.length > 0) {
       const anakData = data.data_anak.map((anak: any) => ({
          profile_id: data.userId,
          nama_lengkap: anak.nama,
          nik: anak.nik,
          jenis_kelamin: anak.jenis_kelamin,
          tanggal_lahir: anak.tanggal_lahir,
          nama_ibu: data.nama_lengkap,
          // ... field lainnya
       }));
       await supabaseAdmin.from('anak').insert(anakData);
    }

    // 5. Insert Riwayat Kesehatan
    await supabaseAdmin.from('riwayat_kesehatan_ibu').insert({
        profile_id: data.userId,
        kehamilan_ke: parseInt(data.kehamilan_ke || "1"),
        riwayat_keguguran: data.riwayat_keguguran,
        riwayat_penyakit: data.riwayat_penyakit
    });

    return { success: true };

  } catch (error: any) {
    console.error("Registration Error:", error);
    return { error: error.message };
  }
}