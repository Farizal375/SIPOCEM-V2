
"use client";

import { useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";

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
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        toast.success("Verifikasi Berhasil!", { description: "Akun Anda telah aktif." });
        router.push("/user/dashboard");
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
        toast.error("Verifikasi Gagal", { description: "Silakan coba lagi." });
      }
    } catch (err: any) {
      console.error("Error:", err.errors);
      toast.error("Kode Salah", { description: err.errors?.[0]?.message || "Kode verifikasi tidak valid." });
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