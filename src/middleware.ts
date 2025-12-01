import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Definisi Rute
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isUserRoute = createRouteMatcher(["/user(.*)"]);
const isPublicRoute = createRouteMatcher([
  "/", 
  "/sign-in(.*)", 
  "/sign-up(.*)",
  "/api/webhooks(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // --- SKENARIO A: USER SUDAH LOGIN ---
  if (userId) {
    // Ambil role dari metadata (Pastikan sudah setup di Clerk Dashboard > Sessions)
    const role = (sessionClaims?.metadata as any)?.role || "user";

    // 1. Jika User mencoba akses halaman Login, Register, atau BERANDA (Home)
    //    Kita redirect langsung ke Dashboard masing-masing.
    if (isAuthRoute(req) || req.nextUrl.pathname === "/") {
      const targetUrl = new URL(`/${role}/dashboard`, req.url);
      return NextResponse.redirect(targetUrl);
    }

    // 2. Proteksi Halaman Admin (Cegah User Biasa masuk)
    if (isAdminRoute(req) && role !== "admin") {
      return NextResponse.redirect(new URL("/user/dashboard", req.url));
    }

    // 3. Proteksi Halaman User (Cegah Admin masuk, opsional)
    //    Jika Admin boleh lihat dashboard user, hapus blok if ini.
    if (isUserRoute(req) && role !== "user" && role !== "kader") {
       return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
  }

  // --- SKENARIO B: USER BELUM LOGIN ---
  // Jika mencoba akses halaman private (selain public route), lempar ke Login
  if (!userId && !isPublicRoute(req)) {
    return (await auth()).redirectToSignIn();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};