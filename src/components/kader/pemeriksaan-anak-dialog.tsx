"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createPemeriksaanAnakAction } from "@/app/actions/kader-actions";

export function PemeriksaanAnakDialog({ mode, data }: { mode: "create"|"edit", data?: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await createPemeriksaanAnakAction(formData);
    setLoading(false);

    if (result.error) toast.error("Gagal", { description: result.error });
    else {
        toast.success("Data pertumbuhan disimpan");
        setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-yellow-500 text-white hover:bg-yellow-600 shadow-sm">
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
            <DialogTitle className="text-lg font-semibold">Input Pertumbuhan Anak</DialogTitle>
            <DialogClose className="hover:bg-white/20 rounded-full p-1 transition"><X className="w-5 h-5" /></DialogClose>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-5">
             <div className="space-y-2"><Label>Tanggal</Label><Input name="tanggal" type="date" required className="h-10" /></div>
             <div className="space-y-2"><Label>Usia (Bulan)</Label><Input name="usia" type="number" className="h-10" /></div>
             <div className="space-y-2"><Label>Berat Badan (Kg)</Label><Input name="bb" type="number" step="0.1" className="h-10" /></div>
             <div className="space-y-2"><Label>Panjang/Tinggi (cm)</Label><Input name="tb" type="number" step="0.1" className="h-10" /></div>
             <div className="space-y-2"><Label>Lingkar Kepala</Label><Input name="lk" type="number" step="0.1" className="h-10" /></div>
             <div className="space-y-2"><Label>LiLA</Label><Input name="lila" type="number" step="0.1" className="h-10" /></div>
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