import { NextRequest, NextResponse } from 'next/server';

// This function runs before each request
export function middleware(request: NextRequest) {
  // Define protected routes that require authentication
  const protectedPaths = [
    '/',
    '/settings',
    '/post',
    '/profile'
  ];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(`${path}/`)
  );

  // For this implementation, we'll allow all access but in a real app, 
  // you would check for a valid session/cookie here
  if (isProtectedRoute) {
    // In a real app, you would check for authentication tokens here
    // If not authenticated, redirect to sign in page
    // For now, just allowing access to demonstrate the UI
  }

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