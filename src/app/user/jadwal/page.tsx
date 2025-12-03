"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function JadwalPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border shadow-sm">
         <h1 className="text-2xl font-bold text-[#1abc9c]">Jadwal Posyandu</h1>
      </div>

      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-8">
        
        {/* Tabel Jadwal Posyandu */}
        <div>
            <h2 className="text-gray-600 mb-4 font-medium">Jadwal Posyandu</h2>
            <div className="rounded-t-lg overflow-hidden border">
                <Table>
                    <TableHeader className="bg-[#d4e157]">
                        <TableRow>
                            <TableHead className="text-black font-bold w-12">No</TableHead>
                            <TableHead className="text-black font-bold">Nama Kader</TableHead>
                            <TableHead className="text-black font-bold">Hari / Tanggal</TableHead>
                            <TableHead className="text-black font-bold">Kontak WhatsApp</TableHead>
                            <TableHead className="text-black font-bold">Tempat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>Santi</TableCell>
                            <TableCell>Minggu/23-11-2025</TableCell>
                            <TableCell>+6281234567890</TableCell>
                            <TableCell>Posyandu Cempaka</TableCell>
                        </TableRow>
                        {/* Tambahkan baris dummy lain jika perlu */}
                    </TableBody>
                </Table>
            </div>
        </div>

        {/* Tabel Imunisasi */}
        <div>
            <h2 className="text-gray-600 mb-4 font-medium">Imunisasi</h2>
            <div className="rounded-t-lg overflow-hidden border">
                <Table>
                    <TableHeader className="bg-[#d4e157]">
                        <TableRow>
                            <TableHead className="text-black font-bold w-12">No</TableHead>
                            <TableHead className="text-black font-bold">Nama Bidan</TableHead>
                            <TableHead className="text-black font-bold">Hari / Tanggal</TableHead>
                            <TableHead className="text-black font-bold">Jenis Imunisasi</TableHead>
                            <TableHead className="text-black font-bold">Tempat</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>Dewi</TableCell>
                            <TableCell>Sabtu/06-11-2025</TableCell>
                            <TableCell>Campak</TableCell>
                            <TableCell>Posyandu Cempaka</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>

      </div>
    </div>
  );
}