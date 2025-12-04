"use client";

import Link from "next/link";
import { useState, useEffect } from "react"; // Tambahkan Hooks
import { useRouter, usePathname } from "next/navigation";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { 
  Home, Info, Phone, UserPlus, LogIn, Sprout, 
  LayoutDashboard, LogOut, ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const role = (user?.publicMetadata?.role as string) || "user";

  // State untuk mendeteksi scroll
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Informasi", href: "/informasi", icon: Info },
    { name: "Kontak", href: "/kontak", icon: Phone },
  ];

  return (
    // UBAH: sticky -> fixed, tambahkan logika shadow dan transition
    <header 
      className={cn(
        "fixed top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled 
          ? "bg-[#1abc9c] shadow-md border-transparent py-2" // Saat discroll: Lebih padat & ada shadow
          : "bg-[#1abc9c] border-white/10 py-4" // Awal: Sedikit lebih renggang
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-6">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition">
          <Sprout className="h-8 w-8 text-yellow-300" /> 
          <span className="tracking-wide text-yellow-300 uppercase">SIPOCEM</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                className={cn(
                  "flex items-center gap-1 pb-0.5 transition-all duration-200 ease-in-out border-b-2",
                  isActive 
                    ? "border-white font-semibold text-white"
                    : "border-transparent text-white/90 hover:text-yellow-100 hover:border-yellow-200/50"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.name}
              </Link>
            );
          })}
          
          {/* AUTH SECTION */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/20">
             {!isSignedIn ? (
               <>
                 <Link href="/sign-up" className="flex items-center gap-1 text-white hover:text-yellow-100 transition-colors font-medium">
                    <UserPlus className="h-4 w-4" />
                    Daftar
                 </Link>
                 <Link href="/sign-in" className="flex items-center gap-1 bg-white text-[#1abc9c] px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-bold shadow-sm ml-3">
                    <LogIn className="h-4 w-4" />
                    Masuk
                 </Link>
               </>
             ) : (
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <button className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-full transition-colors focus:outline-none">
                     <Avatar className="h-8 w-8 border-2 border-white/50">
                       <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                       <AvatarFallback className="text-teal-700 bg-yellow-100 font-bold">
                         {user?.firstName?.charAt(0) || "U"}
                       </AvatarFallback>
                     </Avatar>
                     <div className="text-left hidden lg:block text-white">
                        <p className="text-sm font-semibold leading-none">{user?.fullName}</p>
                        <p className="text-[10px] text-white/80 uppercase tracking-wider mt-0.5">{role}</p>
                     </div>
                     <ChevronDown className="h-4 w-4 opacity-70 ml-1 text-white" />
                   </button>
                 </DropdownMenuTrigger>
                 <DropdownMenuContent align="end" className="w-56 mt-2">
                   <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => router.push(`/${role}/dashboard`)}
                   >
                     <LayoutDashboard className="mr-2 h-4 w-4" />
                     <span>Dashboard</span>
                   </DropdownMenuItem>
                   <DropdownMenuSeparator />
                   <DropdownMenuItem 
                      className="cursor-pointer text-red-600 focus:text-red-600"
                      onClick={() => signOut({ redirectUrl: '/' })}
                   >
                     <LogOut className="mr-2 h-4 w-4" />
                     <span>Keluar</span>
                   </DropdownMenuItem>
                 </DropdownMenuContent>
               </DropdownMenu>
             )}
          </div>
        </nav>
      </div>
    </header>
  );
}