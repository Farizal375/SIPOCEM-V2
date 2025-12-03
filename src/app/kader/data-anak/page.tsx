import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AnakDialog } from "@/components/kader/anak-dialog";

export default function DataAnakPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div>
            <h1 className="text-2xl font-bold text-[#1abc9c]">Data Anak</h1>
            <p className="text-gray-500 text-sm">Monitoring tumbuh kembang balita.</p>
        </div>
        <AnakDialog mode="create" />
      </div>

      <Card className="border-t-4 border-t-[#1abc9c] shadow-md">
        <CardHeader className="pb-4">
           <div className="flex items-center gap-2 w-full md:w-1/3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input placeholder="Cari Nama Anak atau Nama Ibu..." className="pl-10 border-gray-200 bg-gray-50 focus-visible:ring-[#1abc9c]" />
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#d4e157]">
              <TableRow>
                <TableHead className="text-black font-bold">NIK</TableHead>
                <TableHead className="text-black font-bold">Nama Anak</TableHead>
                <TableHead className="text-black font-bold">Jenis Kelamin</TableHead>
                <TableHead className="text-black font-bold">Tgl Lahir</TableHead>
                <TableHead className="text-black font-bold">Usia</TableHead>
                <TableHead className="text-black font-bold">Nama Ibu</TableHead>
                <TableHead className="text-center text-black font-bold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">3201234567890002</TableCell>
                <TableCell>Rizky Pratama</TableCell>
                <TableCell>Laki-laki</TableCell>
                <TableCell>10-01-2024</TableCell>
                <TableCell><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">20 Bln</span></TableCell>
                <TableCell>Siti Aminah</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button asChild size="icon" variant="outline" className="h-8 w-8 text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100" title="Detail Tumbuh Kembang">
                        <Link href="/kader/data-anak/1">
                           <Eye className="w-4 h-4" />
                        </Link>
                    </Button>
                    <AnakDialog mode="edit" data={{ nama: "Rizky", nik: "3201...", tgl_lahir: "2024-01-10", nama_ibu: "Siti Aminah" }} />
                    <Button size="icon" variant="outline" className="h-8 w-8 text-red-500 border-red-200 bg-red-50 hover:bg-red-100">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">3201234567890008</TableCell>
                <TableCell>Ayu Lestari</TableCell>
                <TableCell>Perempuan</TableCell>
                <TableCell>05-05-2024</TableCell>
                <TableCell><span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">16 Bln</span></TableCell>
                <TableCell>Dewi Sartika</TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button asChild size="icon" variant="outline" className="h-8 w-8 text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100">
                        <Link href="/kader/data-anak/2">
                           <Eye className="w-4 h-4" />
                        </Link>
                    </Button>
                    <AnakDialog mode="edit" data={{ nama: "Ayu", nik: "3201...", tgl_lahir: "2024-05-05", nama_ibu: "Dewi" }} />
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