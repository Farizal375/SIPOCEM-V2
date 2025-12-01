import { Navbar } from "@/components/layout/navbar";
import { HeroSection } from "@/components/landing/hero";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    // Gunakan div sebagai wrapper layout utama
    <div className="flex min-h-screen flex-col bg-white">
      
      {/* Header/Navbar berada di paling atas */}
      <Navbar />

      {/* Main membungkus konten unik halaman ini & mengisi ruang kosong (flex-1) */}
      <main className="flex-1">
        <HeroSection />
        {/* Nanti section lain (Fitur, Galeri, dll) ditambahkan di sini */}
      </main>

      {/* Footer berada di paling bawah */}
      <Footer />
      
    </div>
  );
}