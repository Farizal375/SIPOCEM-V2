"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// --- 1. CREATE ACCOUNT ---
export async function createAccountAction(formData: FormData) {
  const { sessionClaims } = await auth();
  if ((sessionClaims?.metadata as any)?.role !== "admin") {
    return { error: "Akses ditolak. Hanya Admin yang boleh." };
  }

  // Ambil data
  const nik = formData.get("nik") as string;
  const nama = formData.get("nama") as string;
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const no_hp = formData.get("no_hp") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const status = formData.get("status") as string;

  try {
    const client = await clerkClient();

    // A. Buat User di Clerk
    const user = await client.users.createUser({
      username: username,
      emailAddress: [email],
      password: password,
      firstName: nama,
      publicMetadata: { role: role, status: status },
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
    });

    // B. Simpan ke Supabase
    const { error: dbError } = await supabase.from("profiles").insert({
      id: user.id,
      nik: nik,
      nama_lengkap: nama,
      username: username,
      email: email,
      no_telepon: no_hp,
      role: role,
      status: status,
    });

    if (dbError) {
        // Rollback: Jika DB gagal, hapus user Clerk agar tidak numpuk
        await client.users.deleteUser(user.id);
        console.error("Database Error:", dbError.message); // Log teknis untuk Developer
        
        // Return pesan user friendly
        return { error: "Gagal menyimpan data ke database. Silakan coba lagi." };
    }

    revalidatePath("/admin/manajemen-akun");
    return { success: true };

  } catch (error: any) {
    console.error("Create User Error:", error); // Log teknis

    // Handle error spesifik agar pesan lebih jelas
    if (error.errors?.[0]?.code === "form_identifier_exists") {
        return { error: "Username atau Email sudah digunakan oleh orang lain." };
    }
    if (error.errors?.[0]?.code === "form_password_length_too_short") {
        return { error: "Password terlalu pendek (min 8 karakter)." };
    }
    if (error.message?.includes("schema cache")) {
        return { error: "Terjadi kesalahan sinkronisasi sistem. Mohon refresh halaman." };
    }

    // Default error
    return { error: "Gagal membuat akun. Pastikan data sudah benar." };
  }
}

// ... (Biarkan fungsi updateAccountAction dan deleteAccountAction seperti sebelumnya, 
// tapi Anda bisa menerapkan pola catch (error) yang sama agar user friendly)
// Contoh untuk Delete:

export async function deleteAccountAction(userId: string) {
  const { sessionClaims } = await auth();
  if ((sessionClaims?.metadata as any)?.role !== "admin") return { error: "Unauthorized" };

  try {
    const client = await clerkClient();
    await client.users.deleteUser(userId);
    await supabase.from("profiles").delete().eq("id", userId);

    revalidatePath("/admin/manajemen-akun");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Error:", error);
    return { error: "Gagal menghapus akun. Silakan coba lagi." };
  }
}

// Update juga untuk updateAccountAction dengan pola yang sama...
export async function updateAccountAction(formData: FormData) {
    // ... (kode otorisasi sama) ...
    const { sessionClaims } = await auth();
    if ((sessionClaims?.metadata as any)?.role !== "admin") return { error: "Unauthorized" };
  
    const id = formData.get("id") as string;
    const nik = formData.get("nik") as string;
    const nama = formData.get("nama") as string;
    const username = formData.get("username") as string;
    const no_hp = formData.get("no_hp") as string;
    const role = formData.get("role") as string;
    const status = formData.get("status") as string;
    const password = formData.get("password") as string;
  
    try {
      const client = await clerkClient();
  
      const updateParams: any = {
        username: username,
        firstName: nama,
        publicMetadata: { role: role, status: status },
      };
  
      if (password && password.trim() !== "") {
          updateParams.password = password;
      }
  
      await client.users.updateUser(id, updateParams);
  
      const { error: dbError } = await supabase
        .from("profiles")
        .update({
          nik: nik,
          nama_lengkap: nama,
          username: username,
          no_telepon: no_hp,
          role: role,
          status: status
        })
        .eq("id", id);
  
      if (dbError) throw new Error(dbError.message);
  
      revalidatePath("/admin/manajemen-akun");
      return { success: true };
    } catch (error: any) {
      console.error("Update Error:", error);
      if (error.errors?.[0]?.code === "form_identifier_exists") {
         return { error: "Username sudah dipakai user lain." };
      }
      return { error: "Gagal memperbarui data akun." };
    }
  }