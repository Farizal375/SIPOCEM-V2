"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
// Import fungsi yang sudah pasti ada di file action di atas
import { deleteIbuAction, deletePemeriksaanIbuAction } from "@/app/actions/kader-actions"; 

// --- TOMBOL HAPUS DATA IBU ---
export function DeleteIbuButton({ id, nama, variant = "icon" }: { id: string, nama: string, variant?: "icon" | "with-text" }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteIbuAction(id);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error("Gagal", { description: res.error });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "icon" ? (
            <Button size="icon" variant="outline" className="h-8 w-8 text-red-500 border-red-200 bg-red-50 hover:bg-red-100">
                <Trash2 className="w-4 h-4" />
            </Button>
        ) : (
            <Button variant="destructive" className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100">
                <Trash2 className="w-4 h-4 mr-2" /> Hapus Data Ibu
            </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Ibu?</AlertDialogTitle>
          <AlertDialogDescription>
            Menghapus data <strong>{nama}</strong> akan menghapus seluruh riwayat pemeriksaan terkait.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} className="bg-red-600" disabled={loading}>
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />} Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- TOMBOL HAPUS RIWAYAT PEMERIKSAAN ---
export function DeletePemeriksaanButton({ id, ibuId }: { id: string, ibuId: string }) {
    const [loading, setLoading] = useState(false);
  
    const handleDelete = async () => {
      setLoading(true);
      const res = await deletePemeriksaanIbuAction(id, ibuId);
      setLoading(false);
  
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error("Gagal", { description: res.error });
      }
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus riwayat ini?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); handleDelete(); }} className="bg-red-600" disabled={loading}>
              {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />} Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
}