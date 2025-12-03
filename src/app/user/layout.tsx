"use client";

import { UserSidebar } from "@/components/user/user-sidebar";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col">
        
        {/* Header Mobile & Desktop Profile Bar */}
        <header className="bg-[#1abc9c] md:bg-[#1abc9c] h-16 flex items-center justify-between px-4 md:px-8 text-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet>
              <SheetTrigger>
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64 border-none">
                <UserSidebar />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg">SIPOCEM</span>
          </div>

          {/* Spacer untuk Desktop agar konten header di kanan */}
          <div className="hidden md:block"></div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium hidden md:block">
              {user?.username || user?.fullName || "User"}
            </span>
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "w-8 h-8 border-2 border-white/50"
              }
            }}/>
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