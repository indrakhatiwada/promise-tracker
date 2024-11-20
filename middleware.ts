import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    console.log('Middleware - Token:', token);
    console.log('Middleware - Role:', token?.role);

    // Check for admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        console.log('Middleware - Admin Access Denied:', token);
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        console.log('Middleware Authorized Check - Token:', token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
