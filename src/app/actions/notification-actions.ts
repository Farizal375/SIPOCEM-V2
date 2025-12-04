"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

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

export async function deleteNotification(id: string) {
  try {
    const { error } = await supabaseAdmin.from("notifications").delete().eq("id", id);
    if (error) throw error;
    
    revalidatePath("/admin/pusat-notifikasi"); // Refresh halaman notifikasi
    revalidatePath("/admin/dashboard");        // Refresh counter di dashboard
    return { success: true, message: "Notifikasi dihapus." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateNotificationStatus(id: string, status: string) {
  try {
    const { error } = await supabaseAdmin
      .from("notifications")
      .update({ status: status, is_read: true }) // Set status & tandai sudah dibaca
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/pusat-notifikasi");
    revalidatePath("/admin/dashboard");
    return { success: true, message: `Status diubah menjadi ${status}.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}