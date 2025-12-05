"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createAnakAction, updateAnakAction } from "@/app/actions/kader-actions";

interface AnakDialogProps {
  mode: "create" | "edit";
  data?: any;
  listIbu: any[]; 
}

export function AnakDialog({ mode, data, listIbu }: AnakDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    // Pastikan ID Anak terkirim saat edit
    if (mode === "edit" && data?.id) {
        formData.append("id", data.id);
    }

    // Validasi Sederhana: Cek apakah Ibu dipilih
    const ibuId = formData.get("ibu_id");
    if (!ibuId) {
        toast.error("Wajib memilih Nama Ibu (Orang Tua).");
        setLoading(false);
        return;
    }

    const result = mode === "create" 
        ? await createAnakAction(formData) 
        : await updateAnakAction(formData);
    
    setLoading(false);

    if (result.success) {
        toast.success(result.message);
        setOpen(false);
    } else {
        toast.error("Gagal", { description: result.error });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-[#d4e157] text-black hover:bg-[#c0ca4f]">
            <Plus className="w-4 h-4 mr-2" /> Tambah Data Anak
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:bg-blue-50">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0 [&>button]:hidden">
        <div className="bg-[#1abc9c] p-4 flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">
                {mode === "create" ? "Tambah Data Anak" : "Edit Data Anak"}
            </DialogTitle>
            <DialogClose className="text-white hover:bg-white/20 rounded-full p-1 transition">
                <X className="w-5 h-5" />
            </DialogClose>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* KOLOM KIRI (UI Asli) */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label>NIK Anak</Label>
                    <Input name="nik" defaultValue={data?.nik} className="h-11 border-gray-300" placeholder="Nomor Induk Kependudukan" />
                </div>
                <div className="space-y-2">
                    <Label>Nama Lengkap Anak</Label>
                    <Input name="nama" defaultValue={data?.nama} required className="h-11 border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label>Jenis Kelamin</Label>
                    <Select name="jk" defaultValue={data?.jk || "L"}>
                        <SelectTrigger className="h-11 border-gray-300"><SelectValue placeholder="Pilih JK" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="L">Laki-laki</SelectItem>
                            <SelectItem value="P">Perempuan</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>Nama Ayah</Label>
                    <Input name="nama_ayah" defaultValue={data?.nama_ayah} className="h-11 border-gray-300" />
                </div>
            </div>

            {/* KOLOM KANAN (UI Asli) */}
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[#1abc9c] font-bold">Pilih Ibu (Orang Tua)</Label>
                    {/* DROP DOWN PILIH IBU - Mengirimkan value 'ibu_id' ke Action */}
                    <Select name="ibu_id" defaultValue={data?.ibu_id} required>
                        <SelectTrigger className="h-11 border-gray-300 bg-yellow-50">
                            <SelectValue placeholder="-- Cari Nama Ibu --" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                            {listIbu && listIbu.length > 0 ? (
                                listIbu.map((ibu) => (
                                    <SelectItem key={ibu.id} value={ibu.id}>
                                        {ibu.nama_lengkap} (NIK: {ibu.nik})
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="p-2 text-sm text-gray-500 text-center">
                                    Belum ada data ibu. <br/> Silakan input data ibu terlebih dahulu.
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>Tempat Lahir</Label>
                    <Input name="tempat_lahir" defaultValue={data?.tempat_lahir} className="h-11 border-gray-300" />
                </div>
                <div className="space-y-2">
                    <Label>Tanggal Lahir</Label>
                    <Input name="tgl_lahir" type="date" defaultValue={data?.tgl_lahir} required className="h-11 border-gray-300" />
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-2 border-t">
             <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
             <Button type="submit" disabled={loading} className="bg-[#1abc9c] hover:bg-[#16a085] px-6">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan Data"}
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}