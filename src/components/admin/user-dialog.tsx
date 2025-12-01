"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccountAction, updateAccountAction } from "@/app/actions/admin-actions";
import { toast } from "sonner";
import { Plus, Pencil, X, Loader2 } from "lucide-react";

interface UserDialogProps {
  mode: "create" | "edit";
  user?: any;
}

export function UserDialog({ mode, user }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset form saat modal dibuka/tutup
  useEffect(() => {
    // Logic reset state tambahan jika diperlukan
  }, [open]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    
    const formData = new FormData(event.currentTarget);
    
    if (mode === "edit" && user) {
        formData.append("id", user.id);
    }

    const result = mode === "create" 
        ? await createAccountAction(formData) 
        : await updateAccountAction(formData);

    setLoading(false);

    if (result.error) {
      toast.error("Gagal", { description: result.error });
    } else {
      toast.success("Berhasil", { description: `Data berhasil ${mode === "create" ? "disimpan" : "diperbarui"}` });
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-[#e4d80e] hover:bg-[#cfc20a] text-black font-semibold shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Tambah Akun
          </Button>
        ) : (
          <Button variant="outline" size="icon" className="h-8 w-8 text-blue-500 border-blue-200 bg-blue-50 hover:bg-blue-100">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      
      {/* Container Modal tanpa tombol close bawaan */}
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0 [&>button]:hidden">
        
        {/* HEADER HIJAU */}
        <div className="bg-[#1abc9c] p-4 flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">
                {mode === "create" ? "Tambah Akun" : "Edit Akun"}
            </DialogTitle>
            
            <DialogClose className="text-white hover:bg-white/20 rounded-full p-1 transition focus:outline-none">
                <X className="w-5 h-5" />
            </DialogClose>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* --- KOLOM KIRI (NIK, Username, Email, Peran) --- */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">NIK</Label>
                    <Input name="nik" defaultValue={user?.nik} className="h-11 border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">Username</Label>
                    <Input name="username" defaultValue={user?.username} className="h-11 border-gray-300" required />
                </div>
                {/* FIELD EMAIL (BARU DITAMBAHKAN) */}
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">Email</Label>
                    <Input 
                        name="email" 
                        type="email"
                        defaultValue={user?.email} 
                        className="h-11 border-gray-300 disabled:bg-gray-100" 
                        required 
                        disabled={mode === 'edit'} // Email biasanya tidak boleh diedit sembarangan
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">Peran</Label>
                    <Select name="role" defaultValue={user?.role || "user"}>
                        <SelectTrigger className="h-11 border-gray-300">
                            <SelectValue placeholder="Pilih Peran" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="kader">Kader</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* --- KOLOM KANAN (Nama, HP, Password, Status) --- */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">Nama Lengkap</Label>
                    <Input name="nama" defaultValue={user?.nama_lengkap} className="h-11 border-gray-300" required />
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">No.Hp</Label>
                    <Input name="no_hp" defaultValue={user?.no_telepon} className="h-11 border-gray-300" />
                </div>
                {/* PASSWORD PINDAH KE KANAN SESUAI GAMBAR */}
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">Password {mode === 'edit' && '(Opsional)'}</Label>
                    <Input 
                        name="password" 
                        type="password" 
                        className="h-11 border-gray-300" 
                        required={mode === 'create'}
                        minLength={8}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="font-semibold text-gray-700">Status</Label>
                    <Select name="status" defaultValue={user?.status || "Aktif"}>
                        <SelectTrigger className="h-11 border-gray-300">
                            <SelectValue placeholder="Pilih Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Aktif">Aktif</SelectItem>
                            <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex justify-end gap-3 mt-4 pt-4">
             <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-[#17a2b8] text-white hover:bg-[#138496] border-none px-6 h-10">
                Batal
             </Button>
             <Button type="submit" disabled={loading} className="bg-white text-[#1abc9c] border border-[#1abc9c] hover:bg-gray-50 px-6 h-10">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Simpan"}
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}