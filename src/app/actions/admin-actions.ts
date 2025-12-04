"use server";

import { createClient } from "@supabase/supabase-js";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// --- KONFIGURASI CLIENT (TIDAK BERUBAH) ---
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

// --- HELPER: PENERJEMAH ERROR (TIDAK BERUBAH) ---
function getFriendlyErrorMessage(error: any): string {
  // 1. Cek Error Database (Supabase/Postgres)
  if (error?.code) {
    switch (error.code) {
      case "23505": // Unique Violation (Data Ganda)
        if (error.message?.includes("nik"))
          return "Gagal: NIK tersebut sudah terdaftar di sistem. Mohon periksa kembali.";
        if (error.message?.includes("username"))
          return "Gagal: Username sudah dipakai orang lain. Pilih username lain.";
        if (error.message?.includes("email"))
          return "Gagal: Email sudah terdaftar.";
        if (error.message?.includes("no_telepon"))
          return "Gagal: Nomor telepon sudah terdaftar.";
        return "Gagal: Data duplikat ditemukan.";
      
      case "23503": // Foreign Key Violation
        return "Gagal: Akun tidak dapat dihapus karena masih memiliki data terkait (misal: Data Anak/Pemeriksaan).";
      
      case "42703": // Column Not Found
        return "Kesalahan Sistem: Kolom database tidak ditemukan. Hubungi developer.";
        
      default:
        return `Kesalahan Database: ${error.message}`;
    }
  }

  // 2. Cek Error Clerk (Auth)
  if (error?.errors && Array.isArray(error.errors)) {
    const clerkMsg = error.errors[0]?.message;
    if (clerkMsg?.includes("email address is taken"))
      return "Gagal: Email ini sudah digunakan pada akun lain (Clerk).";
    if (clerkMsg?.includes("username"))
      return "Gagal: Username tidak valid atau sudah digunakan.";
    if (clerkMsg?.includes("password"))
      return "Gagal: Password terlalu lemah atau tidak sesuai aturan.";
    return `Kesalahan Akun: ${clerkMsg}`;
  }

  // 3. Error Umum
  return error.message || "Terjadi kesalahan yang tidak diketahui.";
}

// --- READ ALL USERS (TIDAK BERUBAH) ---
export async function getAllUsers() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return [];
  }

  return data.map((user) => ({
    id: user.id,
    nik: user.nik || "-",
    nama_lengkap: user.nama_lengkap,
    username: user.username,
    no_telepon: user.no_telepon || "-",
    role: user.role,
    status: user.status,
    email: user.email, // Pastikan email ikut dikirim ke UI
    created_at: user.created_at,
  }));
}

// --- CREATE USER (TIDAK BERUBAH) ---
export async function createFullUser(formData: FormData) {
  const client = await clerkClient();

  const nama = formData.get("nama") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const nik = formData.get("nik") as string;
  const telepon = formData.get("telepon") as string;
  const username = formData.get("username") as string;

  try {
    // 1. Clerk Create
    const clerkUser = await client.users.createUser({
      username,
      emailAddress: [email],
      password,
      firstName: nama,
      publicMetadata: { role, status: "Aktif" },
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
    });

    // 2. Supabase Insert
    const { error: dbError } = await supabaseAdmin.from("profiles").insert({
      id: clerkUser.id,
      nik,
      nama_lengkap: nama,
      username,
      email,
      no_telepon: telepon,
      role,
      status: "Aktif",
    });

    if (dbError) {
      await client.users.deleteUser(clerkUser.id);
      throw dbError;
    }

    revalidatePath("/admin/manajemen-akun");
    return { success: true, message: "Akun berhasil dibuat!" };

  } catch (err: any) {
    console.error("Create Error:", err);
    return { success: false, message: getFriendlyErrorMessage(err) };
  }
}

// --- UPDATE USER (DIPERBARUI: LOGIKA EMAIL, USERNAME, ROLE) ---
export async function updateUserProfile(formData: FormData) {
  const client = await clerkClient();

  // Ambil semua data input
  const id = formData.get("id") as string;
  const nama = formData.get("nama") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const telepon = formData.get("telepon") as string;
  const nik = formData.get("nik") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;

  try {
    // 1. Update ke Clerk (Auth)
    // Kita update username, nama, dan metadata (role/status)
    const clerkUpdateData: any = {
      username: username,
      firstName: nama,
      publicMetadata: { role, status },
    };

    // Hanya update password jika user mengisinya
    if (password && password.trim() !== "") {
      clerkUpdateData.password = password;
    }

    // Eksekusi update Clerk
    await client.users.updateUser(id, clerkUpdateData);

    // 2. Update ke Supabase (Database)
    // Kita update SEMUA field agar sinkron dengan input admin
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        nama_lengkap: nama,
        username: username, // Update username
        email: email,       // Update email di data profil
        no_telepon: telepon,
        nik: nik,
        role: role,         // Update role
        status: status,
      })
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/manajemen-akun");
    return { success: true, message: "Data berhasil diperbarui!" };

  } catch (err: any) {
    // Error akan otomatis diterjemahkan oleh helper kita
    return { success: false, message: getFriendlyErrorMessage(err) };
  }
}

// --- DELETE USER (TIDAK BERUBAH) ---
export async function deleteFullUser(id: string) {
  const client = await clerkClient();

  try {
    await client.users.deleteUser(id);
    
    const { error } = await supabaseAdmin.from("profiles").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/admin/manajemen-akun");
    return { success: true, message: "Akun berhasil dihapus." };

  } catch (err: any) {
    return { success: false, message: getFriendlyErrorMessage(err) };
  }
}