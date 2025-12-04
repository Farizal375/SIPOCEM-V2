"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Helper: Cek Izin Kader/Admin
async function checkKader() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;
  if (role !== "kader" && role !== "admin") {
    throw new Error("Unauthorized: Akses Kader Diperlukan.");
  }
}

// --- 1. MANAJEMEN DATA IBU (PROFILE UPDATE) ---
export async function updateIbuAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    
    const id = formData.get("id") as string;
    
    const data = {
      nik: formData.get("nik") as string,
      nama_lengkap: formData.get("nama") as string,
      tanggal_lahir: formData.get("tgl_lahir") as string,
      alamat: formData.get("lokasi") as string,
    };

    const { error } = await supabase.from("profiles").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    
    revalidatePath("/kader/data-ibu");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

// --- 2. MANAJEMEN DATA IBU (CREATE MANUAL) ---
export async function createIbuAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    
    // Generate Fake ID untuk user manual (belum punya akun login)
    const fakeId = `manual_${Date.now()}`; 

    const data = {
      id: fakeId, 
      nik: formData.get("nik") as string,
      nama_lengkap: formData.get("nama") as string,
      tanggal_lahir: formData.get("tgl_lahir") as string,
      alamat: formData.get("lokasi") as string,
      role: 'user',
      status: 'Aktif'
    };

    const { error } = await supabase.from("profiles").insert(data);
    if (error) throw new Error(error.message);

    revalidatePath("/kader/data-ibu");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

// --- 3. MANAJEMEN DATA ANAK ---
export async function createAnakAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();

    // Pastikan ibu_id (profile_id) dikirim jika ada relasi
    const profile_id = formData.get("ibu_id") as string || null;

    const data = {
      profile_id: profile_id,
      nik: formData.get("nik") as string,
      nama_lengkap: formData.get("nama") as string,
      jenis_kelamin: formData.get("jk") as string,
      tanggal_lahir: formData.get("tgl_lahir") as string,
      nama_ibu: formData.get("nama_ibu") as string,
    };

    const { error } = await supabase.from("anak").insert(data);
    if (error) throw new Error(error.message);

    revalidatePath("/kader/data-anak");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateAnakAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    const id = formData.get("id") as string;

    const data = {
      nik: formData.get("nik") as string,
      nama_lengkap: formData.get("nama") as string,
      jenis_kelamin: formData.get("jk") as string,
      tanggal_lahir: formData.get("tgl_lahir") as string,
      nama_ibu: formData.get("nama_ibu") as string,
    };

    const { error } = await supabase.from("anak").update(data).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/kader/data-anak");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

// --- 4. PEMERIKSAAN IBU (ANC) ---
export async function createPemeriksaanIbuAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    // [BARU] Validasi ID Ibu
    const ibuId = formData.get("ibu_id") as string;
    if (!ibuId) throw new Error("ID Ibu tidak ditemukan, pastikan data valid.");

    const data = {
      ibu_id: ibuId, 
      kader_id: userId,
      tanggal_periksa: formData.get("tanggal") as string,
      usia_kandungan: Number(formData.get("usia_kandungan")),
      bb: Number(formData.get("bb")),
      tensi: formData.get("tensi") as string,
      tfu: Number(formData.get("tfu")),
      djj: Number(formData.get("djj")),
      lila: Number(formData.get("lila")),
      catatan: (formData.get("catatan") as string) || "",
    };

    const { error } = await supabase.from("pemeriksaan_ibu").insert(data);
    if (error) throw new Error(error.message);
    
    revalidatePath(`/kader/data-ibu/${ibuId}`);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

// --- 5. PEMERIKSAAN ANAK ---
export async function createPemeriksaanAnakAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    const { userId } = await auth();

    // [BARU] Validasi ID Anak
    const anakId = formData.get("anak_id") as string;
    if (!anakId) throw new Error("ID Anak tidak ditemukan.");

    const data = {
      anak_id: Number(anakId),
      kader_id: userId,
      tanggal_periksa: formData.get("tanggal") as string,
      usia_bulan: Number(formData.get("usia")),
      bb: Number(formData.get("bb")),
      tb: Number(formData.get("tb")),
      lk: Number(formData.get("lk")),
      lila: Number(formData.get("lila")),
      vitamin_a: formData.get("vit_a") ? "Merah" : "-", 
    };

    const { error } = await supabase.from("pemeriksaan_anak").insert(data);
    if (error) throw new Error(error.message);

    revalidatePath(`/kader/data-anak/${anakId}`);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

// --- 6. JADWAL POSYANDU ---
export async function createJadwalAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();

    const data = {
      nama_kader: formData.get("kader") as string,
      tanggal: formData.get("tanggal") as string,
      nama_bidan: formData.get("bidan") as string,
      kegiatan: formData.get("kegiatan") as string,
      kontak: formData.get("kontak") as string,
    };

    const { error } = await supabase.from("jadwal_posyandu").insert(data);
    if (error) throw new Error(error.message);

    revalidatePath("/kader/jadwal");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateJadwalAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    const id = formData.get("id") as string;
  
    const data = {
      nama_kader: formData.get("kader") as string,
      tanggal: formData.get("tanggal") as string,
      nama_bidan: formData.get("bidan") as string,
      kegiatan: formData.get("kegiatan") as string,
      kontak: formData.get("kontak") as string,
    };
  
    const { error } = await supabase.from("jadwal_posyandu").update(data).eq("id", Number(id));
    if (error) throw new Error(error.message);
  
    revalidatePath("/kader/jadwal");
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}