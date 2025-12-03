"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Bell, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

// Data Dummy Grafik
const dataBeratBadan = [
  { month: 'Jan', weight: 55 },
  { month: 'Feb', weight: 56 },
  { month: 'Mar', weight: 57.5 },
  { month: 'Apr', weight: 59 },
  { month: 'Mei', weight: 62 },
];

const dataBeratAnak = [
  { month: '1 Bln', weight: 4.2 },
  { month: '2 Bln', weight: 5.1 },
  { month: '3 Bln', weight: 6.0 },
  { month: '4 Bln', weight: 7.2 },
  { month: '5 Bln', weight: 8.1 },
];

export default function UserDashboard() {
  const { user } = useUser();
  const today = new Date().toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1abc9c]">Dashboard User</h1>
          <p className="text-gray-500 text-sm">Halo, {user?.fullName || "Ibu Dini"}</p>
        </div>
        <p className="text-xs text-gray-400">{today}</p>
      </div>

      {/* Section Data Ibu Hamil */}
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-gray-50/50 py-3 px-6 border-b">
          <CardTitle className="text-sm font-bold text-gray-700">Data Ibu Hamil</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[#1abc9c] flex items-center justify-center flex-shrink-0">
                   {/* Icon Ibu Hamil SVG Custom / Lucide fallback */}
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6"/><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"/><path d="M12 7v10"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Riwayat Pemeriksaan</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Status Kehamilan : <span className="font-semibold text-green-600">Normal</span></p>
                    <p>Usia Kehamilan : <span className="font-semibold">20 Minggu</span></p>
                    <p>Kunjungan Terakhir : <span className="font-semibold">12 November 2025</span></p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-[#1abc9c] hover:bg-[#16a085]" asChild>
                <Link href="/user/data-ibu">Lihat Detail Pemeriksaan</Link>
              </Button>
            </div>
            {/* Mini Chart */}
            <div className="h-[150px] w-full bg-white border rounded-lg p-2">
               <p className="text-[10px] text-gray-400 mb-2">Rata-rata Kenaikan Berat Badan (Kg)</p>
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={dataBeratBadan}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                   <YAxis hide />
                   <Tooltip />
                   <Line type="monotone" dataKey="weight" stroke="#1abc9c" strokeWidth={2} dot={{r: 3, fill: "#1abc9c"}} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Data Anak */}
      <Card className="overflow-hidden shadow-sm">
        <CardHeader className="bg-gray-50/50 py-3 px-6 border-b">
          <CardTitle className="text-sm font-bold text-gray-700">Data Anak</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-[#1abc9c] flex items-center justify-center flex-shrink-0">
                   <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M10 22v-6.57a2 2 0 0 1 3.52-1.12l.48.42v7.27a2 2 0 0 0 4 0V11a5 5 0 1 0-10 0v11a2 2 0 0 0 4 0z"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Riwayat Pemeriksaan</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Rentang Usia : <span className="font-semibold">24 Bulan</span></p>
                    <p>Status Pemeriksaan : <span className="font-semibold text-green-600">Normal</span></p>
                    <p>Kunjungan Terakhir : <span className="font-semibold">12 November 2025</span></p>
                  </div>
                </div>
              </div>
              <Button className="w-full bg-[#1abc9c] hover:bg-[#16a085]" asChild>
                <Link href="/user/data-anak">Lihat Detail Pemeriksaan</Link>
              </Button>
            </div>
            {/* Mini Chart Anak */}
            <div className="h-[150px] w-full bg-white border rounded-lg p-2">
               <p className="text-[10px] text-gray-400 mb-2">Grafik Kenaikan Berat Badan Anak (Kg)</p>
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={dataBeratAnak}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} />
                   <XAxis dataKey="month" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                   <YAxis hide />
                   <Tooltip />
                   <Line type="monotone" dataKey="weight" stroke="#1abc9c" strokeWidth={2} dot={{r: 3, fill: "#1abc9c"}} />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jadwal Terdekat */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Jadwal Posyandu Terdekat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg">
             <div className="mb-2 md:mb-0">
               <p className="font-semibold text-[#1abc9c]">Siti (Kader)</p>
               <p className="text-sm text-gray-600">Posyandu Cempaka</p>
             </div>
             <div className="text-right">
               <p className="font-semibold text-gray-800">Sabtu, 29 November 2025</p>
               <p className="text-sm text-gray-600">Posyandu Cempaka</p>
             </div>
             <div className="mt-2 md:mt-0 text-[#1abc9c] font-bold">
               +6212345678901
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifikasi */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-sm font-bold">Notifikasi dan Peringatan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
            <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">Jadwal imunisasi anak anda 3 hari lagi.</p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-md">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <p className="text-sm text-yellow-800">Anda belum melakukan pemeriksaan kehamilan bulan ini.</p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-md">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-800">Berat badan anak anda sedikit dibawah normal.</p>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}