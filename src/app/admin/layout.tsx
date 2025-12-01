import { Sidebar } from "@/components/admin/sidebar";
// HAPUS IMPORT INI: import { Toaster } from "@/components/ui/sonner"; 

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Mobile (Opsional) */}
        <header className="md:hidden bg-[#1abc9c] p-4 text-white flex items-center justify-between">
             <span className="font-bold">SIPOCEM Admin</span>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
      {/* HAPUS BAGIAN INI: <Toaster /> */}
    </div>
  );
}