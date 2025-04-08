// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  
  // Manage route protection
  const isAuth = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  
  // Redirect authenticated users away from auth pages
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/calendar', req.url));
    }
    return NextResponse.next();
  }
  
  // Protect the calendar route
  if (pathname.startsWith('/calendar')) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

// Specify which routes this middleware applies to
export const config = {
  matcher: ['/login', '/register', '/calendar/:path*'],
};