import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Baby, CalendarClock, ClipboardList } from "lucide-react";

export default function DashboardKader() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      
      {/* Statistik Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-pink-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Ibu Hamil</CardTitle>
            <Users className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">Terdaftar aktif</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Anak</CardTitle>
            <Baby className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-gray-500">Terdaftar aktif</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Jadwal Berikutnya</CardTitle>
            <CalendarClock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">25 Des 2025</div>
            <p className="text-xs text-gray-500">Imunisasi Rutin</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Laporan Bulan Ini</CardTitle>
            <ClipboardList className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-gray-500">Data terisi</p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder untuk widget lainnya */}
      <div className="grid md:grid-cols-2 gap-6">
         <Card className="min-h-[300px] flex items-center justify-center border-dashed">
            <p className="text-gray-400">Grafik Kunjungan Bulanan (Placeholder)</p>
         </Card>
         <Card className="min-h-[300px] flex items-center justify-center border-dashed">
            <p className="text-gray-400">Daftar Tugas Hari Ini (Placeholder)</p>
         </Card>
      </div>
    </div>
  );
}