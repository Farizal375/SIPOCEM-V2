"use client";

import { KaderSidebar } from "@/components/kader/kader-sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function KaderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Desktop */}
      <KaderSidebar />

      {/* Main Content Wrapper */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        
        {/* Topbar */}
        <header className="bg-white h-16 flex items-center justify-between px-4 md:px-8 shadow-sm sticky top-0 z-30 border-b">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu className="w-6 h-6 text-gray-600" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-none">
                <KaderSidebar />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg text-[#1abc9c]">SIPOCEM</span>
          </div>

          <div className="hidden md:block">
             <h2 className="text-gray-500 font-medium text-sm">Dashboard Kader Posyandu</h2>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-700">{user?.fullName || "Kader"}</p>
                <p className="text-xs text-gray-400">Kader Aktif</p>
            </div>
            <UserButton afterSignOutUrl="/"/>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}