"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { bulan: 'Bulan 1', bb: 50 },
  { bulan: 'Bulan 2', bb: 51 },
  { bulan: 'Bulan 3', bb: 52.5 },
  { bulan: 'Bulan 4', bb: 54 },
  { bulan: 'Bulan 5', bb: 56 },
];

export default function DetailIbuPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
         <h1 className="text-2xl font-bold text-gray-800">Detail Ibu Hamil</h1>
         <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Aktif</span>
      </div>

      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="profil">Profil Identitas</TabsTrigger>
          <TabsTrigger value="anc">Pemeriksaan (ANC)</TabsTrigger>
        </TabsList>

        {/* TAB 1: PROFIL (READ ONLY) */}
        <TabsContent value="profil" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Identitas Ibu (Read-Only)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>NIK</Label>
                  <Input value="3201234567890001" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input value="Siti Aminah" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Tempat, Tanggal Lahir</Label>
                  <Input value="Tasikmalaya, 12 Januari 1995" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Golongan Darah</Label>
                  <Input value="O" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Nama Suami</Label>
                  <Input value="Budi Santoso" readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label>Alamat Lengkap</Label>
                  <Input value="Jl. Cempaka No. 12, Mugarsari" readOnly className="bg-gray-50" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: ANC (INPUT & GRAFIK) */}
        <TabsContent value="anc" className="mt-6 space-y-6">
          
          {/* Form Input Kunjungan */}
          <Card>
            <CardHeader>
              <CardTitle>Input Data Kunjungan Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                   <div className="space-y-2">
                      <Label>Tanggal Periksa</Label>
                      <Input type="date" />
                   </div>
                   <div className="space-y-2">
                      <Label>Usia Kehamilan (Minggu)</Label>
                      <Input type="number" placeholder="Contoh: 20" />
                   </div>
                   <div className="space-y-2">
                      <Label>Berat Badan (Kg)</Label>
                      <Input type="number" step="0.1" />
                   </div>
                   <div className="space-y-2">
                      <Label>Tinggi Badan (cm)</Label>
                      <Input type="number" />
                   </div>
                   <div className="space-y-2">
                      <Label>LiLA (cm)</Label>
                      <Input type="number" step="0.1" />
                   </div>
                   <div className="space-y-2">
                      <Label>Tekanan Darah (mmHg)</Label>
                      <Input placeholder="120/80" />
                   </div>
                   <div className="space-y-2">
                      <Label>Tinggi Fundus (cm)</Label>
                      <Input type="number" />
                   </div>
                   <div className="space-y-2">
                      <Label>DJJ (x/menit)</Label>
                      <Input type="number" />
                   </div>
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-8">
                   {/* Imunisasi Tetanus */}
                   <div className="space-y-3">
                      <Label className="text-base font-semibold">Status Imunisasi Tetanus</Label>
                      <div className="flex flex-wrap gap-4">
                         {['T1', 'T2', 'T3', 'T4', 'T5'].map((t) => (
                           <div key={t} className="flex items-center space-x-2">
                             <Checkbox id={t} />
                             <Label htmlFor={t}>{t}</Label>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Suplemen */}
                   <div className="space-y-3">
                      <Label className="text-base font-semibold">Pemberian Suplemen</Label>
                      <div className="flex flex-col gap-2">
                         <div className="flex items-center space-x-2">
                             <Checkbox id="ttd" />
                             <Label htmlFor="ttd">Tablet Tambah Darah (TTD)</Label>
                         </div>
                         <div className="flex items-center space-x-2">
                             <Checkbox id="mms" />
                             <Label htmlFor="mms">Multiple Micronutrient (MMS)</Label>
                         </div>
                      </div>
                   </div>
                </div>

                <Button className="w-full bg-[#1abc9c] hover:bg-[#16a085]">Simpan Data Pemeriksaan</Button>
              </form>
            </CardContent>
          </Card>

          {/* Visualisasi Data */}
          <div className="grid md:grid-cols-2 gap-6">
             {/* Grafik BB */}
             <Card>
               <CardHeader>
                 <CardTitle className="text-sm">Grafik Peningkatan Berat Badan</CardTitle>
               </CardHeader>
               <CardContent className="h-[250px]">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dummyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bulan" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line type="monotone" dataKey="bb" stroke="#1abc9c" strokeWidth={2} />
                    </LineChart>
                 </ResponsiveContainer>
               </CardContent>
             </Card>

             {/* Grafik Evaluasi Kehamilan (Dummy Placeholder) */}
             <Card>
               <CardHeader>
                 <CardTitle className="text-sm">Grafik Evaluasi (TFU & DJJ)</CardTitle>
               </CardHeader>
               <CardContent className="h-[250px] flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                  Grafik TFU & DJJ akan muncul setelah data mencukupi.
               </CardContent>
             </Card>
          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}