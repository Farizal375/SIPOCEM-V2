import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Definisi Rute
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isKaderRoute = createRouteMatcher(["/kader(.*)"]);
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
    // Ambil role dari metadata. Default ke 'user' jika tidak ada.
    const role = (sessionClaims?.metadata as any)?.role || "user";

    // 1. Redirect Otomatis dari Halaman Public/Auth ke Dashboard masing-masing
    //    Jika user yang sudah login mencoba buka halaman Login, Register, atau Home (/)
    if (isAuthRoute(req) || req.nextUrl.pathname === "/") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else if (role === "kader") {
        return NextResponse.redirect(new URL("/kader/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/user/dashboard", req.url));
      }
    }

    // 2. Proteksi Akses Lintas Role (Role-Based Access Control)
    
    // Jika bukan ADMIN tapi mencoba akses halaman /admin
    if (isAdminRoute(req) && role !== "admin") {
      const target = role === "kader" ? "/kader/dashboard" : "/user/dashboard";
      return NextResponse.redirect(new URL(target, req.url));
    }

    // Jika bukan KADER tapi mencoba akses halaman /kader
    if (isKaderRoute(req) && role !== "kader") {
       // Admin boleh akses kader? Jika tidak, lempar balik.
       // Jika Admin boleh, tambahkan: if (role !== "kader" && role !== "admin")
       const target = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
       return NextResponse.redirect(new URL(target, req.url));
    }

    // Jika bukan USER tapi mencoba akses halaman /user
    if (isUserRoute(req) && role !== "user") {
       const target = role === "admin" ? "/admin/dashboard" : "/kader/dashboard";
       return NextResponse.redirect(new URL(target, req.url));
    }
  }

  // --- SKENARIO B: USER BELUM LOGIN ---
  // Jika mencoba akses halaman private, lempar ke Login
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