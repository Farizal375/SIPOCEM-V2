import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckSquare, Trash2 } from "lucide-react";

export const revalidate = 0;

export default async function PusatNotifikasiPage() {
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*, profiles(nama_lengkap)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1abc9c]">Pusat Notifikasi</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-gray-600 font-medium mb-4">Daftar Notifikasi</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#d4e157] text-black uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">No</th>
                <th className="px-4 py-3">Nama Pelapor</th>
                <th className="px-4 py-3">Jenis Notifikasi</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Ringkasan</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {notifications?.map((notif, index) => (
                <tr key={notif.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{(notif.profiles as any)?.nama_lengkap || "Sistem"}</td>
                  <td className="px-4 py-3">{notif.jenis}</td>
                  <td className="px-4 py-3">
                    {new Date(notif.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate">{notif.ringkasan}</td>
                  <td className="px-4 py-3">
                    <Badge variant={notif.status === "Selesai" ? "default" : "secondary"} className={notif.status === "Selesai" ? "bg-green-500" : "bg-yellow-500 text-black"}>
                        {notif.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 text-blue-500 border-blue-200 bg-blue-50">
                            <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-green-500 border-green-200 bg-green-50">
                            <CheckSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 border-red-200 bg-red-50">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
               {(!notifications || notifications.length === 0) && (
                  <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-500">Tidak ada notifikasi baru.</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}