"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, Sprout, CircleUserRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const PRIMARY_COLOR = "#00b894"; 
  const TEXT_COLOR = "#00b894";
  const LOGO_COLOR = "#d4e157";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    if (!email || !password) {
      toast.warning("Email dan Password wajib diisi.");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.create({ 
        identifier: email, 
        password 
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        
        toast.success("Login Berhasil!", {
          description: "Sedang mengalihkan ke dashboard..."
        });
        
        // Redirect ke root (/). Middleware akan menangani sisanya.
        router.push("/"); 
        router.refresh();

      } else if (result.status === "needs_first_factor") {
        // INI MENANGKAP KASUS VERIFIKASI YANG ANDA ALAMI
        console.log("Login status:", result.status);
        toast.warning("Akun Belum Terverifikasi", {
            description: "Matikan 'Verify at sign-up' di Dashboard Clerk agar login bisa otomatis, atau cek email untuk kode OTP."
        });
      } else {
        console.log("Login status:", result.status);
        toast.info(`Status Login: ${result.status}`, {
            description: "Verifikasi tambahan diperlukan oleh sistem keamanan."
        });
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      const errorCode = err.errors?.[0]?.code;
      const errorMessage = err.errors?.[0]?.message;

      if (errorCode === "form_password_pwned") {
        toast.error("Password Terdeteksi Bocor", {
          description: "Matikan 'Breached Password Detection' di Clerk Dashboard > Security jika ingin melewati peringatan ini."
        });
      } else if (errorCode === "form_password_incorrect") {
        toast.error("Password Salah", {
            description: "Periksa kembali kata sandi Anda."
        });
      } else if (errorCode === "form_identifier_not_found") {
        toast.error("Akun Tidak Ditemukan", {
            description: "Email ini belum terdaftar."
        });
      } else if (errorCode === "strategy_for_user_invalid") {
         toast.error("Akses Ditolak", { description: "Akun Anda mungkin belum aktif sepenuhnya."});
      } else {
        toast.error("Gagal Masuk", {
          description: errorMessage || "Terjadi kesalahan sistem."
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden font-sans my-8">
      {/* Header Hijau */}
      <div className="py-6 flex items-center justify-center gap-3 text-white shadow-md" style={{ backgroundColor: PRIMARY_COLOR }}>
        <div className="border-2 border-white/80 rounded-full p-1 bg-white/10">
            <CircleUserRound className="w-7 h-7 text-white" />
        </div>
        <h2 className="text-xl font-medium tracking-wide">Masuk ke SIPOCEM</h2>
      </div>

      <div className="p-8 pb-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center gap-2 mb-2">
                <Sprout className="w-10 h-10" fill={PRIMARY_COLOR} stroke={PRIMARY_COLOR} />
                <span className="text-4xl font-serif font-bold tracking-wide" style={{ color: LOGO_COLOR }}>SIPOCEM</span>
            </div>
            <p className="text-gray-500 text-sm">Sistem Informasi Posyandu Cempaka</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-medium" style={{ color: TEXT_COLOR }}>
              <User className="w-5 h-5" /> Email
            </Label>
            <Input 
              className="h-12 text-base border-gray-300 focus-visible:ring-[#00b894] focus-visible:border-[#00b894] transition-all"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              type="email"
              placeholder="nama@email.com" 
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-base font-medium" style={{ color: TEXT_COLOR }}>
              <Lock className="w-5 h-5" /> Kata Sandi
            </Label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                className="h-12 text-base border-gray-300 pr-12 focus-visible:ring-[#00b894] focus-visible:border-[#00b894] transition-all"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="Masukkan kata sandi" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00b894] transition-colors p-1">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-gray-400 w-4 h-4 rounded data-[state=checked]:bg-[#00b894] data-[state=checked]:border-[#00b894]" />
              <label htmlFor="remember" className="text-sm font-normal text-gray-600 cursor-pointer select-none">Ingat saya</label>
            </div>
            <Link href="/forgot-password" className="text-sm font-medium text-[#00b894] hover:underline hover:text-[#008f72] transition-colors">
                Lupa Password?
            </Link>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 text-lg font-bold text-white shadow-md mt-6 rounded-md hover:brightness-110 transition-all" 
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            {loading ? <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Memproses...</> : "Masuk"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-400">Atau</span>
            </div>
          </div>

          <div className="text-center">
             <span className="text-gray-600">Belum punya akun? </span>
             <Link href="/sign-up" className="text-[#00b894] font-bold hover:underline ml-1">
                Daftar sekarang
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
}