"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';

const kmsData = [
  { bulan: 0, bb: 3.2 },
  { bulan: 1, bb: 4.5 },
  { bulan: 2, bb: 5.8 },
  { bulan: 3, bb: 6.5 },
  { bulan: 4, bb: 7.2 },
];

export default function DetailAnakPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
         <h1 className="text-2xl font-bold text-gray-800">Detail Anak</h1>
      </div>

      <Tabs defaultValue="tumbuh-kembang" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="profil">Profil Anak</TabsTrigger>
          <TabsTrigger value="tumbuh-kembang">Pemeriksaan & Pertumbuhan</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="mt-6">
           <Card>
             <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-2"><Label>Nama Anak</Label><Input value="Rizky Pratama" readOnly className="bg-gray-50"/></div>
                   <div className="space-y-2"><Label>NIK</Label><Input value="32012300000" readOnly className="bg-gray-50"/></div>
                   <div className="space-y-2"><Label>Jenis Kelamin</Label><Input value="Laki-laki" readOnly className="bg-gray-50"/></div>
                   <div className="space-y-2"><Label>Tanggal Lahir</Label><Input value="10 Januari 2024" readOnly className="bg-gray-50"/></div>
                   <div className="space-y-2"><Label>Berat Lahir</Label><Input value="3.2 Kg" readOnly className="bg-gray-50"/></div>
                   <div className="space-y-2"><Label>Panjang Lahir</Label><Input value="49 cm" readOnly className="bg-gray-50"/></div>
                </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="tumbuh-kembang" className="mt-6 space-y-6">
           {/* Form Input Pemeriksaan */}
           <Card>
             <CardHeader><CardTitle>Input Data Pertumbuhan & Gizi</CardTitle></CardHeader>
             <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                   <div className="space-y-2"><Label>Tanggal</Label><Input type="date" /></div>
                   <div className="space-y-2"><Label>Usia (Bulan)</Label><Input type="number" /></div>
                   <div className="space-y-2"><Label>Berat Badan (Kg)</Label><Input type="number" step="0.1" /></div>
                   <div className="space-y-2"><Label>Panjang/Tinggi (cm)</Label><Input type="number" step="0.1" /></div>
                   <div className="space-y-2"><Label>Lingkar Kepala (cm)</Label><Input type="number" step="0.1" /></div>
                   <div className="space-y-2"><Label>LiLA (cm)</Label><Input type="number" step="0.1" /></div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-6 p-4 bg-gray-50 rounded-lg border">
                   <div className="space-y-2">
                      <Label>ASI Eksklusif?</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                        <SelectContent><SelectItem value="ya">Ya</SelectItem><SelectItem value="tidak">Tidak</SelectItem></SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label>Vitamin A</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Pilih..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Belum</SelectItem>
                            <SelectItem value="biru">Biru (6-11 bln)</SelectItem>
                            <SelectItem value="merah">Merah (12-59 bln)</SelectItem>
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="flex items-end pb-2 gap-2">
                      <Checkbox id="cacing" />
                      <Label htmlFor="cacing">Obat Cacing (Diberikan)</Label>
                   </div>
                </div>

                <div className="space-y-2 mb-6">
                   <Label className="font-bold">Ceklis Imunisasi Bulan Ini</Label>
                   <div className="flex flex-wrap gap-4">
                      {['BCG', 'Polio 1', 'DPT-HB-Hib 1', 'Polio 2', 'PCV 1', 'Campak'].map(v => (
                          <div key={v} className="flex items-center space-x-2 border p-2 rounded bg-white">
                             <Checkbox id={v} /> <Label htmlFor={v}>{v}</Label>
                          </div>
                      ))}
                   </div>
                </div>

                <Button className="w-full bg-[#1abc9c] hover:bg-[#16a085]">Simpan Data Anak</Button>
             </CardContent>
           </Card>

           {/* Grafik KMS */}
           <Card>
             <CardHeader><CardTitle>Grafik Pertumbuhan (KMS - BB/U)</CardTitle></CardHeader>
             <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={kmsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bulan" label={{ value: 'Usia (Bulan)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Berat (Kg)', angle: -90, position: 'insideLeft' }} domain={[0, 15]} />
                      <Tooltip />
                      {/* Simulasi Zona KMS (Sangat sederhana) */}
                      <ReferenceArea y1={0} y2={3} fill="red" fillOpacity={0.1} />
                      <ReferenceArea y1={3} y2={10} fill="green" fillOpacity={0.1} />
                      <ReferenceArea y1={10} y2={15} fill="yellow" fillOpacity={0.1} />
                      <Line type="monotone" dataKey="bb" stroke="#000" strokeWidth={2} dot={{r:4}} />
                   </LineChart>
                </ResponsiveContainer>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}