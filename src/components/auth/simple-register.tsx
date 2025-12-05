// File: src/components/auth/simple-register.jsx

"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sprout, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

// Skema validasi tetap sama
const simpleRegisterSchema = z.object({
  nama_lengkap: z.string().min(1, "Nama wajib diisi"),
  nik: z.string().regex(/^\d+$/, "NIK harus angka").length(16, "NIK harus 16 digit"),
  username: z.string().min(3, "Username minimal 3 karakter").regex(/^[a-zA-Z0-9_]+$/, "Hanya huruf, angka, dan underscore"),
  email: z.string().email("Email tidak valid"),
  no_telepon: z.string().min(10, "Nomor HP minimal 10 digit"),
  alamat: z.string().min(5, "Alamat terlalu pendek"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

type FormData = z.infer<typeof simpleRegisterSchema>;

export function SimpleRegister() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(simpleRegisterSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      // 1. Buat percobaan pendaftaran di Clerk
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
        username: data.username,
        firstName: data.nama_lengkap,
        // --- TAMBAHKAN INI ---
        // Simpan semua data tambahan ke dalam unsafeMetadata
        unsafeMetadata: {
          nik: data.nik,
          no_telepon: data.no_telepon,
          alamat: data.alamat,
        },
      });

      // 2. Siapkan verifikasi email
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      
      toast.success("Kode Verifikasi Terkirim!", { description: "Silakan cek email Anda." });
      
      // Arahkan user ke halaman verifikasi
      router.push("/sign-up/verify");

    } catch (err: any) {
      console.error("Sign Up Error:", err);
      const msg = err.errors?.[0]?.message || err.message || "Terjadi kesalahan saat mendaftar.";
      toast.error("Pendaftaran Gagal", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  // --- Bagian JSX (form) TIDAK BERUBAH ---
  // (Saya tidak menulis ulang bagian form untuk menghemat ruang, gunakan kode JSX yang sebelumnya)
  return (
    <div className="w-full max-w-lg border border-gray-300 rounded-lg shadow-lg bg-white overflow-hidden my-8">
      {/* Header */}
      <div className="bg-[#1abc9c] p-6 text-center">
         <div className="flex justify-center items-center gap-2 mb-2">
            <Sprout className="h-8 w-8 text-yellow-300" /> 
            <span className="text-2xl font-bold text-white tracking-wider">SIPOCEM</span>
         </div>
         <p className="text-white/90 text-sm">Pendaftaran Akun Baru</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-4">
        {/* Nama & NIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input {...register("nama_lengkap")} placeholder="Nama sesuai KTP" />
                {errors.nama_lengkap && <p className="text-red-500 text-xs">{errors.nama_lengkap.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>NIK (16 Digit)</Label>
                <Input {...register("nik")} placeholder="320..." maxLength={16} />
                {errors.nik && <p className="text-red-500 text-xs">{errors.nik.message}</p>}
            </div>
        </div>

        {/* Username & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Username</Label>
                <Input {...register("username")} placeholder="user123" />
                {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register("email")} type="email" placeholder="nama@email.com" />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
        </div>

        {/* No HP & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>No. Telepon (WA)</Label>
                <Input {...register("no_telepon")} placeholder="08..." />
                {errors.no_telepon && <p className="text-red-500 text-xs">{errors.no_telepon.message}</p>}
            </div>
            <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                    <Input 
                        {...register("password")} 
                        type={showPassword ? "text" : "password"} 
                        placeholder="******" 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
        </div>

        {/* Alamat */}
        <div className="space-y-2">
            <Label>Alamat Lengkap</Label>
            <Input {...register("alamat")} placeholder="Jalan, RT/RW, Kelurahan" />
            {errors.alamat && <p className="text-red-500 text-xs">{errors.alamat.message}</p>}
        </div>

        <div className="pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-[#1abc9c] hover:bg-[#16a085] font-bold h-11 text-white">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Daftar Sekarang"}
            </Button>
        </div>
      </form>
    </div>
  );
}