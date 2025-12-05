// File: src/components/auth/verify-form.jsx

"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
// --- TAMBAHKAN IMPORT INI ---
import { registerSimpleUserAction } from "@/app/actions/auth-actions";

export function VerifyForm() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Fungsi Verifikasi Kode
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    if (code.length !== 6) {
        toast.warning("Masukkan 6 digit kode verifikasi.");
        return;
    }

    setLoading(true);
    try {
      // 1. Coba verifikasi kode ke Clerk
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // 2. Cek status verifikasi
      if (completeSignUp.status === "complete") {
        
        // --- LOGIKA UNTUK MENYIMPAN KE SUPABASE DIMULAI DI SINI ---

        // 3. Dapatkan User ID asli dari Clerk
        const userId = completeSignUp.createdUserId;
        if (!userId) {
          throw new Error("Gagal mendapatkan User ID dari Clerk setelah verifikasi.");
        }

        // 4. Ambil kembali data yang disimpan di unsafeMetadata
        const metadata = signUp.unsafeMetadata || {};
        const profileData = {
          userId: userId, // User ID ini akan jadi PRIMARY KEY di Supabase
          nama_lengkap: signUp.firstName || "",
          email: signUp.emailAddress || "",
          username: signUp.username || "",
          nik: metadata.nik,
          no_telepon: metadata.no_telepon,
          alamat: metadata.alamat,
        };

        // 5. Simpan semua data ke Supabase via Server Action
        const dbResult = await registerSimpleUserAction(profileData);

        if (!dbResult.success) {
          // Jika gagal simpan ke DB, tampilkan error dari server action
          throw new Error(dbResult.error);
        }
        
        // --- LOGIKA SUPABASE SELESAI ---

        // 6. Jika semua berhasil, aktifkan sesi login user
        await setActive({ session: completeSignUp.createdSessionId });
        
        toast.success("Akun Anda Berhasil Dibuat!", { description: "Anda akan diarahkan ke dashboard." });
        
        // 7. Redirect ke Dashboard
        router.push("/user/dashboard"); // Pastikan route ini benar

      } else {
        // Jika status belum complete (kasus jarang)
        console.error(JSON.stringify(completeSignUp, null, 2));
        toast.error("Verifikasi Gagal", { description: "Status akun belum lengkap. Silakan coba lagi." });
      }
    } catch (err: any) {
      console.error("Verification Error:", err);
      // Tampilkan pesan error yang paling spesifik, baik dari Clerk atau dari Server Action
      const msg = err.errors?.[0]?.message || err.message || "Kode verifikasi tidak valid.";
      toast.error("Verifikasi Gagal", { description: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-t-4 border-t-[#1abc9c]">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-[#e0f2f1] p-3 rounded-full w-fit mb-2">
            <MailCheck className="w-8 h-8 text-[#1abc9c]" />
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">Verifikasi Email</CardTitle>
        <CardDescription>
            Kami telah mengirimkan 6 digit kode ke email Anda. <br/>
            Masukkan kode tersebut di bawah ini.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-6 flex flex-col items-center">
          
          {/* Input OTP 6 Digit */}
          <InputOTP maxLength={6} value={code} onChange={(value) => setCode(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="h-12 w-10 sm:w-12 text-lg border-gray-300" />
              <InputOTPSlot index={1} className="h-12 w-10 sm:w-12 text-lg border-gray-300" />
              <InputOTPSlot index={2} className="h-12 w-10 sm:w-12 text-lg border-gray-300" />
              <InputOTPSlot index={3} className="h-12 w-10 sm:w-12 text-lg border-gray-300" />
              <InputOTPSlot index={4} className="h-12 w-10 sm:w-12 text-lg border-gray-300" />
              <InputOTPSlot index={5} className="h-12 w-10 sm:w-12 text-lg border-gray-300" />
            </InputOTPGroup>
          </InputOTP>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-11 bg-[#1abc9c] hover:bg-[#16a085] text-white font-bold"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Verifikasi Akun"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}