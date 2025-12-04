"use client";

import { Button } from "@/components/ui/button";
import { Trash2, CheckSquare, Eye, Key } from "lucide-react";
import { deleteNotification, updateNotificationStatus } from "@/app/actions/notification-actions";
import { toast } from "sonner";
import { useState } from "react";

export function NotificationActionButtons({ id, status }: { id: string, status: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Hapus notifikasi ini?")) return;
    setLoading(true);
    const res = await deleteNotification(id);
    setLoading(false);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  };

  const handleStatus = async (newStatus: string) => {
    setLoading(true);
    const res = await updateNotificationStatus(id, newStatus);
    setLoading(false);
    if (res.success) toast.success(res.message);
    else toast.error(res.message);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {/* Tombol 1: Key (Kuning/Orange) - Misal untuk Reset Password/Akses */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 bg-orange-100 text-orange-600 hover:bg-orange-200 border border-orange-200"
        title="Proses Akses"
      >
        <Key className="w-4 h-4" />
      </Button>

      {/* Tombol 2: Eye (Hijau) - Lihat Detail */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border border-emerald-200"
        title="Lihat Detail"
      >
        <Eye className="w-4 h-4" />
      </Button>

      {/* Tombol 3: Trash (Merah) - Hapus */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleDelete}
        disabled={loading}
        className="h-8 w-8 bg-red-100 text-red-600 hover:bg-red-200 border border-red-200"
        title="Hapus"
      >
        <Trash2 className="w-4 h-4" />
      </Button>

      {/* Tombol 4: Check (Biru) - Tandai Selesai */}
      {status !== "Selesai" && (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleStatus("Selesai")}
            disabled={loading}
            className="h-8 w-8 bg-blue-100 text-blue-600 hover:bg-blue-200 border border-blue-200"
            title="Tandai Selesai"
        >
            <CheckSquare className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}