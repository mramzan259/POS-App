import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = ["/", "/login", "/register"];
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("authToken")?.value;

  // ✅ Redirect logged-in users away from /login and /register
  if (PUBLIC_PATHS.includes(pathname) && token) {
    try {
      await jwtVerify(token, secret);
      return NextResponse.redirect(new URL("/pos", req.url)); // or wherever you want to send them
    } catch {
      // Token invalid → allow access to /login and /register
      return NextResponse.next();
    }
  }

  // ✅ Allow public routes for non-authenticated users
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // ✅ Protect /pos routes
  if (pathname.startsWith("/pos")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      console.error("Invalid JWT:", err.message);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // Apply to all routes
};
