import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnakDialog } from "@/components/kader/anak-dialog";
import { DeleteAnakButton } from "@/components/kader/delete-anak-button";

export const revalidate = 0; // Agar data selalu fresh

export default async function DataAnakPage() {
  const supabase = await createSupabaseServerClient();

  // 1. Ambil Data Anak (Join dengan Profiles untuk dapat nama ibu)
  // Sesuai DB baru: data_anak.profile_id -> profiles.id
  const { data: listAnak, error } = await supabase
    .from("data_anak")
    .select(`
      *,
      profiles:profile_id (nama_lengkap, nik)
    `)
    .order("created_at", { ascending: false });

  if (error) console.error("Error fetching data_anak:", error);

  // 2. Ambil Data Ibu (Untuk Pilihan di Dialog)
  const { data: listIbu } = await supabase
    .from("profiles")
    .select("id, nama_lengkap, nik")
    .eq("role", "user") // Mengambil user biasa (Ibu)
    .order("nama_lengkap", { ascending: true });

  // Helper Hitung Usia
  const hitungUsia = (tglLahir: string) => {
    if (!tglLahir) return "-";
    const birth = new Date(tglLahir);
    const now = new Date();
    let months = (now.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += now.getMonth();
    return months <= 0 ? "0 Bln" : `${months} Bln`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
            <h1 className="text-2xl font-bold text-[#1abc9c]">Data Anak</h1>
            <p className="text-gray-500 text-sm">Monitoring tumbuh kembang balita.</p>
        </div>
        {/* Pass listIbu ke Dialog Create */}
        <AnakDialog mode="create" listIbu={listIbu || []} />
      </div>

      <Card className="border-t-4 border-t-[#1abc9c] shadow-md">
        <CardHeader className="pb-4">
           <div className="flex items-center gap-2 w-full md:w-1/3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Cari Nama Anak..." className="pl-10 border-gray-200 bg-gray-50 focus-visible:ring-[#1abc9c]" />
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#d4e157]">
              <TableRow>
                <TableHead className="text-black font-bold">NIK</TableHead>
                <TableHead className="text-black font-bold">Nama Anak</TableHead>
                <TableHead className="text-black font-bold">JK</TableHead>
                <TableHead className="text-black font-bold">Tgl Lahir</TableHead>
                <TableHead className="text-black font-bold">Usia</TableHead>
                <TableHead className="text-black font-bold">Nama Ibu</TableHead>
                <TableHead className="text-center text-black font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listAnak && listAnak.length > 0 ? (
                listAnak.map((anak: any) => (
                  <TableRow key={anak.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{anak.nik || "-"}</TableCell>
                    <TableCell className="font-medium">{anak.nama_lengkap}</TableCell>
                    <TableCell>{anak.jenis_kelamin}</TableCell>
                    <TableCell>{anak.tanggal_lahir}</TableCell>
                    <TableCell>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                            {hitungUsia(anak.tanggal_lahir)}
                        </span>
                    </TableCell>
                    <TableCell>
                        {/* Menampilkan Nama Ibu dari Relasi */}
                        {anak.profiles?.nama_lengkap || <span className="text-red-400 italic">Tidak Terhubung</span>}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        {/* Tombol Detail */}
                        <Button asChild size="icon" variant="outline" className="h-8 w-8 text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100" title="Detail">
                            <Link href={`/kader/data-anak/${anak.id}`}>
                               <Eye className="w-4 h-4" />
                            </Link>
                        </Button>
                        
                        {/* Tombol Edit */}
                        <AnakDialog 
                            mode="edit" 
                            listIbu={listIbu || []}
                            data={{ 
                                id: anak.id,
                                nik: anak.nik, 
                                nama: anak.nama_lengkap, 
                                jk: anak.jenis_kelamin,
                                tgl_lahir: anak.tanggal_lahir, 
                                tempat_lahir: anak.tempat_lahir,
                                ibu_id: anak.profile_id, // Menggunakan profile_id dari DB
                                nama_ayah: anak.nama_ayah
                            }} 
                        />
                        
                        {/* Tombol Hapus */}
                        <DeleteAnakButton id={anak.id} nama={anak.nama_lengkap} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Belum ada data anak. Silakan tambah data baru.
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