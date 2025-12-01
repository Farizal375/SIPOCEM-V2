import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs"; // <--- 1. Import ClerkProvider
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SIPOCEM - Sistem Informasi Posyandu Cempaka",
  description: "Kemudahan memantau kesehatan ibu dan anak dalam satu aplikasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 2. Bungkus seluruh HTML dengan ClerkProvider
    <ClerkProvider>
      <html lang="id" suppressHydrationWarning>
        <body 
          className={`${inter.className} antialiased`}
          suppressHydrationWarning
        >
          {children}
          <Toaster position="top-center" richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}