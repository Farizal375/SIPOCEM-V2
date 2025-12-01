"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, LogOut } from "lucide-react";

export default function PengaturanPage() {
  const { user } = useUser();
  const { signOut } = useClerk();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#1abc9c]">Pengaturan</h1>

      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div className="flex flex-col md:flex-row gap-8">
            
            {/* Bagian Foto Profil */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-gray-100">
                        <AvatarImage src={user.imageUrl} />
                        <AvatarFallback className="text-4xl bg-gray-200">
                            {user.firstName?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border hover:bg-gray-50">
                        <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Form Profil */}
            <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nama Lengkap</Label>
                        <Input value={user.fullName || ""} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={user.primaryEmailAddress?.emailAddress || ""} readOnly className="bg-gray-50" />
                    </div>
                    <div className="space-y-2">
                        <Label>Role</Label>
                        <Input value={(user.publicMetadata.role as string) || "Admin"} readOnly className="bg-gray-50" />
                    </div>
                </div>

                <div className="pt-4">
                    <Button 
                        onClick={() => signOut({ redirectUrl: '/' })}
                        className="bg-[#d4e157] hover:bg-[#c0ca4f] text-black font-bold px-8"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}