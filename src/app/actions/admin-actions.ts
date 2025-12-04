"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Inisialisasi Supabase dengan SERVICE ROLE KEY (Bypass RLS)
// HANYA GUNAKAN DI SERVER ACTION! JANGAN DI EXPOSE KE CLIENT!
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

/**
 * Helper untuk mengecek apakah requester adalah Admin
 */
async function checkAdminAuth() {
  const { userId, sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;

  if (!userId || role !== "admin") {
    throw new Error("Unauthorized: Hanya Admin yang dapat melakukan aksi ini.");
  }
  return userId;
}

/**
 * CREATE ACCOUNT (Admin membuat akun Kader/Admin/User)
 */
export async function createAccountAction(formData: FormData) {
  try {
    await checkAdminAuth();

    const nik = formData.get("nik") as string;
    const nama = formData.get("nama") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const no_hp = formData.get("no_hp") as string;
    const password = formData.get("password") as string;
    const role = formData.get("role") as string; // 'admin', 'kader', 'user'
    const status = formData.get("status") as string;

    // 1. Buat User di Clerk
    const client = await clerkClient();
    const user = await client.users.createUser({
      username,
      emailAddress: [email],
      password,
      firstName: nama,
      publicMetadata: { role, status }, // Simpan role di metadata agar terbaca middleware
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
    });

    // 2. Simpan Data Lengkap ke Supabase (Tabel Profiles)
    const { error: dbError } = await supabaseAdmin.from("profiles").insert({
      id: user.id, // Penting: ID harus sama dengan Clerk ID
      nik,
      nama_lengkap: nama,
      email,
      no_telepon: no_hp,
      role,
      status,
      // Set default kosong untuk field spesifik user agar tidak null
      alamat: "",
    });

    if (dbError) {
      // Rollback: Hapus user Clerk jika DB gagal agar konsisten
      await client.users.deleteUser(user.id);
      console.error("Supabase Error:", dbError);
      return { error: "Gagal menyimpan data ke database: " + dbError.message };
    }

    revalidatePath("/admin/manajemen-akun");
    return { success: true, message: "Akun berhasil dibuat." };

  } catch (error: any) {
    console.error("Create Account Error:", error);
    // Handle Clerk Errors
    if (error.errors?.[0]?.code === "form_identifier_exists") {
      return { error: "Username atau Email sudah terdaftar." };
    }
    if (error.errors?.[0]?.code === "form_password_length_too_short") {
      return { error: "Password minimal 8 karakter." };
    }
    return { error: error.message || "Terjadi kesalahan sistem." };
  }
}

/**
 * UPDATE ACCOUNT
 */
export async function updateAccountAction(formData: FormData) {
  try {
    await checkAdminAuth();

    const id = formData.get("id") as string;
    const nik = formData.get("nik") as string;
    const nama = formData.get("nama") as string;
    const username = formData.get("username") as string;
    const no_hp = formData.get("no_hp") as string;
    const role = formData.get("role") as string;
    const status = formData.get("status") as string;
    const password = formData.get("password") as string;

    const client = await clerkClient();

    // 1. Update Data di Clerk
    const updateParams: any = {
      username,
      firstName: nama,
      publicMetadata: { role, status },
    };

    if (password && password.trim().length >= 8) {
      updateParams.password = password;
    }

    await client.users.updateUser(id, updateParams);

    // 2. Update Data di Supabase
    const { error: dbError } = await supabaseAdmin
      .from("profiles")
      .update({
        nik,
        nama_lengkap: nama,
        no_telepon: no_hp,
        role,
        status
      })
      .eq("id", id);

    if (dbError) throw new Error(dbError.message);

    revalidatePath("/admin/manajemen-akun");
    return { success: true, message: "Data akun diperbarui." };

  } catch (error: any) {
    console.error("Update Error:", error);
    return { error: error.message || "Gagal memperbarui akun." };
  }
}

/**
 * DELETE ACCOUNT
 */
export async function deleteAccountAction(userId: string) {
  try {
    await checkAdminAuth();

    const client = await clerkClient();

    // 1. Hapus dari Clerk
    await client.users.deleteUser(userId);

    // 2. Hapus dari Supabase (Sebenarnya otomatis jika user dihapus di Clerk tidak trigger delete supabase
    // kecuali pakai webhook, jadi kita hapus manual biar bersih)
    const { error } = await supabaseAdmin.from("profiles").delete().eq("id", userId);
    
    if (error) throw new Error(error.message);

    revalidatePath("/admin/manajemen-akun");
    return { success: true, message: "Akun berhasil dihapus permanen." };

  } catch (error: any) {
    console.error("Delete Error:", error);
    return { error: "Gagal menghapus akun. Pastikan user valid." };
  }
}

/**
 * VALIDASI AKUN USER (Khusus untuk Kader/Admin memvalidasi pendaftaran user baru)
 */
export async function validateUserAction(userId: string, isValid: boolean) {
  try {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role;

    if (role !== "admin" && role !== "kader") {
       return { error: "Unauthorized" };
    }

    const status = isValid ? "Aktif" : "Ditolak";

    // Update Clerk Metadata
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: { status: status }
    });

    // Update Supabase
    await supabaseAdmin.from("profiles").update({ status }).eq("id", userId);

    revalidatePath("/kader/dashboard"); // Atau path yang relevan
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}