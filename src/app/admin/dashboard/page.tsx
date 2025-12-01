import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Baby, Bell, Activity, ArrowUpRight } from "lucide-react";

export const revalidate = 0; // Agar data selalu update saat di-refresh

export default async function DashboardPage() {
  // 1. Ambil Data Statistik dari Supabase
  const { count: totalUser } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: totalAnak } = await supabase
    .from("anak")
    .select("*", { count: "exact", head: true });

  const { count: pendingReports } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pending");

  // Ambil 5 notifikasi terbaru untuk "Aktivitas Terbaru"
  const { data: recentActivity } = await supabase
    .from("notifications")
    .select("*, profiles(nama_lengkap)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#1abc9c]">Dashboard</h1>
        <p className="text-gray-500">Ringkasan data Posyandu Cempaka hari ini.</p>
      </div>

      {/* --- BAGIAN 1: KARTU STATISTIK --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Ibu/User */}
        <Card className="border-l-4 border-l-[#1abc9c]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Ibu Terdaftar</CardTitle>
            <Users className="h-4 w-4 text-[#1abc9c]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUser || 0}</div>
            <p className="text-xs text-gray-500 mt-1">+2 dari bulan lalu</p>
          </CardContent>
        </Card>

        {/* Card 2: Total Anak */}
        <Card className="border-l-4 border-l-yellow-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Data Anak</CardTitle>
            <Baby className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnak || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Data aktif posyandu</p>
          </CardContent>
        </Card>

        {/* Card 3: Laporan Pending */}
        <Card className="border-l-4 border-l-red-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Laporan Kendala</CardTitle>
            <Bell className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReports || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Butuh penanganan segera</p>
          </CardContent>
        </Card>

        {/* Card 4: Status Sistem */}
        <Card className="border-l-4 border-l-blue-400">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Status Sistem</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-gray-500 mt-1">Server berjalan normal</p>
          </CardContent>
        </Card>
      </div>

      {/* --- BAGIAN 2: GRAFIK & AKTIVITAS --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Placeholder Grafik (Kiri - Lebar 4) */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Statistik Kunjungan Posyandu</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[200px] flex items-center justify-center bg-gray-50 rounded-md border border-dashed">
                <p className="text-gray-400 text-sm">Grafik Kunjungan akan muncul di sini</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifikasi Terbaru (Kanan - Lebar 3) */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Notifikasi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity && recentActivity.length > 0 ? (
                 recentActivity.map((notif) => (
                    <div key={notif.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <span className="relative flex h-2 w-2 mt-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                        </span>
                        <div className="grid gap-1">
                            <p className="text-sm font-medium leading-none">
                                {notif.jenis}
                            </p>
                            <p className="text-xs text-gray-500">
                                Dari: {(notif.profiles as any)?.nama_lengkap || "Sistem"}
                            </p>
                            <p className="text-xs text-gray-400">
                                {new Date(notif.created_at).toLocaleDateString("id-ID", { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                 ))
              ) : (
                  <p className="text-sm text-gray-500 text-center py-4">Belum ada aktivitas baru.</p>
              )}
              
              {/* Tombol Lihat Semua */}
              {recentActivity && recentActivity.length > 0 && (
                  <a href="/admin/pusat-notifikasi" className="flex items-center justify-center text-xs text-[#1abc9c] hover:underline mt-2">
                      Lihat Semua Notifikasi <ArrowUpRight className="ml-1 w-3 h-3" />
                  </a>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}