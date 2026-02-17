import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);
const isAuthRoute = createRouteMatcher(['/login', '/register']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { userId } = await auth();
  
  // Check if JWT cookie exists (your backend auth)
  const authCookie = req.cookies.get('auth_token'); // Adjust to your cookie name
  
  // Protected routes - require both Clerk session and backend JWT
  if (isProtectedRoute(req)) {
    // Check Clerk authentication
    if (!userId) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    // Then verify backend JWT exists
    if (!authCookie) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  
  // Auth routes - redirect if already authenticated
  if (isAuthRoute(req)) {
    if (userId && authCookie) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};