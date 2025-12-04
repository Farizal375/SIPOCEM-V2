import { createClient } from "@supabase/supabase-js"; // Gunakan createClient manual
import {
  Users,
  FileText,
  CreditCard,
  ArrowRight,
} from "lucide-react";

export const revalidate = 0; // Pastikan data selalu fresh

export default async function DashboardPage() {
  // --- 1. BUAT ADMIN CLIENT (BYPASS RLS) ---
  // Kita membuat client khusus di sini menggunakan SERVICE_ROLE_KEY
  // agar dashboard bisa melihat SEMUA data tanpa terhalang permission database.
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

  // --- 2. QUERY DATA ---

  // A. Total Kader (Role = 'kader')
  // Menggunakan ilike agar tidak sensitif huruf besar/kecil (Kader/kader)
  const { count: totalKader } = await supabaseAdmin
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "kader");

  // B. Total User (Role = 'orangtua') 
  // Sesuai permintaan: Orang tua dianggap sebagai User
  const { count: totalUser } = await supabaseAdmin
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "orangtua");

  // C. Laporan Masuk (Notifikasi status 'Pending' atau belum dibaca)
  const { count: laporanMasuk } = await supabaseAdmin
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);

  // D. Aktivitas Terbaru
  const { data: recentActivity } = await supabaseAdmin
    .from("notifications")
    .select(`
      *,
      profiles (
        nama_lengkap,
        role
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8 p-6">
      {/* JUDUL HALAMAN */}
      <div>
        <h1 className="text-3xl font-bold text-[#1abc9c]">Dashboard Admin</h1>
      </div>

      {/* --- BAGIAN 1: KARTU STATISTIK --- */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* CARD 1: TOTAL KADER */}
        <div className="bg-[#1abc9c] rounded-xl p-6 text-white shadow-md relative overflow-hidden group hover:bg-[#16a085] transition-colors">
          <div className="relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
              TOTAL KADER
            </h3>
            <div className="flex items-center gap-4">
              <CreditCard className="w-12 h-12 opacity-80" />
              <span className="text-5xl font-bold">{totalKader || 0}</span>
            </div>
          </div>
        </div>

        {/* CARD 2: TOTAL USER (ORANG TUA) */}
        <div className="bg-[#1abc9c] rounded-xl p-6 text-white shadow-md relative overflow-hidden group hover:bg-[#16a085] transition-colors">
          <div className="relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
              TOTAL USER
            </h3>
            <div className="flex items-center gap-4">
              <Users className="w-12 h-12 opacity-80" />
              <span className="text-5xl font-bold">{totalUser || 0}</span>
            </div>
          </div>
        </div>

        {/* CARD 3: LAPORAN MASUK */}
        <div className="bg-[#1abc9c] rounded-xl p-6 text-white shadow-md relative overflow-hidden group hover:bg-[#16a085] transition-colors">
          <div className="relative z-10">
            <h3 className="text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
              LAPORAN MASUK
            </h3>
            <div className="flex items-center gap-4">
              <FileText className="w-12 h-12 opacity-80" />
              <span className="text-5xl font-bold">{laporanMasuk || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- BAGIAN 2: AKTIVITAS TERBARU --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h2 className="text-[#1abc9c] font-semibold text-lg">
            Aktivitas Terbaru
          </h2>
          <button className="text-xs text-[#1abc9c] hover:underline font-medium flex items-center gap-1">
            Lihat Semua <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="relative pl-2">
          {recentActivity && recentActivity.length > 0 ? (
            <div className="space-y-8 border-l-2 border-gray-100 ml-3 py-2">
              {recentActivity.map((notif) => {
                const profile = Array.isArray(notif.profiles) ? notif.profiles[0] : notif.profiles;
                const nama = profile?.nama_lengkap || "Sistem";
                const role = profile?.role || "System";

                const dateObj = new Date(notif.created_at);
                const timeStr = dateObj.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' });
                const dateStr = dateObj.toLocaleDateString("id-ID", { day: 'numeric', month: 'long' });
                const isToday = new Date().toDateString() === dateObj.toDateString();

                return (
                  <div key={notif.id} className="relative pl-8 group">
                    {/* DOT TIMELINE */}
                    <span className="absolute -left-[9px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-transparent flex items-center justify-center z-10">
                       <span className={`h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                         role === 'admin' ? 'bg-orange-400' : 'bg-[#1abc9c]'
                       }`}></span>
                    </span>

                    {/* KONTEN */}
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-gray-800">
                        {nama} <span className="text-gray-400 font-normal text-xs capitalize">({role})</span>
                      </p>
                      <p className="text-sm text-gray-600 font-medium">
                        {notif.jenis}
                      </p>
                      {notif.pesan && (
                        <p className="text-xs text-gray-500 italic mt-0.5">
                          "{notif.pesan}"
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wide font-semibold">
                        {isToday ? `Hari ini ${timeStr}` : `${dateStr}, ${timeStr}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <FileText className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm">Belum ada aktivitas terbaru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}