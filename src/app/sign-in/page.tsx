"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LoginForm } from "@/components/auth/login-form";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Sprout } from "lucide-react";

export default function SignInPage() {
  const [view, setView] = useState<"login" | "forgot-password">("login");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center">
        
        {/* Breadcrumb */}
        <div className="w-full max-w-2xl mb-6 text-sm">
            <Link href="/" className="underline hover:text-[#1abc9c]">Beranda</Link> / Masuk
        </div>

        {/* Card Container */}
        <div className="w-full max-w-lg border border-gray-300 rounded-lg shadow-sm overflow-hidden bg-white">
            
            {/* Header Card */}
            <div className="bg-[#1abc9c] py-4 px-6 text-center">
                <h1 className="text-white text-xl font-medium flex items-center justify-center gap-2">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    Masuk ke SIPOCEM
                </h1>
            </div>

            <div className="p-8">
                {/* Logo Center */}
                <div className="flex justify-center mb-8">
                     <div className="flex items-center gap-2">
                        <Sprout className="h-8 w-8 text-[#a3cb38]" /> 
                        <span className="text-2xl font-bold text-[#d4e157] tracking-wider">SIPOCEM</span>
                     </div>
                </div>

                {/* Form Logic Swapper */}
                {view === "login" ? (
                    <LoginForm onForgotPassword={() => setView("forgot-password")} />
                ) : (
                    <ForgotPasswordForm onBack={() => setView("login")} />
                )}

            </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}