"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useUser, useClerk } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
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

export function Navbar() {
  const { isSignedIn } = useAuth();
  const { user } = useUser(); // Ambil data user (nama, foto)
  const { signOut } = useClerk();
  const router = useRouter();

  // Ambil role dari metadata, default ke 'user' jika tidak ada
  const role = (user?.publicMetadata?.role as string) || "user";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#1abc9c] text-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-90 transition">
          <Sprout className="h-8 w-8 text-yellow-300" /> 
          <span className="tracking-wide text-yellow-300 uppercase">SIPOCEM</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="flex items-center gap-1 border-b-2 border-white pb-0.5 transition-colors">
            <Home className="h-4 w-4" />
            Beranda
          </Link>
          <Link href="#informasi" className="flex items-center gap-1 hover:text-yellow-100 transition-colors">
            <Info className="h-4 w-4" />
            Informasi
          </Link>
          <Link href="#kontak" className="flex items-center gap-1 hover:text-yellow-100 transition-colors">
            <Phone className="h-4 w-4" />
            Kontak
          </Link>
          
          {/* AUTH SECTION */}
          <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/20">
             {!isSignedIn ? (
               // JIKA BELUM LOGIN
               <>
                 <Link href="/sign-up" className="flex items-center gap-1 hover:text-yellow-100 transition-colors">
                    <UserPlus className="h-4 w-4" />
                    Daftar
                 </Link>
                 <Link href="/sign-in" className="flex items-center gap-1 hover:text-yellow-100 transition-colors ml-4">
                    <LogIn className="h-4 w-4" />
                    Masuk
                 </Link>
               </>
             ) : (
               // JIKA SUDAH LOGIN (Dropdown Menu)
               <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <button className="flex items-center gap-2 hover:bg-white/10 px-3 py-2 rounded-full transition-colors focus:outline-none">
                     <Avatar className="h-8 w-8 border-2 border-white/50">
                       <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                       <AvatarFallback className="text-teal-700 bg-yellow-100 font-bold">
                         {user?.firstName?.charAt(0) || "U"}
                       </AvatarFallback>
                     </Avatar>
                     <div className="text-left hidden lg:block">
                        <p className="text-sm font-semibold leading-none">{user?.fullName}</p>
                        <p className="text-[10px] text-white/80 uppercase tracking-wider mt-0.5">{role}</p>
                     </div>
                     <ChevronDown className="h-4 w-4 opacity-70 ml-1" />
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