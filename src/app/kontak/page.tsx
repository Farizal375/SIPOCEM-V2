"use client";

import { MapPin, Phone, Mail } from "lucide-react";
import { motion, Variants } from "framer-motion"; // Import Variants
import { Navbar } from "@/components/layout/navbar"; // Import Navbar
import { Footer } from "@/components/layout/footer"; // Import Footer

// Tipe Variants untuk fix TS error
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: "easeOut" } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function KontakPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* 1. Pasang Navbar */}
      <Navbar />

      <main className="flex-1 pb-20 pt-24">
        <div className="container mx-auto px-4 max-w-5xl space-y-12">
          
          {/* HEADER */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl font-bold text-[#1abc9c]">Hubungi Kami</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Kami siap membantu Anda. Silakan hubungi kami melalui form di bawah ini
              atau melalui kontak yang tersedia.
            </p>
          </motion.div>

          {/* INFO KONTAK CARDS */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-3 gap-6"
          >
              {/* ALAMAT */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4 hover:shadow-lg hover:border-[#1abc9c] transition-all duration-300 group cursor-default">
                  <div className="bg-[#1abc9c]/10 p-4 rounded-full text-[#1abc9c] group-hover:bg-[#1abc9c] group-hover:text-white transition-colors">
                      <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Alamat</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                          Jl Nagarawangi Gg. Nusawangi 2 RT 04/RW 05, Kelurahan Nagarawangi,
                          Kecamatan Cihideung, Kota Tasikmalaya
                      </p>
                  </div>
              </motion.div>

              {/* TELEPON */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4 hover:shadow-lg hover:border-[#1abc9c] transition-all duration-300 group cursor-default">
                  <div className="bg-[#1abc9c]/10 p-4 rounded-full text-[#1abc9c] group-hover:bg-[#1abc9c] group-hover:text-white transition-colors">
                      <Phone className="w-8 h-8" />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Telepon</h3>
                      <p className="text-gray-600 text-sm font-medium">
                          +62 123 4567 890
                      </p>
                  </div>
              </motion.div>

              {/* EMAIL */}
              <motion.div variants={fadeInUp} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4 hover:shadow-lg hover:border-[#1abc9c] transition-all duration-300 group cursor-default">
                  <div className="bg-[#1abc9c]/10 p-4 rounded-full text-[#1abc9c] group-hover:bg-[#1abc9c] group-hover:text-white transition-colors">
                      <Mail className="w-8 h-8" />
                  </div>
                  <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Email</h3>
                      <p className="text-gray-600 text-sm font-medium">
                          infosipocem@gmail.com
                      </p>
                  </div>
              </motion.div>
          </motion.div>

          {/* GOOGLE MAPS EMBED */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
              <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.534887397752!2d108.2193790740698!3d-7.293645471692298!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6f50d155555555%3A0x401e8f1fc28c6f0!2sKelurahan%20Nagarawangi!5e0!3m2!1sid!2sid!4v1709620000000!5m2!1sid!2sid"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
              ></iframe>
          </motion.div>
        </div>
      </main>

      {/* 2. Pasang Footer */}
      <Footer />
    </div>
  );
}