import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IbuDialog } from "@/components/kader/ibu-dialog";
import { DeleteIbuButton } from "@/components/kader/delete-ibu-button"; // Komponen baru (Lihat poin 5)

export const revalidate = 0;

export default async function DataIbuPage() {
  const supabase = await createSupabaseServerClient();

  // Ambil user dengan role 'user' (Asumsi semua user di sini adalah Ibu/Sasaran)
  const { data: listIbu, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "user") 
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching ibu:", error);

  // Helper hitung usia kehamilan (Bisa diambil dari pemeriksaan terakhir jika ada, atau kosongkan)
  // Untuk tabel utama, kita tampilkan data statis profil dulu.

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
            <h1 className="text-2xl font-bold text-[#1abc9c]">Data Ibu Hamil</h1>
            <p className="text-gray-500 text-sm">Kelola data dan riwayat pemeriksaan ibu hamil.</p>
        </div>
        <IbuDialog mode="create" />
      </div>

      {/* Konten Utama */}
      <Card className="border-t-4 border-t-[#1abc9c] shadow-md">
        <CardHeader className="pb-4">
           <div className="flex flex-col md:flex-row justify-between gap-4">
               <div className="relative w-full md:w-1/3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input placeholder="Cari NIK atau Nama Ibu..." className="pl-10 border-gray-200 bg-gray-50 focus-visible:ring-[#1abc9c]" />
               </div>
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#d4e157]">
              <TableRow>
                <TableHead className="text-black font-bold">NIK</TableHead>
                <TableHead className="text-black font-bold">Nama Lengkap</TableHead>
                <TableHead className="text-black font-bold">Tgl Lahir</TableHead>
                <TableHead className="text-black font-bold">Alamat</TableHead>
                <TableHead className="text-center text-black font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listIbu && listIbu.length > 0 ? (
                listIbu.map((ibu: any) => (
                  <TableRow key={ibu.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{ibu.nik || "-"}</TableCell>
                    <TableCell>{ibu.nama_lengkap}</TableCell>
                    <TableCell>{ibu.tanggal_lahir || "-"}</TableCell>
                    <TableCell>{ibu.alamat || "-"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* Detail */}
                        <Button asChild size="icon" variant="outline" className="h-8 w-8 text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100" title="Detail Pemeriksaan">
                            <Link href={`/kader/data-ibu/${ibu.id}`}>
                               <Eye className="w-4 h-4" />
                            </Link>
                        </Button>
                        
                        {/* Edit Profil */}
                        <div title="Edit Data Master">
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
                        </div>

                        {/* Hapus Profil */}
                        <DeleteIbuButton id={ibu.id} nama={ibu.nama_lengkap} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Belum ada data ibu hamil.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}