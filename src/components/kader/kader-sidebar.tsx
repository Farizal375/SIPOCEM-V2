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
  LogOut,
  FileBarChart,
  ClipboardList
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";

const menuItems = [
  {
    category: "DASHBOARD",
    items: [
      { label: "Dashboard", href: "/kader/dashboard", icon: LayoutDashboard },
    ]
  },
  {
    category: "MANAJEMEN DATA",
    items: [
      { label: "Data Ibu Hamil", href: "/kader/data-ibu", icon: Stethoscope }, 
      { label: "Data Anak", href: "/kader/data-anak", icon: Baby },
    ]
  },
  {
    category: "PELAPORAN & JADWAL",
    items: [
      { label: "Rekap Data", href: "/kader/rekap", icon: FileBarChart },
      { label: "Jadwal Posyandu", href: "/kader/jadwal", icon: CalendarDays },
    ]
  },
  {
    category: "LAINNYA",
    items: [
      { label: "Pengaturan", href: "/kader/pengaturan", icon: Settings },
    ]
  }
];

export function KaderSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#1abc9c] text-white min-h-screen fixed left-0 top-0 overflow-y-auto z-40 border-r border-white/10">
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
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-white/20 text-white shadow-sm font-bold" 
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

      <div className="p-4 border-t border-white/20">
        <button 
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium hover:bg-white/10 rounded-lg transition-colors text-red-100 hover:text-red-200"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  );
}