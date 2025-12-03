"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { JadwalDialog } from "@/components/kader/jadwal-dialog";

export default function JadwalKaderPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg border shadow-sm">
         <div>
            <h1 className="text-2xl font-bold text-[#1abc9c]">Jadwal Posyandu</h1>
            <p className="text-sm text-gray-500">Atur jadwal kegiatan dan imunisasi.</p>
         </div>
         <JadwalDialog mode="create" />
      </div>

      <div className="space-y-8">
        {/* TABEL JADWAL POSYANDU */}
        <Card className="border-t-4 border-t-[#d4e157] shadow-md">
            <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Jadwal Kegiatan</h3>
                <Table>
                <TableHeader className="bg-[#d4e157]">
                    <TableRow>
                        <TableHead className="text-black font-bold w-12 text-center">No</TableHead>
                        <TableHead className="text-black font-bold">Nama Kader</TableHead>
                        <TableHead className="text-black font-bold">Hari / Tanggal</TableHead>
                        <TableHead className="text-black font-bold">Kontak WhatsApp</TableHead>
                        <TableHead className="text-black font-bold">Tempat</TableHead>
                        <TableHead className="text-black font-bold text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="hover:bg-gray-50">
                        <TableCell className="text-center">1</TableCell>
                        <TableCell>Santi</TableCell>
                        <TableCell>Minggu/23-11-2025</TableCell>
                        <TableCell className="text-blue-600 underline cursor-pointer">+6281234567890</TableCell>
                        <TableCell>Posyandu Cempaka</TableCell>
                        <TableCell className="text-center">
                            <JadwalDialog mode="edit" data={{ kader: "Santi", tanggal: "2025-11-23" }} />
                        </TableCell>
                    </TableRow>
                    {/* Tambah baris dummy */}
                </TableBody>
                </Table>
            </CardContent>
        </Card>

        {/* TABEL IMUNISASI */}
        <Card className="border-t-4 border-t-[#d4e157] shadow-md">
            <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Jadwal Imunisasi</h3>
                <Table>
                <TableHeader className="bg-[#d4e157]">
                    <TableRow>
                        <TableHead className="text-black font-bold w-12 text-center">No</TableHead>
                        <TableHead className="text-black font-bold">Nama Bidan</TableHead>
                        <TableHead className="text-black font-bold">Hari / Tanggal</TableHead>
                        <TableHead className="text-black font-bold">Jenis Imunisasi</TableHead>
                        <TableHead className="text-black font-bold">Tempat</TableHead>
                        <TableHead className="text-black font-bold text-center">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow className="hover:bg-gray-50">
                        <TableCell className="text-center">1</TableCell>
                        <TableCell>Bidan Dewi</TableCell>
                        <TableCell>Sabtu/06-11-2025</TableCell>
                        <TableCell><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Campak</span></TableCell>
                        <TableCell>Posyandu Cempaka</TableCell>
                        <TableCell className="text-center">
                            <JadwalDialog mode="edit" data={{ bidan: "Dewi", kegiatan: "Campak" }} />
                        </TableCell>
                    </TableRow>
                </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}