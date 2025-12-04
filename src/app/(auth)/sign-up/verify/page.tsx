"use client";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { VerifyForm } from "@/components/auth/verify-form";

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="fixed top-0 w-full z-50">
          <Navbar />
      </div>
      
      <main className="flex-1 container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center">
        <VerifyForm />
      </main>

      <Footer />
    </div>
  );
}