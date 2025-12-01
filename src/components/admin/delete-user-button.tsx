"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2, X } from "lucide-react";
import { deleteAccountAction } from "@/app/actions/admin-actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteUserButton({ userId, userName }: { userId: string, userName: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteAccountAction(userId);
    setLoading(false);

    if (result.success) {
      toast.success("Terhapus", { description: "Akun berhasil dihapus." });
      setOpen(false);
    } else {
      toast.error("Gagal", { description: result.error });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 border-red-200 bg-red-50 hover:bg-red-100">
          <Trash2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        {/* Header Hijau */}
        <div className="bg-[#1abc9c] p-4 flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">Hapus Akun?</DialogTitle>
            <DialogClose className="text-white hover:bg-white/20 rounded-full p-1">
                <X className="w-5 h-5" />
            </DialogClose>
        </div>

        <div className="p-6 text-center">
            <p className="text-gray-700 mb-6">
                Apakah Anda yakin ingin menghapus akun <b>{userName}</b>? <br/>
                Tindakan ini tidak dapat dibatalkan.
            </p>

            <div className="flex justify-center gap-4">
                <Button 
                    variant="default" 
                    className="bg-[#17a2b8] hover:bg-[#138496] px-8"
                    onClick={() => setOpen(false)}
                >
                    Batal
                </Button>
                <Button 
                    variant="outline"
                    className="border-[#17a2b8] text-[#17a2b8] hover:bg-blue-50 px-8"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? "Menghapus..." : "Hapus"}
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}