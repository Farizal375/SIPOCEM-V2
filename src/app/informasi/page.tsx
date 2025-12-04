"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { motion, Variants } from "framer-motion"; // Import Variants untuk fix error TS
import { Navbar } from "@/components/layout/navbar"; // Import Navbar
import { Footer } from "@/components/layout/footer"; // Import Footer

// Definisikan tipe : Variants agar TypeScript tidak error pada "ease"
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3 }
  }
};

export default function InformasiPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50"> 
      {/* 1. Pasang Navbar */}
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        
        {/* SECTION 1: TENTANG KAMI */}
        <section className="container mx-auto px-4 max-w-6xl mb-20">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center space-y-6 max-w-3xl mx-auto mb-12"
          >
              <h1 className="text-4xl font-bold text-[#1abc9c]">Tentang SIPOCEM</h1>
              <p className="text-gray-600 leading-relaxed text-lg">
                  Posyandu Cempaka merupakan layanan kesehatan berbasis masyarakat yang
                  berfokus pada pemantauan tumbuh kembang balita, kesehatan ibu hamil,
                  serta edukasi kesehatan untuk meningkatkan kesejahteraan warga di
                  lingkungan Nagarawangi.
              </p>
          </motion.div>

          {/* Gambar Utama dengan Style Dashboard (Card putih, shadow) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full h-[400px] bg-white rounded-2xl overflow-hidden relative shadow-lg border border-gray-100 group"
          >
               <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium bg-gray-100">
                  [Gambar Kegiatan Posyandu]
               </div>
               {/* Jika sudah ada gambar asli, uncomment kode di bawah: */}
               {/* <Image src="/images/kegiatan.jpg" alt="Kegiatan" fill className="object-cover" /> */}
          </motion.div>
        </section>

        {/* SECTION 2: LAYANAN KAMI (Timeline Animation) */}
        <section className="bg-white py-20 border-y border-gray-100">
          <div className="container mx-auto px-4 max-w-5xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                  <h2 className="text-3xl font-bold text-[#1abc9c]">Layanan Kami</h2>
                  <div className="w-20 h-1 bg-[#d4e157] mx-auto mt-4 rounded-full"></div>
              </motion.div>

              <motion.div 
                className="space-y-8 relative"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
              >
                  {/* Garis Vertikal */}
                  <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>

                  {/* Item 1 */}
                  <motion.div variants={fadeInUp} className="relative flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1 md:text-right order-2 md:order-1 bg-[#d4e157] p-6 rounded-xl shadow-sm text-black border border-green-200 w-full hover:-translate-y-1 transition duration-300">
                          <h3 className="font-bold text-lg mb-2">Pemantauan Balita</h3>
                          <p className="text-sm opacity-90">
                              Meliputi penimbangan, pengukuran tinggi badan, pencatatan perkembangan, 
                              serta pemberian edukasi gizi bagi orang tua.
                          </p>
                      </div>
                      <div className="z-10 w-12 h-12 bg-[#1abc9c] text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg order-1 md:order-2 shrink-0 text-xl">
                          1
                      </div>
                      <div className="flex-1 order-3 hidden md:block"></div>
                  </motion.div>

                  {/* Item 2 */}
                  <motion.div variants={fadeInUp} className="relative flex flex-col md:flex-row items-center gap-8">
                       <div className="flex-1 order-3 hidden md:block"></div>
                      <div className="z-10 w-12 h-12 bg-[#1abc9c] text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg order-1 md:order-2 shrink-0 text-xl">
                          2
                      </div>
                      <div className="flex-1 md:text-left order-2 md:order-3 bg-[#d4e157] p-6 rounded-xl shadow-sm text-black border border-green-200 w-full hover:-translate-y-1 transition duration-300">
                           <h3 className="font-bold text-lg mb-2">Pemeriksaan Ibu Hamil</h3>
                           <p className="text-sm opacity-90">
                              Pemeriksaan kesehatan rutin untuk ibu hamil, termasuk pemantauan kondisi 
                              kehamilan dan pemberian edukasi penting.
                          </p>
                      </div>
                  </motion.div>

                  {/* Item 3 */}
                  <motion.div variants={fadeInUp} className="relative flex flex-col md:flex-row items-center gap-8">
                      <div className="flex-1 md:text-right order-2 md:order-1 bg-[#d4e157] p-6 rounded-xl shadow-sm text-black border border-green-200 w-full hover:-translate-y-1 transition duration-300">
                           <h3 className="font-bold text-lg mb-2">Imunisasi</h3>
                           <p className="text-sm opacity-90">
                              Pemberian imunisasi dasar sesuai jadwal kepada balita sebagai upaya 
                              pencegahan penyakit.
                          </p>
                      </div>
                      <div className="z-10 w-12 h-12 bg-[#1abc9c] text-white rounded-full flex items-center justify-center font-bold border-4 border-white shadow-lg order-1 md:order-2 shrink-0 text-xl">
                          3
                      </div>
                      <div className="flex-1 order-3 hidden md:block"></div>
                  </motion.div>
              </motion.div>
          </div>
        </section>

        {/* SECTION 3: DAMPAK PROGRAM */}
        <section className="container mx-auto px-4 max-w-6xl py-20">
          <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-[#1abc9c]">Dampak Program</h2>
               <div className="w-20 h-1 bg-[#d4e157] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
               {/* Gambar Samping */}
               <motion.div 
                 initial={{ opacity: 0, x: -50 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ duration: 0.7 }}
                 className="h-[300px] bg-white rounded-xl overflow-hidden relative shadow-md border border-gray-100"
               >
                   <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium bg-gray-100">
                      [Gambar Suasana Posyandu]
                   </div>
               </motion.div>

               {/* Checklist */}
               <motion.div 
                 className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-[#1abc9c]"
                 initial="hidden"
                 whileInView="visible"
                 variants={staggerContainer}
               >
                  <ul className="space-y-6">
                      {[
                        "Meningkatnya ketertiban dan akurasi pencatatan layanan",
                        "Orang tua lebih mudah memantau perkembangan anak",
                        "Menghindari risiko hilangnya data layanan posyandu"
                      ].map((item, idx) => (
                        <motion.li key={idx} variants={fadeInUp} className="flex items-start gap-4">
                            <CheckCircle2 className="w-6 h-6 text-[#1abc9c] shrink-0 mt-0.5" />
                            <span className="text-gray-700 font-medium">{item}</span>
                        </motion.li>
                      ))}
                  </ul>
               </motion.div>
          </div>
        </section>

      </main>

      {/* 2. Pasang Footer */}
      <Footer />
    </div>
  );
}