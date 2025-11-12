import { NextRequest, NextResponse } from 'next/server';

// This function runs before each request
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  const { pathname } = request.nextUrl;

  // Define public paths that don't require authentication
  const publicPaths = [
    '/auth/signin',
    '/auth/signup',
  ];

  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  // If trying to access a public path, let them through
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If the token is missing and they are trying to access a protected route, redirect to signin
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }

  // If the token exists, let them proceed
  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};