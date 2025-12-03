"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Camera } from "lucide-react";
import { toast } from "sonner";

export default function PengaturanPage() {
  
  const handleRequestChange = () => {
    // Simulasi request ke kader
    toast.success("Permintaan Terkirim", {
        description: "Permintaan ubah data telah dikirim ke Kader untuk diverifikasi."
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 border-b">
         <h1 className="text-2xl font-bold text-[#1abc9c]">Pengaturan</h1>
         <div className="flex gap-4 mt-4 border-b w-fit px-2">
            <span className="text-[#1abc9c] border-b-2 border-[#1abc9c] pb-2 font-medium cursor-pointer">
                <User className="w-4 h-4 inline mr-2" /> Profil
            </span>
         </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm border m-4">
         <div className="flex flex-col md:flex-row gap-12">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
                <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-6xl text-gray-500 relative">
                    D
                    <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow border cursor-pointer">
                        <Camera className="w-4 h-4 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-gray-600">Nama Lengkap</Label>
                        <Input defaultValue="Dini Andini" readOnly className="bg-white border-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-600">Email</Label>
                        <Input defaultValue="andini25@gmail.com" readOnly className="bg-white border-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-600">No. Telepon</Label>
                        <Input defaultValue="081234567890" readOnly className="bg-white border-gray-200" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-gray-600">Role</Label>
                        <Input defaultValue="User" readOnly className="bg-white border-gray-200" />
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        onClick={handleRequestChange}
                        className="bg-[#d4e157] hover:bg-[#c0ca4f] text-black font-medium px-8"
                    >
                        Simpan Perubahan
                    </Button>
                    <p className="text-xs text-gray-400 mt-2">* Data bersifat read-only. Klik simpan untuk mengajukan perubahan ke Kader.</p>
                </div>
            </div>

         </div>
      </div>
    </div>
  );
}