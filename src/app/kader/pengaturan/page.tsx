"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser, useClerk } from "@clerk/nextjs";
import { AlertCircle, LogOut } from "lucide-react";

export default function PengaturanKaderPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[#1abc9c]">Pengaturan</h1>

      {/* Profil Pribadi */}
      <Card>
         <CardHeader><CardTitle>Profil Kader</CardTitle></CardHeader>
         <CardContent className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
               <img src={user?.imageUrl} alt="Profile" className="w-16 h-16 rounded-full border" />
               <div>
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <p className="text-gray-500 text-sm">Kader Posyandu</p>
               </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={user?.primaryEmailAddress?.emailAddress} readOnly className="bg-gray-50"/>
               </div>
               <div className="space-y-2">
                  <Label>No HP</Label>
                  <Input defaultValue="08123456789" />
               </div>
            </div>
            <Button className="bg-[#d4e157] text-black hover:bg-[#c0ca4f]">Simpan Perubahan</Button>
         </CardContent>
      </Card>

      {/* Laporkan Kendala */}
      <Card className="border-red-200">
         <CardHeader className="bg-red-50">
            <CardTitle className="text-red-700 flex items-center gap-2">
               <AlertCircle className="w-5 h-5"/> Laporkan Kendala
            </CardTitle>
         </CardHeader>
         <CardContent className="pt-6 space-y-4">
            <p className="text-sm text-gray-600">Temukan masalah pada aplikasi? Laporkan ke Admin di sini.</p>
            <div className="space-y-2">
               <Label>Judul Masalah</Label>
               <Input placeholder="Contoh: Tidak bisa input data anak" />
            </div>
            <div className="space-y-2">
               <Label>Deskripsi Detail</Label>
               <Textarea placeholder="Jelaskan masalahnya..." />
            </div>
            <Button variant="destructive">Kirim Laporan</Button>
         </CardContent>
      </Card>

      <div className="flex justify-end">
         <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => signOut()}>
            <LogOut className="w-4 h-4 mr-2" /> Logout
         </Button>
      </div>
    </div>
  );
}