import { supabase } from "@/lib/supabase";
import { NotificationActionButtons } from "@/components/admin/notification-actions";

export const revalidate = 0; // Pastikan data selalu real-time

export default async function PusatNotifikasiPage() {
  // Ambil data notifikasi join dengan profiles
  const { data: notifications } = await supabase
    .from("notifications")
    .select(`
      *,
      profiles (
        nama_lengkap
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      {/* JUDUL HALAMAN (Warna Hijau Teal sesuai Sidebar) */}
      <h1 className="text-2xl font-bold text-[#1abc9c]">Pusat Notifikasi</h1>

      <div className="bg-white rounded-lg shadow-sm border p-6 min-h-[500px]">
        <h2 className="text-gray-600 font-medium mb-4 text-sm uppercase tracking-wide">
          Daftar Notifikasi
        </h2>

        <div className="overflow-x-auto rounded-t-lg">
          <table className="w-full text-sm text-left">
            {/* HEADER TABLE: Warna Kuning Lime (#d4e157) Sesuai Desain UI */}
            <thead className="bg-[#d4e157] text-black font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-center w-12 rounded-tl-lg">No</th>
                <th className="px-4 py-3">Nama Pelapor</th>
                <th className="px-4 py-3">Jenis Notifikasi</th>
                <th className="px-4 py-3 w-32">Tanggal</th>
                <th className="px-4 py-3">Ringkasan</th>
                <th className="px-4 py-3 w-24">Status</th>
                <th className="px-4 py-3 text-center w-40 rounded-tr-lg">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {notifications?.map((notif, index) => {
                 // Format Tanggal (DD-MM-YYYY)
                 const dateObj = new Date(notif.created_at);
                 const dateStr = dateObj.toLocaleDateString("id-ID", {
                   day: "2-digit",
                   month: "2-digit",
                   year: "numeric"
                 });
                 
                 // Handle nama pelapor aman
                 const profileName = Array.isArray(notif.profiles) 
                    ? notif.profiles[0]?.nama_lengkap 
                    : notif.profiles?.nama_lengkap;

                return (
                  <tr key={notif.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-center text-gray-500">{index + 1}</td>
                    
                    {/* Nama Pelapor */}
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {profileName || "Sistem / User Tamu"}
                    </td>
                    
                    {/* Jenis Notifikasi */}
                    <td className="px-4 py-3 text-gray-700">
                        {notif.jenis}
                    </td>

                    {/* Tanggal */}
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {dateStr}
                    </td>

                    {/* Ringkasan */}
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={notif.pesan || notif.ringkasan}>
                      {notif.pesan || notif.ringkasan || "-"}
                    </td>

                    {/* Status (Text biasa, bukan Badge, sesuai request gambar tabel simple) */}
                    <td className="px-4 py-3">
                        <span className={`font-medium ${
                            notif.status === 'Selesai' ? 'text-green-600' : 'text-orange-500'
                        }`}>
                            {notif.status || 'Pending'}
                        </span>
                    </td>

                    {/* Aksi (Tombol Warna-Warni) */}
                    <td className="px-4 py-3">
                      <NotificationActionButtons id={notif.id} status={notif.status} />
                    </td>
                  </tr>
                );
              })}

              {(!notifications || notifications.length === 0) && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400">
                    Tidak ada notifikasi baru saat ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}