"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
// INI BAGIAN PENTINGNYA: Memanggil komponen MultiStepRegister
import { MultiStepRegister } from "@/components/auth/multi-step-register"; 
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans">
      {/* Navbar Fixed */}
      <div className="fixed top-0 w-full z-50">
          <Navbar />
      </div>
      
      {/* Konten Utama */}
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center">
        
        {/* Breadcrumb Navigation: Beranda / Daftar */}
        <div className="w-full max-w-2xl mb-8 text-left">
            <Link 
              href="/" 
              className="text-black border-b border-black hover:text-[#00b894] hover:border-[#00b894] transition-colors pb-0.5"
            >
              Beranda
            </Link> 
            <span className="mx-2 text-black">/</span> 
            <span className="text-black">Daftar Akun</span>
        </div>

        {/* PANGGIL KOMPONEN DI SINI */}
        <MultiStepRegister />

        {/* Link Login di Bawah (Opsional, karena biasanya sudah ada di dalam form) */}
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