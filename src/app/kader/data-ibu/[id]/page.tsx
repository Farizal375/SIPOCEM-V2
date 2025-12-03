"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, History, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

// Import Dialogs
import { IbuDialog } from "@/components/kader/ibu-dialog"; // Untuk Edit Profil Utama
import { PemeriksaanIbuDialog } from "@/components/kader/pemeriksaan-ibu-dialog"; // Untuk CRUD Bulanan

const dummyChartData = [
  { bulan: 'Bulan 1', bb: 50 },
  { bulan: 'Bulan 2', bb: 51 },
  { bulan: 'Bulan 3', bb: 52.5 },
  { bulan: 'Bulan 4', bb: 54 },
  { bulan: 'Bulan 5', bb: 56 },
];

export default function DetailIbuPage({ params }: { params: { id: string } }) {
  
  const handleDelete = () => {
    toast.success("Data berhasil dihapus");
  };

  return (
    <div className="space-y-6">
      {/* Header & Navigasi */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
            <Link href="/kader/data-ibu" className="text-sm text-gray-500 hover:text-[#1abc9c] flex items-center gap-1 w-fit mb-2">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Detail Ibu Hamil</h1>
        </div>
        <div className="flex gap-2">
            {/* Edit Profil Utama */}
            <IbuDialog mode="edit" data={{ nama: "Siti Aminah", nik: "3201234567890001" }} />
            
            {/* Hapus Profil Utama */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
                        <Trash2 className="w-4 h-4 mr-2" /> Hapus Data Ibu
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Ibu Hamil?</AlertDialogTitle>
                        <AlertDialogDescription>Tindakan ini akan menghapus seluruh data profil dan riwayat pemeriksaan secara permanen.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.success("Data Ibu dihapus")}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="anc" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px] bg-gray-100">
          <TabsTrigger value="anc" className="data-[state=active]:bg-[#1abc9c] data-[state=active]:text-white">Pemeriksaan (ANC)</TabsTrigger>
          <TabsTrigger value="profil" className="data-[state=active]:bg-[#1abc9c] data-[state=active]:text-white">Profil Identitas</TabsTrigger>
        </TabsList>

        {/* TAB 1: PEMERIKSAAN (ANC) */}
        <TabsContent value="anc" className="mt-6 space-y-6">
          
          {/* Header Bagian Pemeriksaan */}
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <History className="w-5 h-5" /> Riwayat Pemeriksaan
             </h3>
             {/* Tombol Tambah Data Bulanan */}
             <PemeriksaanIbuDialog mode="create" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
             {/* Tabel Riwayat */}
             <Card className="lg:col-span-2 shadow-sm border-t-4 border-t-[#1abc9c]">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead>Tanggal</TableHead>
                                <TableHead>Usia (Mgg)</TableHead>
                                <TableHead>BB (Kg)</TableHead>
                                <TableHead>Tensi</TableHead>
                                <TableHead>TFU</TableHead>
                                <TableHead className="text-center">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>12/10/2025</TableCell>
                                <TableCell>20</TableCell>
                                <TableCell>56.0</TableCell>
                                <TableCell>110/80</TableCell>
                                <TableCell>24cm</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center gap-1">
                                        <PemeriksaanIbuDialog mode="edit" data={{ tanggal: "2025-10-12", usia_kandungan: 20, bb: 56, tensi: "110/80", tfu: 24 }} />
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Hapus data pemeriksaan ini?</AlertDialogTitle></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                            {/* Contoh Data Lain */}
                            <TableRow>
                                <TableCell>12/09/2025</TableCell>
                                <TableCell>16</TableCell>
                                <TableCell>54.5</TableCell>
                                <TableCell>120/80</TableCell>
                                <TableCell>18cm</TableCell>
                                <TableCell className="text-center">
                                    <div className="flex justify-center gap-1">
                                        <PemeriksaanIbuDialog mode="edit" data={{ tanggal: "2025-09-12", usia_kandungan: 16, bb: 54.5, tensi: "120/80", tfu: 18 }} />
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
             </Card>

             {/* Grafik Ringkas */}
             <Card className="shadow-sm">
               <CardHeader>
                 <CardTitle className="text-sm">Grafik Berat Badan</CardTitle>
               </CardHeader>
               <CardContent className="h-[300px] p-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dummyChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bulan" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                      <Tooltip />
                      <Line type="monotone" dataKey="bb" stroke="#1abc9c" strokeWidth={3} dot={{r:4, fill:"#1abc9c"}} />
                    </LineChart>
                 </ResponsiveContainer>
                 <p className="text-center text-xs text-gray-500 mt-4">Tren kenaikan berat badan ibu.</p>
               </CardContent>
             </Card>
          </div>
        </TabsContent>

        {/* TAB 2: PROFIL (READ ONLY) */}
        <TabsContent value="profil" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Identitas Lengkap</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-1 border-b pb-2">
                  <Label className="text-gray-500 text-xs uppercase">NIK</Label>
                  <p className="font-medium text-lg">3201234567890001</p>
                </div>
                <div className="space-y-1 border-b pb-2">
                  <Label className="text-gray-500 text-xs uppercase">Nama Lengkap</Label>
                  <p className="font-medium text-lg">Siti Aminah</p>
                </div>
                {/* ... Sisa data profil lainnya ... */}
                <div className="space-y-1 border-b pb-2">
                  <Label className="text-gray-500 text-xs uppercase">Alamat</Label>
                  <p className="font-medium text-lg">Jl. Cempaka No. 12, Mugarsari</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}