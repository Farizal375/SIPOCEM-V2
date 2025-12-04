"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Helper: Cek Izin Admin
async function checkAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as any)?.role;
  if (role !== "admin") {
    throw new Error("Unauthorized: Hanya Admin yang boleh akses.");
  }
}

// 1. CREATE ACCOUNT (Menangani Sinkronisasi Otomatis)
export async function createAccountAction(formData: FormData) {
  try {
    await checkAdmin();
    const client = await clerkClient();
    const supabase = await createSupabaseServerClient();

    const rawData = {
      nik: formData.get("nik") as string,
      nama: formData.get("nama") as string,
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      role: formData.get("role") as string,
      no_hp: formData.get("no_hp") as string,
      status: formData.get("status") as string,
    };

    let userId = "";
    let isNewUser = true;

    // A. Cek apakah user sudah ada di Clerk (berdasarkan Email atau Username)
    try {
      const existingUsers = await client.users.getUserList({
        emailAddress: [rawData.email],
        limit: 1,
      });

      if (existingUsers.data.length > 0) {
        // User sudah ada di Clerk, kita gunakan ID-nya untuk sinkronisasi ke DB
        userId = existingUsers.data[0].id;
        isNewUser = false;
        
        // Update metadata user yang sudah ada agar sesuai form baru
        await client.users.updateUser(userId, {
          username: rawData.username,
          firstName: rawData.nama,
          publicMetadata: { role: rawData.role, status: rawData.status },
        });
      } else {
        // User belum ada, buat baru
        const user = await client.users.createUser({
          username: rawData.username,
          emailAddress: [rawData.email],
          password: rawData.password,
          firstName: rawData.nama,
          publicMetadata: { role: rawData.role, status: rawData.status },
          skipPasswordChecks: true,
          skipPasswordRequirement: true,
        });
        userId = user.id;
      }
    } catch (clerkError: any) {
      // Tangani error spesifik Clerk (misal username taken tapi email beda)
      return { error: `Clerk Error: ${clerkError.errors?.[0]?.message || clerkError.message}` };
    }

    // B. Simpan/Upsert Profile di Supabase (DB)
    // Menggunakan 'upsert' agar jika ID sudah ada, data diperbarui. Jika belum, dibuat baru.
    const { error: dbError } = await supabase.from("profiles").upsert({
      id: userId,
      nik: rawData.nik,
      nama_lengkap: rawData.nama,
      username: rawData.username,
      email: rawData.email,
      no_telepon: rawData.no_hp,
      role: rawData.role,
      status: rawData.status
    });

    if (dbError) {
      // Jika user baru dibuat tapi DB gagal, hapus dari Clerk agar bersih (rollback)
      if (isNewUser) {
        await client.users.deleteUser(userId);
      }
      return { error: "DB Error: " + dbError.message };
    }

    revalidatePath("/admin/manajemen-akun");
    return { success: true };

  } catch (error: any) {
    return { error: error.message };
  }
}

// 2. UPDATE ACCOUNT
export async function updateAccountAction(formData: FormData) {
  try {
    await checkAdmin();
    const client = await clerkClient();
    const supabase = await createSupabaseServerClient();

    const id = formData.get("id") as string;
    const rawData = {
      nik: formData.get("nik") as string,
      nama: formData.get("nama") as string,
      username: formData.get("username") as string,
      no_hp: formData.get("no_hp") as string,
      role: formData.get("role") as string,
      status: formData.get("status") as string,
      password: formData.get("password") as string,
    };

    // A. Update Clerk
    const updateParams: any = {
      username: rawData.username,
      firstName: rawData.nama,
      publicMetadata: { role: rawData.role, status: rawData.status },
    };
    if (rawData.password && rawData.password.trim() !== "") {
        updateParams.password = rawData.password;
    }
    
    try {
      await client.users.updateUser(id, updateParams);
    } catch (clerkError: any) {
       console.error("Clerk Update Error (Non-fatal):", clerkError);
       // Lanjut ke DB update meskipun Clerk gagal update (misal password policy)
    }

    // B. Update Supabase
    const { error } = await supabase.from("profiles").update({
      nik: rawData.nik,
      nama_lengkap: rawData.nama,
      username: rawData.username,
      no_telepon: rawData.no_hp,
      role: rawData.role,
      status: rawData.status
    }).eq("id", id);

    if (error) return { error: error.message };

    revalidatePath("/admin/manajemen-akun");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

// 3. DELETE ACCOUNT
export async function deleteAccountAction(userId: string) {
  try {
    await checkAdmin();
    const client = await clerkClient();
    const supabase = await createSupabaseServerClient();

    // Hapus di Clerk (Coba dulu)
    try {
      await client.users.deleteUser(userId);
    } catch (e) {
      console.log("User mungkin sudah terhapus di Clerk, lanjut hapus DB...");
    }
    
    // Hapus di Supabase
    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) return { error: error.message };

    revalidatePath("/admin/manajemen-akun");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}