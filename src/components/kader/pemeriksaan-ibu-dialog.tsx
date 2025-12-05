"use client";

import { useState } from "react";
// ... imports UI lainnya
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
// Import dari file yang sudah kita perbarui di poin 2
import { createPemeriksaanIbuAction } from "@/app/actions/kader-actions"; 

export function PemeriksaanIbuDialog({ mode, data, ibuId }: { mode: "create"|"edit", data?: any, ibuId?: string }) {
  // ... (Sisa kode komponen sama, pastikan logic create pakai createPemeriksaanIbuAction)
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (ibuId) formData.append("ibu_id", ibuId);

    const result = await createPemeriksaanIbuAction(formData);
    setLoading(false);

    if (result.success) {
        toast.success(result.message);
        setOpen(false);
    } else {
        toast.error("Gagal", { description: result.error });
    }
  };
  
  // ... Render UI ...
  return (
    <Dialog open={open} onOpenChange={setOpen}>
        {/* ... Trigger ... */}
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden gap-0 [&>button]:hidden">
            {/* ... Header ... */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* ... Inputs ... */}
                <div className="flex justify-end gap-3 pt-2 border-t">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                    <Button type="submit" disabled={loading} className="bg-[#1abc9c] hover:bg-[#16a085] px-8">
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Simpan"}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
  )
}