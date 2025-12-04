import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 1. Definisi Rute (Matcher)
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isKaderRoute = createRouteMatcher(["/kader(.*)"]); // Tambahan untuk Kader
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
    // Ambil role dari metadata (Default ke 'user' jika tidak ada)
    // Pastikan di Clerk Dashboard > Sessions > Customize Session Token sudah ditambahkan metadata
    const role = (sessionClaims?.metadata as any)?.role || "user";

    // 1. Redirect Otomatis dari Halaman Public/Auth ke Dashboard masing-masing
    //    Jika user yang sudah login mencoba buka halaman Login, Register, atau Landing Page (/)
    if (isAuthRoute(req) || req.nextUrl.pathname === "/") {
      if (role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      } else if (role === "kader") {
        return NextResponse.redirect(new URL("/kader/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/user/dashboard", req.url));
      }
    }

    // 2. Proteksi Halaman ADMIN
    //    Jika mencoba akses /admin/* tapi bukan admin -> lempar ke dashboard masing-masing
    if (isAdminRoute(req) && role !== "admin") {
      const target = role === "kader" ? "/kader/dashboard" : "/user/dashboard";
      return NextResponse.redirect(new URL(target, req.url));
    }

    // 3. Proteksi Halaman KADER
    //    Jika mencoba akses /kader/* tapi bukan kader -> lempar ke dashboard masing-masing
    if (isKaderRoute(req) && role !== "kader") {
       const target = role === "admin" ? "/admin/dashboard" : "/user/dashboard";
       return NextResponse.redirect(new URL(target, req.url));
    }

    // 4. Proteksi Halaman USER
    //    Jika mencoba akses /user/* tapi bukan user -> lempar ke dashboard masing-masing
    //    (Strict separation: Admin/Kader tidak otomatis bisa masuk view User tanpa login sebagai user)
    if (isUserRoute(req) && role !== "user") {
       const target = role === "admin" ? "/admin/dashboard" : "/kader/dashboard";
       return NextResponse.redirect(new URL(target, req.url));
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