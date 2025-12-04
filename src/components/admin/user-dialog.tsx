"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { createFullUser, updateUserProfile } from "@/app/actions/admin-actions";
import { toast } from "sonner";
import { Plus, Pencil, Loader2 } from "lucide-react";

interface UserDialogProps {
  mode: "create" | "edit";
  user?: any;
}

export function UserDialog({ mode, user }: UserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    
    // Tambahkan ID jika mode edit
    if (mode === "edit" && user) {
      formData.append("id", user.id);
    }

    let result;
    if (mode === "create") {
      result = await createFullUser(formData);
    } else {
      result = await updateUserProfile(formData);
    }

    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-[#1abc9c] hover:bg-[#16a085]">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Akun
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tambah Akun Baru" : "Edit Data Akun"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {/* NIK */}
          <div className="grid gap-2">
            <Label htmlFor="nik">NIK</Label>
            <Input
              id="nik"
              name="nik"
              defaultValue={user?.nik}
              required
              placeholder="16 digit NIK"
            />
          </div>

          {/* NAMA LENGKAP */}
          <div className="grid gap-2">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              id="nama"
              name="nama"
              defaultValue={user?.nama_lengkap}
              required
            />
          </div>

          {/* USERNAME (Sekarang Bisa Diedit) */}
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              name="username" 
              defaultValue={user?.username}
              required 
            />
          </div>

          {/* EMAIL (Sekarang Bisa Diedit) */}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              defaultValue={user?.email} // Perlu data email dari props user
              required 
            />
          </div>

          {/* PASSWORD */}
          <div className="grid gap-2">
            <Label htmlFor="password">
              Password {mode === "edit" ? "(Opsional)" : ""}
            </Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required={mode === "create"} // Wajib hanya saat create
              placeholder={mode === "edit" ? "Isi hanya jika ingin ganti password" : ""}
            />
          </div>

          {/* NO TELEPON */}
          <div className="grid gap-2">
            <Label htmlFor="telepon">No. Telepon</Label>
            <Input
              id="telepon"
              name="telepon"
              defaultValue={user?.no_telepon}
            />
          </div>

          {/* ROLE & STATUS (Dua-duanya muncul) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" required defaultValue={user?.role || "kader"}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="kader">Kader</SelectItem>
                  <SelectItem value="orangtua">Orang Tua</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={user?.status || "Aktif"}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-[#1abc9c]">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}