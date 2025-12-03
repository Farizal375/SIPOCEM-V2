"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "@/components/auth/login-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Sprout } from "lucide-react";

export default function SignInPage() {
  const [view, setView] = useState<"login" | "forgot-password">("login");

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Navbar biasanya fixed/sticky, jadi dia melayang di atas */}
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 pt-28 pb-12 flex flex-col items-center justify-center">
        
        {/* Breadcrumb - Opsional, bisa dihilangkan jika ingin tampilan lebih bersih */}
        <div className="w-full max-w-lg mb-6 text-sm text-gray-500 text-center md:text-left">
            <Link href="/" className="hover:text-[#1abc9c] transition-colors">Beranda</Link> 
            <span className="mx-2">/</span> 
            <span className="font-semibold text-gray-700">Masuk Akun</span>
        </div>

        {/* Card Container */}
                {/* Form Logic Swapper */}
                {view === "login" ? (
                    <LoginForm onForgotPassword={() => setView("forgot-password")} />
                ) : (
                    <ForgotPasswordForm onBack={() => setView("login")} />
                )}

      </main>

      <Footer />
    </div>
  );
}