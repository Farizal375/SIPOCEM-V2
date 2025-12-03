"use client";

import { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Lock, User, Users, Sprout, CircleUserRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function LoginForm() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Styling Constants
  const PRIMARY_COLOR = "#00b894"; 
  const TEXT_COLOR = "#00b894";
  const LOGO_COLOR = "#d4e157";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    
    if (!role) {
      toast.warning("Role belum dipilih");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Login Berhasil");
        router.push("/dashboard"); 
      } else {
        toast.info("Cek email untuk verifikasi.");
      }
    } catch (err: any) {
      toast.error(err.errors?.[0]?.longMessage || "Gagal masuk.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden font-sans">
      
      {/* HEADER CARD */}
      <div className="py-5 flex items-center justify-center gap-2 text-white" style={{ backgroundColor: PRIMARY_COLOR }}>
        <div className="border-2 border-white rounded-full p-0.5">
            <CircleUserRound className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-normal tracking-wide">Masuk ke SIPOCEM</h2>
      </div>

      <div className="p-8 pb-10">
        {/* LOGO */}
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center gap-2">
                <Sprout className="w-8 h-8" fill={PRIMARY_COLOR} stroke={PRIMARY_COLOR} />
                <span className="text-3xl font-serif font-bold tracking-wide" style={{ color: LOGO_COLOR }}>SIPOCEM</span>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-lg font-normal" style={{ color: TEXT_COLOR }}>
              <User className="w-5 h-5 fill-current" /> Username / Email
            </Label>
            <Input 
              className="h-12 text-lg border-gray-400 focus-visible:ring-[#00b894]"
              value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Masukkan username anda" 
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-lg font-normal" style={{ color: TEXT_COLOR }}>
              <Lock className="w-5 h-5 fill-current" /> Kata Sandi
            </Label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} className="h-12 text-lg border-gray-400 pr-12 focus-visible:ring-[#00b894]"
                value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Masukkan kata sandi anda" 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-lg font-normal" style={{ color: TEXT_COLOR }}>
              <Users className="w-5 h-5 fill-current" /> Role
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="h-12 text-lg border-gray-400 text-gray-500"><SelectValue placeholder="Pilih Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="User" className="text-lg py-2 cursor-pointer">User</SelectItem>
                <SelectItem value="Kader" className="text-lg py-2 cursor-pointer">Kader</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" className="border-gray-400 w-5 h-5 rounded-full data-[state=checked]:bg-[#00b894] data-[state=checked]:border-[#00b894]" />
              <label htmlFor="remember" className="text-base font-normal text-[#00b894] cursor-pointer">Ingat saya</label>
            </div>
            {/* LINK KE PAGE FORGOT PASSWORD */}
            <Link href="/forgot-password" className="text-base font-normal text-[#00b894] hover:underline">Lupa Password?</Link>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 text-lg font-medium text-white shadow-none mt-4 rounded-md" style={{ backgroundColor: PRIMARY_COLOR }}>
            {loading ? "Memproses..." : "Masuk"}
          </Button>

          <div className="text-center mt-6">
             <span className="text-[#00b894]">Belum punya akun? </span>
             <Link href="/sign-up" className="text-[#00b894] font-medium hover:underline">Daftar sekarang</Link>
          </div>
        </form>
      </div>
    </div>
  );
}