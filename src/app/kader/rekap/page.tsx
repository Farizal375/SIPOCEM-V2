"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Filter } from "lucide-react";

export default function RekapPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1abc9c]">Rekapitulasi Data & Pelaporan</h1>

      <Card>
        <CardContent className="p-6">
           <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-48 space-y-2">
                 <label className="text-sm font-medium">Bulan</label>
                 <Select defaultValue="11">
                    <SelectTrigger><SelectValue placeholder="Pilih Bulan" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">Oktober</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">Desember</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="w-full md:w-32 space-y-2">
                 <label className="text-sm font-medium">Tahun</label>
                 <Select defaultValue="2025">
                    <SelectTrigger><SelectValue placeholder="Tahun" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <Button className="bg-gray-800 text-white"><Filter className="w-4 h-4 mr-2" /> Tampilkan</Button>
              <div className="flex-1"></div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                 <FileSpreadsheet className="w-4 h-4 mr-2" /> Export .XLS
              </Button>
           </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
         {/* Tabel Agregat Ringkas */}
         <Card>
            <CardHeader><CardTitle className="text-sm">Ringkasan Kunjungan</CardTitle></CardHeader>
            <CardContent>
               <table className="w-full text-sm">
                  <tbody className="divide-y">
                     <tr className="h-10"><td className="text-gray-600">Total Kunjungan Balita</td><td className="font-bold text-right">45</td></tr>
                     <tr className="h-10"><td className="text-gray-600">Balita Naik Berat Badan (N)</td><td className="font-bold text-right">30</td></tr>
                     <tr className="h-10"><td className="text-gray-600">Balita Tetap/Turun (T)</td><td className="font-bold text-right text-red-500">5</td></tr>
                     <tr className="h-10"><td className="text-gray-600">Ibu Hamil KEK</td><td className="font-bold text-right text-red-500">2</td></tr>
                  </tbody>
               </table>
            </CardContent>
         </Card>

         <Card>
            <CardHeader><CardTitle className="text-sm">Cakupan Imunisasi</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center h-[180px] border-2 border-dashed rounded-md bg-gray-50">
               <p className="text-gray-400">Grafik Ringkasan (Bar Chart)</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}