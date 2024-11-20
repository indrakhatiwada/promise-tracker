import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Check for admin routes
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Check for authenticated routes
    if (
      req.nextUrl.pathname.startsWith('/promises/new') ||
      req.nextUrl.pathname.startsWith('/submit')
    ) {
      if (!token) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes
        if (
          req.nextUrl.pathname.startsWith('/auth/') ||
          req.nextUrl.pathname === '/' ||
          req.nextUrl.pathname.startsWith('/promises') && !req.nextUrl.pathname.startsWith('/promises/new')
        ) {
          return true;
        }

        // Protected routes require authentication
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/promises/new',
    '/submit',
    '/auth/:path*',
    '/promises/:path*',
    '/'
  ],
};
