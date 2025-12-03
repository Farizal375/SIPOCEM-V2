"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createPemeriksaanIbuAction } from "@/app/actions/kader-actions";

export function PemeriksaanIbuDialog({ mode, data }: { mode: "create"|"edit", data?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // if (data?.ibu_id) formData.append("ibu_id", data.ibu_id); // Kirim ID Ibu jika ada

    const result = await createPemeriksaanIbuAction(formData);
    setLoading(false);

    if (result.error) toast.error("Gagal", { description: result.error });
    else {
        toast.success("Pemeriksaan berhasil disimpan");
        setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-[#1abc9c] hover:bg-[#16a085] shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Input Data Bulan Ini
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0 [&>button]:hidden">
        <div className="bg-[#1abc9c] p-4 flex items-center justify-between text-white">
            <DialogTitle className="text-lg font-semibold">Input Pemeriksaan Rutin</DialogTitle>
            <DialogClose className="hover:bg-white/20 rounded-full p-1 transition"><X className="w-5 h-5" /></DialogClose>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Input Fields seperti sebelumnya ... */}
          <div className="grid md:grid-cols-3 gap-5">
             <div className="space-y-2"><Label>Tanggal Periksa</Label><Input name="tanggal" type="date" required className="h-10" /></div>
             <div className="space-y-2"><Label>Usia Kandungan (Mgg)</Label><Input name="usia_kandungan" type="number" className="h-10" /></div>
             <div className="space-y-2"><Label>Berat Badan (Kg)</Label><Input name="bb" type="number" step="0.1" className="h-10" /></div>
             <div className="space-y-2"><Label>Tensi</Label><Input name="tensi" placeholder="120/80" className="h-10" /></div>
             <div className="space-y-2"><Label>TFU (cm)</Label><Input name="tfu" type="number" className="h-10" /></div>
             <div className="space-y-2"><Label>DJJ (x/menit)</Label><Input name="djj" type="number" className="h-10" /></div>
             <div className="space-y-2"><Label>LiLA (cm)</Label><Input name="lila" type="number" step="0.1" className="h-10" /></div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t">
             <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
             <Button type="submit" disabled={loading} className="bg-[#1abc9c] hover:bg-[#16a085] px-8">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan"}
             </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}