"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle, Settings, ZoomIn } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const dataJanin = [
  { week: 0, weight: 0 },
  { week: 10, weight: 10 },
  { week: 20, weight: 25 },
  { week: 30, weight: 50 },
  { week: 40, weight: 90 },
];

export default function DataIbuPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1abc9c]">Data Ibu Hamil</h1>

      {/* Kartu Profil Ibu */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Foto & Label */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-24 h-24 border-4 border-gray-100">
                <AvatarFallback className="bg-gray-200 text-4xl">U</AvatarFallback>
              </Avatar>
              <span className="bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">Nama User</span>
            </div>

            {/* Info Text */}
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-bold text-emerald-900">Data Ibu Hamil</h2>
              <p className="text-emerald-700 font-medium">Ringkasan Riwayat Pemeriksaan</p>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>Status Terakhir: <span className="font-semibold text-gray-800">Normal</span></p>
                <p>Kunjungan Berikutnya</p>
                <p className="font-bold text-gray-800 text-lg">25 Desember 2025</p>
              </div>
            </div>

            {/* Icon Pojok */}
            <div className="hidden md:block">
               <div className="bg-[#1abc9c] p-3 rounded-full">
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h6"/><path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Z"/><path d="M12 7v10"/></svg>
               </div>
            </div>
          </div>

          {/* Sub Card Detail */}
          <div className="mt-6 bg-white border rounded-xl p-4 shadow-sm relative">
             <div className="absolute top-4 right-4 text-[#1abc9c]">
                <Settings className="w-5 h-5" />
             </div>
             <h3 className="font-bold text-emerald-800 text-lg">Data Ibu Hamil</h3>
             <p className="text-emerald-600 font-medium mb-2">Riwayat Pemeriksaan</p>
             <div className="text-sm text-gray-600">
                <p className="mb-1">Trisemester: <span className="font-semibold text-gray-800">20 Minggu</span></p>
                <p>Kunjungan Posyandu: <span className="font-semibold text-gray-800">25 Desember 2025</span></p>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Grafik Pertumbuhan Janin */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-center font-bold text-emerald-800 text-xl mb-6">Grafik Pertumbuhan Janin</h3>
          
          <div className="h-[300px] w-full bg-gray-50/50 rounded-lg p-2 border">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataJanin}>
                <defs>
                  <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                {/* Area Hijau sebagai "Normal Range" dummy */}
                <Area type="monotone" dataKey="weight" stroke="#1abc9c" strokeWidth={3} fill="url(#colorNormal)" dot={{r: 4, fill: "#1abc9c"}} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="text-center mt-2 text-sm font-bold text-emerald-600">Normal Range</div>
          </div>

          <div className="flex justify-between items-center mt-4">
             <Button variant="outline" className="gap-2 rounded-full bg-gray-200 border-none hover:bg-gray-300">
                Zoom In-Out <CheckCircle className="w-4 h-4 text-[#1abc9c]" />
             </Button>
             <Button variant="outline" className="gap-2 rounded-full bg-gray-200 border-none hover:bg-gray-300">
                <Settings className="w-4 h-4 text-[#1abc9c]" /> Unduh Laporan
             </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}