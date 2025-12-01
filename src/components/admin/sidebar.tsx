"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Bell, Settings, Sprout, LogOut } from "lucide-react";
import { cn } from "@/lib/utils"; // Pastikan utilitas shadcn ini ada
import { useClerk } from "@clerk/nextjs";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Manajemen Akun", href: "/admin/manajemen-akun", icon: Users },
  { label: "Pusat Notifikasi", href: "/admin/pusat-notifikasi", icon: Bell },
  { label: "Pengaturan", href: "/admin/pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#1abc9c] text-white min-h-screen">
      <div className="p-6 flex items-center gap-3">
        {/* Logo */}
        <Sprout className="w-8 h-8 text-yellow-300" />
        <h1 className="text-2xl font-bold tracking-wider">SIPOCEM</h1>
      </div>

      <div className="px-4 py-2 text-xs font-semibold text-white/70 uppercase tracking-wider">
        General
      </div>
      
      {/* Menu Navigasi */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-white/20 text-white shadow-sm" 
                  : "hover:bg-white/10 text-white/90"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Tombol Logout */}
      <div className="p-4 border-t border-white/20">
        <button 
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium hover:bg-white/10 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}