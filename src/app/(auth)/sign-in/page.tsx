"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
// Import Component Terpisah
import { LoginForm } from "@/components/auth/login-form"; 
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="fixed top-0 w-full z-50">
          <Navbar />
      </div>
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="w-full max-w-[500px] mb-6 text-left">
            <Link href="/" className="text-black border-b border-black hover:text-[#00b894] hover:border-[#00b894] transition-colors pb-0.5">Beranda</Link> 
            <span className="mx-2 text-black">/</span> 
            <span className="text-black">Masuk</span>
        </div>
        
        {/* Panggil Component Terpisah */}
        <LoginForm />

      </main>
      <Footer />
    </div>
  );
}