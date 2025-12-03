"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createJadwalAction, updateJadwalAction } from "@/app/actions/kader-actions";

export function JadwalDialog({ mode, data }: { mode: "create" | "edit", data?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (mode === "edit" && data?.id) formData.append("id", data.id);

    const result = mode === "create" ? await createJadwalAction(formData) : await updateJadwalAction(formData);
    setLoading(false);

    if (result.error) toast.error("Gagal", { description: result.error });
    else {
        toast.success("Jadwal berhasil disimpan");
        setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
            <Button className="bg-[#1abc9c] hover:bg-[#16a085]"><Plus className="w-4 h-4 mr-2"/> Buat Jadwal Baru</Button>
        ) : (
            <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden gap-0 [&>button]:hidden">
        <div className="bg-[#1abc9c] p-4 flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">
                {mode === "create" ? "Tambah Jadwal Posyandu" : "Edit Jadwal"}
            </DialogTitle>
            <DialogClose className="text-white hover:bg-white/20 rounded-full p-1 transition">
                <X className="w-5 h-5" />
            </DialogClose>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
                <Label>Nama Kader</Label>
                <Input name="kader" defaultValue={data?.kader} className="h-11 border-gray-300" required />
            </div>
            <div className="space-y-2">
                <Label>Hari/Tanggal</Label>
                <Input name="tanggal" type="date" defaultValue={data?.tanggal} className="h-11 border-gray-300" required />
            </div>
            <div className="space-y-2">
                <Label>Nama Bidan</Label>
                <Input name="bidan" defaultValue={data?.bidan} className="h-11 border-gray-300" />
            </div>
            <div className="space-y-2">
                <Label>Kegiatan / Imunisasi</Label>
                <Input name="kegiatan" defaultValue={data?.kegiatan} className="h-11 border-gray-300" placeholder="Contoh: Campak, Polio" />
            </div>
            <div className="space-y-2">
                <Label>Kontak WhatsApp</Label>
                <Input name="kontak" defaultValue={data?.kontak} className="h-11 border-gray-300" />
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                <Button type="submit" disabled={loading} className="bg-[#1abc9c] hover:bg-[#16a085] px-6">
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan"}
                </Button>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}