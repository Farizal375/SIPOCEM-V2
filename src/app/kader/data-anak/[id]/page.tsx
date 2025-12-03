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
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { ArrowLeft, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";

// Import Dialogs
import { AnakDialog } from "@/components/kader/anak-dialog";
import { PemeriksaanAnakDialog } from "@/components/kader/pemeriksaan-anak-dialog";

const kmsData = [
  { bulan: 0, bb: 3.2 },
  { bulan: 1, bb: 4.5 },
  { bulan: 2, bb: 5.8 },
  { bulan: 3, bb: 6.5 },
  { bulan: 4, bb: 7.2 },
];

export default function DetailAnakPage({ params }: { params: { id: string } }) {
  
  const handleDeletePemeriksaan = () => {
      toast.success("Data pemeriksaan dihapus");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
            <Link href="/kader/data-anak" className="text-sm text-gray-500 hover:text-[#1abc9c] flex items-center gap-1 w-fit mb-2">
                <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Detail Tumbuh Kembang Anak</h1>
        </div>
        <div className="flex gap-2">
            {/* Edit Profil Utama */}
            <AnakDialog mode="edit" data={{ nama: "Rizky Pratama", nik: "3201234567890002", tgl_lahir: "2024-01-10" }} />
            
            {/* Hapus Profil Utama */}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
                        <Trash2 className="w-4 h-4 mr-2" /> Hapus Data Anak
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Data Anak?</AlertDialogTitle>
                        <AlertDialogDescription>Data yang dihapus tidak dapat dikembalikan.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => toast.success("Data anak dihapus")}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <Tabs defaultValue="tumbuh-kembang" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] bg-gray-100">
          <TabsTrigger value="tumbuh-kembang" className="data-[state=active]:bg-[#1abc9c] data-[state=active]:text-white">Pemeriksaan & Grafik</TabsTrigger>
          <TabsTrigger value="profil" className="data-[state=active]:bg-[#1abc9c] data-[state=active]:text-white">Profil Anak</TabsTrigger>
        </TabsList>

        {/* TAB 1: PEMERIKSAAN & GRAFIK (CRUD) */}
        <TabsContent value="tumbuh-kembang" className="mt-6 space-y-8">
           
           <div className="flex justify-between items-center">
               <h3 className="text-lg font-bold text-gray-700">Grafik & Riwayat</h3>
               {/* Tombol Tambah Data Bulanan */}
               <PemeriksaanAnakDialog mode="create" />
           </div>

           {/* Grafik KMS */}
           <Card className="shadow-sm border-t-4 border-t-yellow-400">
             <CardHeader><CardTitle>Grafik KMS (Berat Badan / Umur)</CardTitle></CardHeader>
             <CardContent className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={kmsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="bulan" label={{ value: 'Usia (Bulan)', position: 'insideBottom', offset: -5 }} />
                      <YAxis label={{ value: 'Berat (Kg)', angle: -90, position: 'insideLeft' }} domain={[0, 15]} />
                      <Tooltip />
                      <ReferenceArea y1={0} y2={3} fill="red" fillOpacity={0.1} />
                      <ReferenceArea y1={3} y2={10} fill="green" fillOpacity={0.1} />
                      <ReferenceArea y1={10} y2={15} fill="yellow" fillOpacity={0.1} />
                      <Line type="monotone" dataKey="bb" stroke="#000" strokeWidth={2} dot={{r:4}} />
                   </LineChart>
                </ResponsiveContainer>
             </CardContent>
           </Card>

           {/* Tabel Riwayat Pemeriksaan */}
           <Card className="shadow-sm">
               <CardHeader><CardTitle>Riwayat Data Pertumbuhan</CardTitle></CardHeader>
               <CardContent>
                   <Table>
                       <TableHeader className="bg-gray-50">
                           <TableRow>
                               <TableHead>Tanggal</TableHead>
                               <TableHead>Usia</TableHead>
                               <TableHead>BB (Kg)</TableHead>
                               <TableHead>TB (cm)</TableHead>
                               <TableHead>LK (cm)</TableHead>
                               <TableHead>Vit A</TableHead>
                               <TableHead className="text-center">Aksi</TableHead>
                           </TableRow>
                       </TableHeader>
                       <TableBody>
                           <TableRow>
                               <TableCell>10/05/2024</TableCell>
                               <TableCell>4 Bln</TableCell>
                               <TableCell>7.2</TableCell>
                               <TableCell>62</TableCell>
                               <TableCell>40</TableCell>
                               <TableCell>-</TableCell>
                               <TableCell className="text-center">
                                   <div className="flex justify-center gap-1">
                                       <PemeriksaanAnakDialog mode="edit" data={{ tanggal: "2024-05-10", usia: 4, bb: 7.2, tb: 62, lk: 40 }} />
                                       
                                       <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader><AlertDialogTitle>Hapus data ini?</AlertDialogTitle></AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                                    <AlertDialogAction onClick={handleDeletePemeriksaan} className="bg-red-600">Hapus</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                   </div>
                               </TableCell>
                           </TableRow>
                       </TableBody>
                   </Table>
               </CardContent>
           </Card>
        </TabsContent>

        {/* TAB 2: PROFIL (READ ONLY) */}
        <TabsContent value="profil" className="mt-6">
           <Card>
             <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                   <div className="space-y-1 border-b pb-2">
                       <Label className="text-gray-500 text-xs">Nama Anak</Label>
                       <p className="font-medium text-lg">Rizky Pratama</p>
                   </div>
                   <div className="space-y-1 border-b pb-2">
                       <Label className="text-gray-500 text-xs">NIK</Label>
                       <p className="font-medium text-lg">32012300000</p>
                   </div>
                   {/* Data lain... */}
                </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}