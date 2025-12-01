import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          
          {/* Bagian Kiri: Teks */}
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-[#1abc9c]">
              Sistem Informasi <br />
              Posyandu Cempaka
            </h1>
            <p className="max-w-[600px] text-gray-900 md:text-xl font-medium">
              Kemudahan memantau kesehatan ibu dan anak dalam satu aplikasi.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="bg-[#1abc9c] hover:bg-[#16a085] text-white rounded-md px-8 cursor-pointer">
                <Link href="/sign-up">Daftar</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-[#1abc9c] border-[#1abc9c] hover:bg-teal-50 px-8 rounded-md cursor-pointer">
                <Link href="/sign-in">Masuk</Link>
              </Button>
            </div>
          </div>

          {/* Bagian Kanan: Gambar */}
          {/* Pastikan class relative ada di parent div agar fill berfungsi */}
          <div className="mx-auto aspect-video w-full overflow-hidden rounded-xl shadow-lg relative bg-gray-100">
             <Image 
                src="/images/posyandu.jpg"  // <--- Pastikan nama file ini sesuai di folder public/images/
                alt="Papan Nama Posyandu Cempaka" 
                fill
                className="object-cover"
                priority // Agar gambar dimuat lebih cepat karena ini di atas lipatan (above the fold)
             />
          </div>

        </div>
      </div>
    </section>
  );
}