"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Baby, 
  Stethoscope, 
  CalendarDays, 
  Settings, 
  Sprout,
  LogOut
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

const menuItems = [
  {
    category: "GENERAL",
    items: [
      { label: "Dashboard", href: "/user/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    category: "DATA MASTER",
    items: [
      { label: "Data Ibu Hamil", href: "/user/data-ibu", icon: Stethoscope }, // Icon mendekati gambar ibu hamil
      { label: "Data Anak", href: "/user/data-anak", icon: Baby },
    ]
  },
  {
    category: "DATA LAYANAN",
    items: [
      { label: "Jadwal Posyandu", href: "/user/jadwal", icon: CalendarDays },
      { label: "Pengaturan", href: "/user/pengaturan", icon: Settings },
    ]
  }
];

export function UserSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#1abc9c] text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-2">
        <Sprout className="w-8 h-8 text-yellow-300" />
        <h1 className="text-2xl font-bold tracking-wider">SIPOCEM</h1>
      </div>

      <div className="flex-1 py-4">
        {menuItems.map((group, idx) => (
          <div key={idx} className="mb-6">
            <div className="px-6 py-2 text-[10px] font-bold text-white/60 uppercase tracking-widest">
              {group.category}
            </div>
            <nav className="space-y-1 px-3">
              {group.items.map((item) => {
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
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-white/20">
        <button 
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium hover:bg-white/10 rounded-lg transition-colors text-white/90"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}