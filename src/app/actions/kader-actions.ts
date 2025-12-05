"use server";

import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

// --- HELPER: LOG NOTIFIKASI KE ADMIN ---
async function logToAdmin(userId: string, jenis: string, ringkasan: string) {
  const supabase = await createSupabaseServerClient();
  try {
    await supabase.from("notifications").insert({
      user_id: userId,
      jenis: jenis,
      ringkasan: ringkasan,
      status: "Unread"
    });
  } catch (error) {
    console.error("Gagal kirim notifikasi admin:", error);
  }
}

// --- HELPER: CEK AKSES ---
async function checkKader() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;
  if (role !== "kader" && role !== "admin") {
    throw new Error("Unauthorized: Akses Kader Diperlukan.");
  }
}

async function getUserId() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// ==========================================
// 1. MANAJEMEN DATA IBU (PROFILES)
// ==========================================

export async function createIbuAction(formData: FormData) {
  try {
    await checkKader();
    const userId = await getUserId();
    const supabase = await createSupabaseServerClient();
    
    const nik = formData.get("nik") as string;
    const nama = formData.get("nama") as string;
    
    // ID Manual agar sesuai format TEXT di tabel profiles
    const manualId = `manual_${nik}`; 

    const data = {
      id: manualId,
      email: `${nik}@posyandu.local`, // Dummy email
      nik: nik,
      nama_lengkap: nama,
      tanggal_lahir: formData.get("tgl_lahir") as string,
      alamat: formData.get("lokasi") as string,
      no_telepon: formData.get("telepon") as string,
      role: 'user',
      status: 'Aktif'
    };

    const { error } = await supabase.from("profiles").insert(data);
    if (error) throw new Error(error.message);

    await logToAdmin(userId, "Input Data", `Menambah Ibu Hamil: ${nama}`);
    
    revalidatePath("/kader/data-ibu");
    return { success: true, message: "Data Ibu berhasil disimpan" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

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
      no_telepon: formData.get("telepon") as string,
    };

    const { error } = await supabase.from("profiles").update(data).eq("id", id);
    if (error) throw new Error(error.message);
    
    revalidatePath("/kader/data-ibu");
    return { success: true, message: "Data Ibu diperbarui" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteIbuAction(id: string) {
  try {
    await checkKader();
    const userId = await getUserId();
    const supabase = await createSupabaseServerClient();
    
    const { data: old } = await supabase.from("profiles").select("nama_lengkap").eq("id", id).single();

    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await logToAdmin(userId, "Hapus Data", `Menghapus data Ibu: ${old?.nama_lengkap || id}`);

    revalidatePath("/kader/data-ibu");
    return { success: true, message: "Data Ibu dihapus" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 2. MANAJEMEN DATA ANAK
// ==========================================

export async function createAnakAction(formData: FormData) {
  try {
    await checkKader();
    const userId = await getUserId();
    const supabase = await createSupabaseServerClient();

    const namaAnak = formData.get("nama") as string;
    const ibuId = formData.get("ibu_id") as string;

    // VALIDASI: Pastikan Ibu dipilih
    if (!ibuId || ibuId === "null") {
        throw new Error("Data Ibu (Orang Tua) wajib dipilih.");
    }

    const data = {
      profile_id: ibuId, // Relasi ke tabel profiles (TEXT)
      nik: formData.get("nik") as string,
      nama_lengkap: namaAnak,
      jenis_kelamin: formData.get("jk") as string,
      tempat_lahir: formData.get("tempat_lahir") as string,
      tanggal_lahir: formData.get("tgl_lahir") as string,
      nama_ayah: formData.get("nama_ayah") as string,
    };

    const { error } = await supabase.from("data_anak").insert(data);
    if (error) throw new Error(error.message);

    await logToAdmin(userId, "Input Data", `Menambah Anak: ${namaAnak}`);

    revalidatePath("/kader/data-anak");
    return { success: true, message: "Data Anak berhasil disimpan" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateAnakAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    const id = formData.get("id") as string;
    const ibuId = formData.get("ibu_id") as string;

    const data = {
      profile_id: ibuId,
      nik: formData.get("nik") as string,
      nama_lengkap: formData.get("nama") as string,
      jenis_kelamin: formData.get("jk") as string,
      tempat_lahir: formData.get("tempat_lahir") as string,
      tanggal_lahir: formData.get("tgl_lahir") as string,
      nama_ayah: formData.get("nama_ayah") as string,
    };

    const { error } = await supabase.from("data_anak").update(data).eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath("/kader/data-anak");
    return { success: true, message: "Data Anak diperbarui" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deleteAnakAction(id: string) {
  try {
    await checkKader();
    const userId = await getUserId();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("data_anak").delete().eq("id", id);
    if (error) throw new Error(error.message);

    await logToAdmin(userId, "Hapus Data", `Menghapus data Anak ID: ${id}`);

    revalidatePath("/kader/data-anak");
    return { success: true, message: "Data Anak dihapus" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 3. PEMERIKSAAN IBU (ANC)
// ==========================================

export async function createPemeriksaanIbuAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    const ibuId = formData.get("ibu_id") as string;

    // Pastikan ID Ibu valid
    if (!ibuId || ibuId === "undefined") throw new Error("ID Ibu tidak valid.");

    const data = {
      profile_id: ibuId,
      tgl_kunjungan: formData.get("tanggal") as string,
      usia_kehamilan: Number(formData.get("usia_kandungan") || 0),
      berat_badan: Number(formData.get("bb") || 0),
      tekanan_darah: formData.get("tensi") as string,
      tfu: Number(formData.get("tfu") || 0),
      djj: Number(formData.get("djj") || 0),
      lila: Number(formData.get("lila") || 0),
      catatan_kader: (formData.get("catatan") as string) || "",
    };

    const { error } = await supabase.from("pemeriksaan_ibu").insert(data);
    if (error) throw new Error(error.message);

    revalidatePath(`/kader/data-ibu/${ibuId}`);
    return { success: true, message: "Pemeriksaan Ibu berhasil dicatat" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function deletePemeriksaanIbuAction(id: string, ibuId: string) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from("pemeriksaan_ibu").delete().eq("id", id);
    if (error) throw new Error(error.message);

    revalidatePath(`/kader/data-ibu/${ibuId}`);
    return { success: true, message: "Riwayat pemeriksaan dihapus" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 4. PEMERIKSAAN ANAK
// ==========================================

export async function createPemeriksaanAnakAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    const anakId = formData.get("anak_id") as string;

    // VALIDASI: Cegah ID Null
    if (!anakId || anakId === "undefined") {
        throw new Error("ID Anak tidak ditemukan. Pastikan data anak sudah tersimpan.");
    }

    const data = {
      anak_id: anakId, // Kolom ini bertipe UUID di DB
      tgl_kunjungan: formData.get("tanggal") as string,
      usia_bulan: Number(formData.get("usia") || 0),
      berat_badan: Number(formData.get("bb") || 0),
      panjang_badan: Number(formData.get("tb") || 0),
      lingkar_kepala: Number(formData.get("lk") || 0),
      lila: Number(formData.get("lila") || 0),
      vit_a: formData.get("vit_a") ? "Merah" : "Tidak",
      catatan_kader: (formData.get("catatan") as string) || "",
    };

    const { error } = await supabase.from("pemeriksaan_anak").insert(data);
    
    if (error) {
        // Handle error UUID invalid secara spesifik
        if (error.code === '22P02') throw new Error("Format ID Anak salah (Bukan UUID).");
        throw new Error(error.message);
    }

    revalidatePath(`/kader/data-anak/${anakId}`);
    return { success: true, message: "Pertumbuhan anak dicatat" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 5. JADWAL POSYANDU
// ==========================================

export async function createJadwalAction(formData: FormData) {
  try {
    await checkKader();
    const userId = await getUserId();
    const supabase = await createSupabaseServerClient();

    const data = {
      tanggal: formData.get("tanggal") as string,
      kegiatan: formData.get("kegiatan") as string,
      lokasi: "Posyandu Cempaka",
      keterangan: `Kader: ${formData.get("kader")}, Bidan: ${formData.get("bidan")}`,
      created_by: userId
    };

    const { error } = await supabase.from("jadwal_posyandu").insert(data);
    if (error) throw new Error(error.message);

    await logToAdmin(userId, "Jadwal", `Jadwal baru: ${data.kegiatan}`);

    revalidatePath("/kader/jadwal");
    return { success: true, message: "Jadwal berhasil dibuat" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function updateJadwalAction(formData: FormData) {
  try {
    await checkKader();
    const supabase = await createSupabaseServerClient();
    const id = formData.get("id") as string;
  
    const data = {
      tanggal: formData.get("tanggal") as string,
      kegiatan: formData.get("kegiatan") as string,
      keterangan: `Kader: ${formData.get("kader")}, Bidan: ${formData.get("bidan")}`,
    };
  
    const { error } = await supabase.from("jadwal_posyandu").update(data).eq("id", id);
    if (error) throw new Error(error.message);
  
    revalidatePath("/kader/jadwal");
    return { success: true, message: "Jadwal diperbarui" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// ==========================================
// 6. LAPORAN KENDALA (User/Kader -> Admin)
// ==========================================

export async function createLaporanAction(formData: FormData) {
  try {
    const userId = await getUserId(); 
    const supabase = await createSupabaseServerClient();

    const judul = formData.get("judul") as string;
    const deskripsi = formData.get("deskripsi") as string;

    // Insert ke tabel laporan
    const { error } = await supabase.from("laporan_kendala").insert({
      pelapor_id: userId,
      judul: judul,
      deskripsi: deskripsi,
      status: "Pending"
    });

    if (error) throw new Error(error.message);

    // Insert juga ke tabel notifikasi admin
    await logToAdmin(userId, "Laporan", `Kendala: ${judul}`);

    revalidatePath("/admin/pusat-notifikasi");
    return { success: true, message: "Laporan terkirim ke Admin" };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}