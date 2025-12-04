"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

// Helper: Cek Izin Admin
async function checkAdmin() {
  const { sessionClaims } = await auth();
  if ((sessionClaims?.metadata as any)?.role !== "admin") {
    throw new Error("Unauthorized: Hanya Admin yang boleh akses.");
  }
}

// 1. CREATE ACCOUNT (Admin bisa buat akun User/Kader/Admin)
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

    // A. Buat User di Clerk (Auth)
    const user = await client.users.createUser({
      username: rawData.username,
      emailAddress: [rawData.email],
      password: rawData.password,
      firstName: rawData.nama,
      publicMetadata: { role: rawData.role, status: rawData.status },
      skipPasswordChecks: true,
      skipPasswordRequirement: true,
    });

    // B. Simpan Profile di Supabase (DB)
    const { error: dbError } = await supabase.from("profiles").insert({
      id: user.id, // ID harus sama!
      nik: rawData.nik,
      nama_lengkap: rawData.nama,
      username: rawData.username,
      email: rawData.email,
      no_telepon: rawData.no_hp,
      role: rawData.role,
      status: rawData.status
    });

    if (dbError) {
      await client.users.deleteUser(user.id); // Rollback Clerk jika DB gagal
      return { error: "DB Error: " + dbError.message };
    }

    revalidatePath("/admin/manajemen-akun");
    return { success: true };

  } catch (error: any) {
    return { error: error.errors?.[0]?.message || error.message };
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
    await client.users.updateUser(id, updateParams);

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
    // Delete di Clerk (Supabase akan auto delete jika ada trigger, atau delete manual)
    await client.users.deleteUser(userId);
    
    // Manual delete Supabase (karena RLS on delete cascade biasanya dari parent)
    const supabase = await createSupabaseServerClient();
    await supabase.from("profiles").delete().eq("id", userId);

    revalidatePath("/admin/manajemen-akun");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}