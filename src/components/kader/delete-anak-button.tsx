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
import { deleteAnakAction } from "@/app/actions/kader-actions";

export function DeleteAnakButton({ id, nama }: { id: string, nama: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const res = await deleteAnakAction(id);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error("Gagal menghapus", { description: res.error });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-8 w-8 text-red-500 border-red-200 bg-red-50 hover:bg-red-100">
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Data Anak?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan menghapus data anak <strong>{nama}</strong>. Data yang dihapus tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={(e) => { e.preventDefault(); handleDelete(); }} 
            className="bg-red-600 hover:bg-red-700"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}