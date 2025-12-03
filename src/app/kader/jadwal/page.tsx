"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function JadwalKaderPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-[#1abc9c]">Manajemen Jadwal</h1>
         <Button className="bg-[#1abc9c] hover:bg-[#16a085]"><Plus className="w-4 h-4 mr-2"/> Buat Jadwal Baru</Button>
      </div>

      <Card>
         <CardContent className="p-0">
            <Table>
               <TableHeader className="bg-gray-100">
                  <TableRow>
                     <TableHead>Tanggal</TableHead>
                     <TableHead>Kegiatan</TableHead>
                     <TableHead>Petugas Kesehatan</TableHead>
                     <TableHead>Status</TableHead>
                     <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  <TableRow>
                     <TableCell>25 Des 2025</TableCell>
                     <TableCell>Posyandu Melati (Imunisasi & Penimbangan)</TableCell>
                     <TableCell>Bidan Dewi</TableCell>
                     <TableCell><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">Akan Datang</span></TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
                     </TableCell>
                  </TableRow>
                  <TableRow>
                     <TableCell>25 Nov 2025</TableCell>
                     <TableCell>Posyandu Cempaka</TableCell>
                     <TableCell>Bidan Dewi</TableCell>
                     <TableCell><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Selesai</span></TableCell>
                     <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="text-gray-400" disabled>Edit</Button>
                     </TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </CardContent>
      </Card>
    </div>
  );
}