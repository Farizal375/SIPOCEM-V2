import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Trash2, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IbuDialog } from "@/components/kader/ibu-dialog"; 

export default function DataIbuPage() {
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
               {/* Filter opsional bisa ditaruh disini */}
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#d4e157]">
              <TableRow>
                <TableHead className="text-black font-bold">NIK</TableHead>
                <TableHead className="text-black font-bold">Nama Lengkap</TableHead>
                <TableHead className="text-black font-bold">Tgl Lahir</TableHead>
                <TableHead className="text-black font-bold">Usia Kandungan</TableHead>
                <TableHead className="text-black font-bold">Lokasi</TableHead>
                <TableHead className="text-center text-black font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Dummy Data Row 1 */}
              <TableRow className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">3201234567890001</TableCell>
                <TableCell>Siti Aminah</TableCell>
                <TableCell>12/08/1995</TableCell>
                <TableCell><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">20 Minggu</span></TableCell>
                <TableCell>Kp. Melati RT 02</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button asChild size="icon" variant="outline" className="h-8 w-8 text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100" title="Detail Pemeriksaan">
                        <Link href="/kader/data-ibu/1">
                           <Eye className="w-4 h-4" />
                        </Link>
                    </Button>
                    <div title="Edit Data Master">
                        <IbuDialog mode="edit" data={{ nama: "Siti Aminah", nik: "3201234567890001" }} />
                    </div>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-500 border-red-200 bg-red-50 hover:bg-red-100" title="Hapus">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {/* Dummy Data Row 2 */}
              <TableRow className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">3201234567890005</TableCell>
                <TableCell>Rina Nose</TableCell>
                <TableCell>20/01/1998</TableCell>
                <TableCell><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">12 Minggu</span></TableCell>
                <TableCell>Kp. Mawar RT 04</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button asChild size="icon" variant="outline" className="h-8 w-8 text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100">
                        <Link href="/kader/data-ibu/2">
                           <Eye className="w-4 h-4" />
                        </Link>
                    </Button>
                    <IbuDialog mode="edit" data={{ nama: "Rina Nose", nik: "3201234567890005" }} />
                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-500 border-red-200 bg-red-50 hover:bg-red-100">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}