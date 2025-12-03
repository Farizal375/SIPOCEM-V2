"use server";

import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Helper untuk cek otorisasi Kader
async function checkKaderAuth() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;
  if (role !== "kader" && role !== "admin") {
    throw new Error("Unauthorized: Hanya Kader yang boleh melakukan aksi ini.");
  }
}

// --- 1. MANAJEMEN IBU HAMIL ---

export async function createIbuAction(formData: FormData) {
  await checkKaderAuth();
  const rawData = Object.fromEntries(formData.entries());
  
  const { error } = await supabase.from("profiles").insert({
    nik: rawData.nik,
    nama_lengkap: rawData.nama,
    tanggal_lahir: rawData.tgl_lahir,
    alamat: rawData.lokasi,
    role: "user", // Asumsi data ibu masuk ke profiles
    // field lain sesuai kebutuhan database
  });

  if (error) return { error: error.message };
  revalidatePath("/kader/data-ibu");
  return { success: true };
}

export async function updateIbuAction(formData: FormData) {
  await checkKaderAuth();
  const rawData = Object.fromEntries(formData.entries());
  const id = rawData.id as string; // Pastikan ID dikirim dari form

  const { error } = await supabase.from("profiles")
    .update({
        nik: rawData.nik,
        nama_lengkap: rawData.nama,
        // field lain
    })
    .eq("id", id); // atau eq("nik", rawData.nik) jika id tidak ada

  if (error) return { error: error.message };
  revalidatePath("/kader/data-ibu");
  return { success: true };
}

export async function deleteIbuAction(id: string) {
  await checkKaderAuth();
  const { error } = await supabase.from("profiles").delete().eq("id", id); // Hati-hati menghapus profile user
  if (error) return { error: error.message };
  revalidatePath("/kader/data-ibu");
  return { success: true };
}

// --- 2. MANAJEMEN DATA ANAK ---

export async function createAnakAction(formData: FormData) {
  await checkKaderAuth();
  const rawData = Object.fromEntries(formData.entries());

  const { error } = await supabase.from("anak").insert({
    nik: rawData.nik,
    nama_lengkap: rawData.nama,
    jenis_kelamin: rawData.jk,
    tanggal_lahir: rawData.tgl_lahir,
    nama_ibu: rawData.nama_ibu,
    // field lain
  });

  if (error) return { error: error.message };
  revalidatePath("/kader/data-anak");
  return { success: true };
}

export async function updateAnakAction(formData: FormData) {
  await checkKaderAuth();
  const rawData = Object.fromEntries(formData.entries());
  const id = rawData.id as string;

  const { error } = await supabase.from("anak").update({
    nik: rawData.nik,
    nama_lengkap: rawData.nama,
    jenis_kelamin: rawData.jk,
    // update field lain
  }).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/kader/data-anak");
  return { success: true };
}

export async function deleteAnakAction(id: string) {
  await checkKaderAuth();
  const { error } = await supabase.from("anak").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/kader/data-anak");
  return { success: true };
}

// --- 3. JADWAL POSYANDU ---

export async function createJadwalAction(formData: FormData) {
  await checkKaderAuth();
  const rawData = Object.fromEntries(formData.entries());

  const { error } = await supabase.from("jadwal_posyandu").insert({
    nama_kader: rawData.kader,
    tanggal: rawData.tanggal,
    nama_bidan: rawData.bidan,
    kegiatan: rawData.kegiatan,
    kontak: rawData.kontak
  });

  if (error) return { error: error.message };
  revalidatePath("/kader/jadwal");
  return { success: true };
}

export async function updateJadwalAction(formData: FormData) {
    await checkKaderAuth();
    const rawData = Object.fromEntries(formData.entries());
    const id = rawData.id as string; // Butuh ID jadwal

    const { error } = await supabase.from("jadwal_posyandu").update({
        nama_kader: rawData.kader,
        tanggal: rawData.tanggal,
        nama_bidan: rawData.bidan,
        kegiatan: rawData.kegiatan,
        kontak: rawData.kontak
    }).eq("id", id);

    if (error) return { error: error.message };
    revalidatePath("/kader/jadwal");
    return { success: true };
}

// --- 4. PEMERIKSAAN IBU (ANC) ---

export async function createPemeriksaanIbuAction(formData: FormData) {
    await checkKaderAuth();
    const rawData = Object.fromEntries(formData.entries());

    const { error } = await supabase.from("pemeriksaan_ibu").insert({
        // ibu_id: rawData.ibu_id, // Pastikan ID ibu dikirim (hidden input)
        tanggal_periksa: rawData.tanggal,
        usia_kandungan: rawData.usia_kandungan,
        bb: rawData.bb,
        tensi: rawData.tensi,
        tfu: rawData.tfu,
        djj: rawData.djj,
        lila: rawData.lila,
        catatan: rawData.catatan,
        // Handle checkbox (perlu logic khusus di client untuk gabung array)
    });

    if (error) return { error: error.message };
    revalidatePath("/kader/data-ibu/[id]"); // Revalidate halaman detail
    return { success: true };
}

// --- 5. PEMERIKSAAN ANAK ---

export async function createPemeriksaanAnakAction(formData: FormData) {
    await checkKaderAuth();
    const rawData = Object.fromEntries(formData.entries());

    const { error } = await supabase.from("pemeriksaan_anak").insert({
        // anak_id: rawData.anak_id, // Pastikan ID anak dikirim
        tanggal_periksa: rawData.tanggal,
        usia_bulan: rawData.usia,
        bb: rawData.bb,
        tb: rawData.tb,
        lk: rawData.lk,
        lila: rawData.lila,
        asi_eksklusif: rawData.asi,
        vitamin_a: rawData.vit_a,
        // Handle checkbox imunisasi
    });

    if (error) return { error: error.message };
    revalidatePath("/kader/data-anak/[id]");
    return { success: true };
}