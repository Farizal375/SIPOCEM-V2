import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, History } from "lucide-react";
import { IbuDialog } from "@/components/kader/ibu-dialog";
import { PemeriksaanIbuDialog } from "@/components/kader/pemeriksaan-ibu-dialog";
import { DeleteIbuButton, DeletePemeriksaanButton } from "@/components/kader/delete-ibu-button";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export const revalidate = 0;

export default async function DetailIbuPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const { id } = params;

  // 1. Ambil Profil Ibu
  const { data: ibu, error: errIbu } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  // 2. Ambil Riwayat Pemeriksaan (Urut dari terbaru)
  const { data: riwayat, error: errRiwayat } = await supabase
    .from("pemeriksaan_ibu")
    .select("*")
    .eq("profile_id", id)
    .order("tgl_kunjungan", { ascending: false });

  if (errIbu || !ibu) return <div>Data Ibu tidak ditemukan</div>;

  // Format Data untuk Grafik (Berat Badan) - Urutkan Ascending (Terlama ke Terbaru) untuk grafik
  const chartData = riwayat 
    ? [...riwayat].reverse().map((item) => ({
        tanggal: new Date(item.tgl_kunjungan).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
        bb: item.berat_badan
      }))
    : [];

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
            <IbuDialog 
                mode="edit" 
                data={{ 
                    id: ibu.id,
                    nama: ibu.nama_lengkap, 
                    nik: ibu.nik, 
                    tgl_lahir: ibu.tanggal_lahir,
                    lokasi: ibu.alamat,
                    telepon: ibu.no_telepon 
                }} 
            />
            
            {/* Hapus Profil Utama */}
            <DeleteIbuButton id={ibu.id} nama={ibu.nama_lengkap} variant="with-text" />
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
             <PemeriksaanIbuDialog mode="create" ibuId={ibu.id} />
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
                            {riwayat && riwayat.length > 0 ? (
                                riwayat.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.tgl_kunjungan}</TableCell>
                                        <TableCell>{item.usia_kehamilan}</TableCell>
                                        <TableCell>{item.berat_badan}</TableCell>
                                        <TableCell>{item.tekanan_darah}</TableCell>
                                        <TableCell>{item.tfu} cm</TableCell>
                                        <TableCell className="text-center">
                                            <div className="flex justify-center gap-1">
                                                <PemeriksaanIbuDialog 
                                                    mode="edit" 
                                                    ibuId={ibu.id}
                                                    data={{ 
                                                        id: item.id,
                                                        tanggal_periksa: item.tgl_kunjungan, 
                                                        usia_kandungan: item.usia_kehamilan, 
                                                        bb: item.berat_badan, 
                                                        tensi: item.tekanan_darah, 
                                                        tfu: item.tfu,
                                                        djj: item.djj,
                                                        lila: item.lila,
                                                        catatan: item.catatan_kader
                                                    }} 
                                                />
                                                <DeletePemeriksaanButton id={item.id} ibuId={ibu.id} />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-gray-500">Belum ada data pemeriksaan.</TableCell>
                                </TableRow>
                            )}
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
                 {chartData.length > 0 ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tanggal" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip />
                        <Line type="monotone" dataKey="bb" stroke="#1abc9c" strokeWidth={3} dot={{r:4, fill:"#1abc9c"}} />
                        </LineChart>
                    </ResponsiveContainer>
                 ) : (
                    <div className="h-full flex items-center justify-center text-xs text-gray-400">Data belum cukup</div>
                 )}
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
                  <p className="font-medium text-lg">{ibu.nik || "-"}</p>
                </div>
                <div className="space-y-1 border-b pb-2">
                  <Label className="text-gray-500 text-xs uppercase">Nama Lengkap</Label>
                  <p className="font-medium text-lg">{ibu.nama_lengkap}</p>
                </div>
                <div className="space-y-1 border-b pb-2">
                  <Label className="text-gray-500 text-xs uppercase">Tanggal Lahir</Label>
                  <p className="font-medium text-lg">{ibu.tanggal_lahir || "-"}</p>
                </div>
                <div className="space-y-1 border-b pb-2">
                  <Label className="text-gray-500 text-xs uppercase">Nomor Telepon</Label>
                  <p className="font-medium text-lg">{ibu.no_telepon || "-"}</p>
                </div>
                <div className="space-y-1 border-b pb-2">
                  <Label className="text-gray-500 text-xs uppercase">Alamat</Label>
                  <p className="font-medium text-lg">{ibu.alamat || "-"}</p>
                </div>
                <div className="space-y-1 border-b pb-2">
                  <Label className="text-gray-500 text-xs uppercase">Faskes</Label>
                  <p className="font-medium text-lg">{ibu.faskes || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}