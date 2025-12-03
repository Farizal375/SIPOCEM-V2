"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CheckCircle, Settings } from "lucide-react";
import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceArea } from "recharts";

const dataKMS = [
  { month: 0, weight: 5 },
  { month: 5, weight: 15 },
  { month: 10, weight: 22 },
  { month: 15, weight: 25 },
  { month: 20, weight: 25 },
  { month: 25, weight: 28 },
  { month: 30, weight: 32 },
  { month: 35, weight: 35 },
];

export default function DataAnakPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1abc9c]">Dashboard Anak</h1>

      {/* Kartu Profil Anak */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Foto & Label */}
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-24 h-24 border-4 border-gray-100">
                <AvatarFallback className="bg-black text-white text-4xl">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="0"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </AvatarFallback>
              </Avatar>
              <span className="bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-gray-600">diniandini_505</span>
            </div>

            {/* Info Text */}
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-bold text-emerald-900">Data Anak</h2>
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
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M10 22v-6.57a2 2 0 0 1 3.52-1.12l.48.42v7.27a2 2 0 0 0 4 0V11a5 5 0 1 0-10 0v11a2 2 0 0 0 4 0z"/></svg>
               </div>
            </div>
          </div>

          {/* Sub Card Detail */}
          <div className="mt-6 bg-white border rounded-xl p-4 shadow-sm relative">
             <div className="absolute top-4 right-4 text-[#1abc9c]">
                <div className="bg-[#1abc9c] rounded-full p-1"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><path d="M10 22v-6.57a2 2 0 0 1 3.52-1.12l.48.42v7.27a2 2 0 0 0 4 0V11a5 5 0 1 0-10 0v11a2 2 0 0 0 4 0z"/></svg></div>
             </div>
             <h3 className="font-bold text-emerald-800 text-lg">Data Anak</h3>
             <p className="text-emerald-600 font-medium mb-2">Riwayat Pemeriksaan</p>
             <div className="text-sm text-gray-600">
                <p className="mb-1">Bulan ke-: <span className="font-semibold text-gray-800">20</span></p>
                <p>Kunjungan Posyandu: <span className="font-semibold text-gray-800">25 Desember 2025</span></p>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Grafik Pertumbuhan Anak (KMS Like) */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-center font-bold text-emerald-800 text-xl mb-6">Grafik Pertumbuhan Anak</h3>
          
          <div className="h-[350px] w-full bg-white rounded-lg p-2 border relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataKMS}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: 'Usia (Bulan)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Berat Badan (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                
                {/* Background Zones Simulation using ReferenceArea */}
                <ReferenceArea y1={0} y2={10} fill="#fee2e2" fillOpacity={0.5} /> {/* Merah Bawah */}
                <ReferenceArea y1={10} y2={30} fill="#dcfce7" fillOpacity={0.5} /> {/* Hijau */}
                <ReferenceArea y1={30} y2={50} fill="#fee2e2" fillOpacity={0.5} /> {/* Merah Atas */}

                <Line type="monotone" dataKey="weight" stroke="#047857" strokeWidth={3} dot={{r: 6, fill: "#10b981", stroke: "#047857", strokeWidth: 2}} />
              </LineChart>
            </ResponsiveContainer>
            
            {/* Legend Manual */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center text-xs font-semibold text-gray-600">
               <span className="mb-8">Risiko</span>
               <span className="mb-12">Zona Hijau (Normal)</span>
               <span className="mb-8">Risiko</span>
               <span>Gizi Kurang / Gizi Buruk</span>
            </div>
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