import Link from "next/link";
import { Sprout, MapPin, Phone, Mail, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#1abc9c] text-white py-12">
      <div className="container mx-auto px-4 md:px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-yellow-300" />
            <span className="text-xl font-bold text-yellow-300 uppercase">SIPOCEM</span>
          </div>
          <h2 className="text-2xl font-bold">SIPOCEM</h2>
          <p className="text-sm text-white/90 leading-relaxed">
            Mendukung Tumbuh Kembang<br />
            Anak Bersama Posyandu<br />
            Cempaka
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tautan Cepat</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:underline">Tentang Kami</Link></li>
            <li><Link href="#" className="hover:underline">Tim Kami</Link></li>
            <li><Link href="#" className="hover:underline">Kontak</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Kontak Kami</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="h-5 w-5 shrink-0" />
              <span>Mugarsari, Tasikmalaya</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-5 w-5 shrink-0" />
              <span>+62 123 4567 890</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-5 w-5 shrink-0" />
              <span>infosipocem@google.com</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Media Sosial</h3>
          <div className="flex gap-4">
            <Link href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-[#1abc9c] transition">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-[#1abc9c] transition">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-[#1abc9c] transition">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-[#1abc9c] transition">
              <Youtube className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12 pt-8 border-t border-white/30 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; 2025 Posyandu Cempaka. Hak Cipta Dilindungi</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:underline">Kebijakan Privasi</Link>
          <Link href="#" className="hover:underline">Syarat & Ketentuan</Link>
        </div>
      </div>
    </footer>
  );
}