"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
// PERBAIKAN: Import nama komponen yang BENAR
import { SimpleRegister } from "@/components/auth/simple-register"; 
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      <div className="fixed top-0 w-full z-50">
          <Navbar />
      </div>
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center">
        
        <div className="w-full max-w-lg mb-6 text-left">
            <Link 
              href="/" 
              className="text-black border-b border-black hover:text-[#00b894] hover:border-[#00b894] transition-colors pb-0.5"
            >
              Beranda
            </Link> 
            <span className="mx-2 text-black">/</span> 
            <span className="text-black">Daftar Akun</span>
        </div>

        {/* Panggil Component SimpleRegister */}
        <SimpleRegister />

        <div className="mt-8 text-center text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/sign-in" className="font-semibold text-[#00b894] hover:underline">
            Masuk disini
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}