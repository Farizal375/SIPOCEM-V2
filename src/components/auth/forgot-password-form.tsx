"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// PERBAIKAN: Import toast dari sonner
import { toast } from "sonner"; 
import { ArrowLeft, Mail, Key, Lock } from "lucide-react";

interface ForgotPasswordProps {
  onBack: () => void;
}

export function ForgotPasswordForm({ onBack }: ForgotPasswordProps) {
  const { isLoaded, signIn, setActive } = useSignIn();
  // HAPUS: const { toast } = useToast();
  
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);

  // Langkah 1: Kirim Kode ke Email
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);

    try {
      const existingAttempt = await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      
      if (existingAttempt.status === "needs_first_factor") {
          setStep("code");
          // Gunakan toast.success dari Sonner
          toast.success("Kode Terkirim", { 
            description: "Cek email anda untuk kode verifikasi (OTP)." 
          });
      }
    } catch (err: any) {
      console.error(err);
      // Gunakan toast.error dari Sonner
      toast.error("Gagal Mengirim Kode", { 
        description: err.errors?.[0]?.message || "Email tidak ditemukan atau terjadi kesalahan." 
      });
    } finally {
      setLoading(false);
    }
  };

  // Langkah 2: Verifikasi Kode & Set Password Baru
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setLoading(true);

    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password: newPassword,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        
        toast.success("Password Berhasil Diubah", { 
          description: "Anda telah login secara otomatis." 
        });

        // Redirect ke dashboard setelah delay singkat agar user membaca toast
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Gagal Reset Password", { 
        description: "Kode verifikasi salah atau sudah kadaluarsa." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="p-0 hover:bg-transparent text-gray-500 hover:text-gray-900 cursor-pointer"
        >
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
        </Button>
      </div>

      {step === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="text-center mb-6">
             <h3 className="text-xl font-bold text-[#1abc9c]">Reset Kata Sandi</h3>
             <p className="text-sm text-gray-600">Masukkan email yang terdaftar untuk menerima kode OTP.</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#1abc9c]">
               <Mail className="w-4 h-4" /> Email Terdaftar
            </Label>
            <Input 
                type="email" 
                placeholder="nama@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="h-12"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-[#1abc9c] hover:bg-[#16a085] h-12 cursor-pointer" 
            disabled={loading}
          >
            {loading ? "Mengirim..." : "Kirim Kode Reset"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleReset} className="space-y-4">
          <div className="text-center mb-6">
             <h3 className="text-xl font-bold text-[#1abc9c]">Buat Password Baru</h3>
             <p className="text-sm text-gray-600">Masukkan kode dari email dan password baru anda.</p>
          </div>
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#1abc9c]">
               <Key className="w-4 h-4" /> Kode Verifikasi (OTP)
            </Label>
            <Input 
                type="text" 
                placeholder="123456" 
                value={code} 
                onChange={(e) => setCode(e.target.value)} 
                required 
                className="h-12 text-center tracking-widest text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-[#1abc9c]">
               <Lock className="w-4 h-4" /> Kata Sandi Baru
            </Label>
            <Input 
                type="password" 
                placeholder="******" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                className="h-12"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-[#1abc9c] hover:bg-[#16a085] h-12 cursor-pointer" 
            disabled={loading}
          >
            {loading ? "Memproses..." : "Simpan Password Baru"}
          </Button>
        </form>
      )}
    </div>
  );
}