"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User, Users, RefreshCw, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Link from "next/link";

interface LoginFormProps {
  onForgotPassword: () => void;
}

export function LoginForm({ onForgotPassword }: LoginFormProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [otpCode, setOtpCode] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // State untuk MFA
  const [needs2FA, setNeeds2FA] = useState(false);
  const [currentStrategy, setCurrentStrategy] = useState<string>(""); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);

    // Validasi Role wajib dipilih untuk login awal
    if (!role && !needs2FA) {
        toast.error("Role Kosong", { description: "Silakan pilih Role terlebih dahulu." });
        setLoading(false);
        return;
    }

    try {
      let result;
      
      if (needs2FA) {
        // --- LOGIKA TAHAP 2: VERIFIKASI OTP ---
        result = await signIn.attemptSecondFactor({
          strategy: currentStrategy as any,
          code: otpCode,
        });
      } else {
        // --- LOGIKA TAHAP 1: LOGIN PASSWORD ---
        // Clerk otomatis mendeteksi apakah 'identifier' itu email atau username
        result = await signIn.create({
          identifier: identifier,
          password,
        });
      }

      // --- CEK HASIL LOGIN ---
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push(`/${role}/dashboard`); 
        toast.success("Login Berhasil", { description: `Selamat datang, ${role}!` });
      } 
      else if (result.status === "needs_second_factor") {
        // Tangani jika butuh 2FA (MFA)
        const factors = result.supportedSecondFactors || [];
        const emailFactor = factors.find((f) => f.strategy === "email_code");
        const phoneFactor = factors.find((f) => f.strategy === "phone_code");
        const targetFactor = emailFactor || phoneFactor;

        if (targetFactor) {
            setCurrentStrategy(targetFactor.strategy);
            // KIRIM KODE OTP
            await signIn.prepareSecondFactor({
                strategy: targetFactor.strategy as any,
                emailAddressId: (targetFactor as any).emailAddressId,
                phoneNumberId: (targetFactor as any).phoneNumberId,
            });
            setNeeds2FA(true);
            const methodMsg = targetFactor.strategy === "email_code" ? "Email" : "SMS/HP";
            toast.info("Verifikasi Tambahan", { description: `Kode OTP telah dikirim via ${methodMsg}. Silakan cek.` });
        } else {
             const totpFactor = factors.find((f) => f.strategy === "totp");
             if (totpFactor) {
                 setCurrentStrategy("totp");
                 setNeeds2FA(true);
                 toast.info("Verifikasi Authenticator", { description: "Masukkan kode dari aplikasi Authenticator Anda." });
             } else {
                 toast.error("Gagal", { description: "Metode verifikasi tidak didukung. Hubungi admin." });
             }
        }
      }
      else {
        toast.error("Gagal Masuk", { description: `Status: ${result.status}` });
      }

    } catch (err: any) {
      console.error("Login error:", err);
      let errorMsg = "Terjadi kesalahan.";
      
      // Penanganan Error 422 (Password Breach / Invalid)
      if (err.errors?.[0]?.code === "form_password_pwned") {
        errorMsg = "Password ini tidak aman (ditemukan dalam kebocoran data). Mohon reset password Anda.";
      }
      else if (err.errors?.[0]?.code === "form_password_incorrect") {
        errorMsg = "Kata sandi salah.";
      }
      else if (err.errors?.[0]?.code === "verification_code_invalid") {
        errorMsg = "Kode OTP salah.";
      }
      else if (err.errors?.[0]?.code === "form_identifier_not_found") {
        errorMsg = "Akun tidak ditemukan.";
      }
      
      toast.error("Gagal Login", { description: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // --- TAMPILAN JIKA BUTUH OTP (Sederhana & Fokus) ---
  if (needs2FA) {
    return (
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden my-8 border border-gray-200">
          <div className="bg-[#1abc9c] p-4 text-center text-white flex items-center justify-center gap-2">
            <Lock className="w-6 h-6" />
            <h2 className="text-xl font-bold">Verifikasi Keamanan</h2>
          </div>
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                        Demi keamanan, masukkan kode verifikasi yang baru saja dikirimkan.
                    </p>
                </div>
                <div className="space-y-2">
                    <Input 
                    type="text" 
                    placeholder="123456" 
                    className="h-14 text-center text-2xl tracking-[0.5em] font-bold rounded-lg border-gray-300 focus:border-[#1abc9c] focus:ring-[#1abc9c]"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    autoFocus
                    required
                    maxLength={6}
                    />
                </div>
                <Button type="submit" className="w-full bg-[#1abc9c] hover:bg-[#16a085] h-12 rounded-lg text-lg font-medium shadow-md transition-all">
                    {loading ? "Memproses..." : "Verifikasi & Masuk"}
                </Button>
                
                <div className="text-center pt-4">
                    <button 
                        type="button" 
                        onClick={() => window.location.reload()} 
                        className="flex items-center justify-center gap-2 mx-auto text-sm text-gray-500 hover:text-[#1abc9c] transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" /> Batalkan & Login Ulang
                    </button>
                </div>
            </form>
        </div>
      </div>
    )
  }

  // --- TAMPILAN LOGIN UTAMA ---
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden my-8 border border-gray-100">
      {/* Header Hijau */}
      <div className="bg-[#1abc9c] p-6 text-center text-white flex flex-col items-center justify-center gap-3">
        <div className="bg-white/20 p-3 rounded-full">
            <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold tracking-wide">Masuk ke SIPOCEM</h2>
      </div>

      {/* Logo SIPOCEM */}
      <div className="flex flex-col items-center justify-center pt-8 pb-2">
           <div className="flex items-center gap-2">
             <Sprout className="w-8 h-8 text-[#1abc9c]" /> 
             <span className="text-3xl font-bold text-[#d4e157] tracking-wider drop-shadow-sm">SIPOCEM</span>
           </div>
      </div>

      {/* Container Form */}
      <div className="p-8 pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Username / Email */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#1abc9c] text-base font-semibold">
              <User className="w-5 h-5" /> Username / Email
            </Label>
            <Input 
              type="text" 
              placeholder="Contoh: kader123 atau nama@email.com" 
              className="h-12 text-base rounded-lg border-gray-300 focus-visible:ring-[#1abc9c] focus-visible:border-[#1abc9c] px-4 shadow-sm"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          {/* Input Password */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#1abc9c] text-base font-semibold">
              <Lock className="w-5 h-5" /> Kata Sandi
            </Label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Masukkan kata sandi anda" 
                className="h-12 text-base pr-12 rounded-lg border-gray-300 focus-visible:ring-[#1abc9c] focus-visible:border-[#1abc9c] px-4 shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1abc9c] transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Select Role */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#1abc9c] text-base font-semibold">
              <Users className="w-5 h-5" /> Role
            </Label>
            <Select onValueChange={setRole} value={role}>
              <SelectTrigger className="h-12 text-base rounded-lg border-gray-300 focus:ring-[#1abc9c] focus:border-[#1abc9c] px-4 text-gray-600 font-medium shadow-sm">
                <SelectValue placeholder="Pilih Role Anda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user" className="py-3 cursor-pointer">User / Masyarakat</SelectItem>
                <SelectItem value="kader" className="py-3 cursor-pointer">Kader Posyandu</SelectItem>
                <SelectItem value="admin" className="py-3 cursor-pointer">Administrator</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Checkbox & Forgot Password */}
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="data-[state=checked]:bg-[#1abc9c] data-[state=checked]:border-[#1abc9c]" />
              <label htmlFor="remember" className="text-sm font-medium text-gray-500 cursor-pointer select-none">
                Ingat saya
              </label>
            </div>
            <button type="button" onClick={onForgotPassword} className="text-sm font-semibold text-[#1abc9c] hover:underline hover:text-[#16a085] transition-colors">
              Lupa Password?
            </button>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full bg-[#1abc9c] hover:bg-[#16a085] text-white h-14 text-lg font-bold rounded-lg mt-4 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5" disabled={loading}>
            {loading ? "Memproses..." : "Masuk Sekarang"}
          </Button>

          {/* Footer Link */}
          <div className="text-center text-sm text-gray-500 mt-6 font-medium">
            Belum punya akun? <Link href="/sign-up" className="text-[#1abc9c] font-bold hover:underline ml-1">Daftar disini</Link>
          </div>
        </form>
      </div>
    </div>
  );
}