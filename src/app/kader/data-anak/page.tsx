import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DataAnakPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1abc9c]">Data Anak</h1>
        <Button className="bg-[#d4e157] text-black hover:bg-[#c0ca4f]">
          <Plus className="w-4 h-4 mr-2" /> Tambah Data Anak
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
           <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md border w-full md:w-1/3">
              <Search className="w-4 h-4 text-gray-400" />
              <Input placeholder="Cari nama anak..." className="border-none bg-transparent h-8 focus-visible:ring-0" />
           </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>NIK</TableHead>
                <TableHead>Nama Anak</TableHead>
                <TableHead>JK</TableHead>
                <TableHead>Tgl Lahir</TableHead>
                <TableHead>Usia (Bln)</TableHead>
                <TableHead>Nama Ibu</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">3201234567890002</TableCell>
                <TableCell>Rizky Pratama</TableCell>
                <TableCell>L</TableCell>
                <TableCell>10-01-2024</TableCell>
                <TableCell>20</TableCell>
                <TableCell>Siti Aminah</TableCell>
                <TableCell className="text-center">
                  <Button asChild size="sm" variant="outline" className="text-[#1abc9c] border-[#1abc9c]">
                    <Link href="/kader/data-anak/1">
                      <Eye className="w-4 h-4 mr-1" /> Detail
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}