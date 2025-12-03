"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSpreadsheet, Filter, TrendingUp, TrendingDown, Users } from "lucide-react";

export default function RekapPage() {
  
  const handleExport = () => {
    const rows = [
        ["Bulan", "Total Kunjungan", "Naik (N)", "Turun (T)"],
        ["November", "45", "30", "5"],
    ];
    let csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rekap_posyandu.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
         <div>
            <h1 className="text-2xl font-bold text-[#1abc9c]">Rekapitulasi Data</h1>
            <p className="text-sm text-gray-500">Laporan bulanan dan tahunan posyandu.</p>
         </div>
      </div>

      <Card className="border-t-4 border-t-[#1abc9c]">
        <CardContent className="p-6">
           <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="w-full md:w-48 space-y-2">
                 <label className="text-sm font-bold text-gray-700">Bulan</label>
                 <Select defaultValue="11">
                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Pilih Bulan" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">Oktober</SelectItem>
                        <SelectItem value="11">November</SelectItem>
                        <SelectItem value="12">Desember</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <div className="w-full md:w-32 space-y-2">
                 <label className="text-sm font-bold text-gray-700">Tahun</label>
                 <Select defaultValue="2025">
                    <SelectTrigger className="bg-gray-50 border-gray-300"><SelectValue placeholder="Tahun" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              <Button className="bg-gray-800 text-white hover:bg-gray-900"><Filter className="w-4 h-4 mr-2" /> Tampilkan Data</Button>
              <div className="flex-1"></div>
              <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                 <FileSpreadsheet className="w-4 h-4 mr-2" /> Download Excel (.XLS)
              </Button>
           </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
         {/* Tabel Agregat */}
         <Card className="shadow-md">
            <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-base font-bold text-gray-700">Ringkasan Kunjungan Bulan Ini</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
               <table className="w-full text-sm">
                  <tbody className="divide-y">
                     <tr className="h-12">
                        <td className="text-gray-600 flex items-center gap-2"><Users className="w-4 h-4"/> Total Kunjungan Balita</td>
                        <td className="font-bold text-right text-lg">45</td>
                     </tr>
                     <tr className="h-12">
                        <td className="text-gray-600 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-green-500"/> Balita Naik Berat Badan (N)</td>
                        <td className="font-bold text-right text-lg text-green-600">30</td>
                     </tr>
                     <tr className="h-12">
                        <td className="text-gray-600 flex items-center gap-2"><TrendingDown className="w-4 h-4 text-red-500"/> Balita Tetap/Turun (T)</td>
                        <td className="font-bold text-right text-lg text-red-500">5</td>
                     </tr>
                     <tr className="h-12">
                        <td className="text-gray-600 font-medium">Ibu Hamil KEK</td>
                        <td className="font-bold text-right text-lg text-red-500">2</td>
                     </tr>
                  </tbody>
               </table>
            </CardContent>
         </Card>

         {/* Placeholder Grafik */}
         <Card className="shadow-md">
            <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-base font-bold text-gray-700">Cakupan Imunisasi</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px]">
               <p className="text-gray-400 text-sm italic">Grafik Bar Chart akan ditampilkan di sini berdasarkan data filter.</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}