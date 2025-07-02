import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Define public paths that don't require authentication
const PUBLIC_PATHS = [
  '/login',
  '/signup',
  '/forgot-password',
  '/',
  '/about',
  '/pricing',
  '/api',
  '/how-it-works',
  '/landing',
  '/integrations',
  '/documentation',
  '/guides',
  '/tutorials',
  '/webinars',
  '/blog',
  '/careers',
  '/contact',
  '/privacy',
  '/terms',
  '/security',
];

// Check if the path starts with any of the public paths
function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some(publicPath => 
    path === publicPath || 
    path.startsWith(`${publicPath}/`) ||
    path.startsWith('/_next/') ||
    path.startsWith('/favicon') ||
    path.includes('.')  // Static files like images, css, js
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public paths without authentication
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Check for NextAuth session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  });

  // Also check for custom auth token
  const customToken = request.cookies.get('token')?.value;

  // Check if user is authenticated, if not redirect to login
  if (!token && !customToken) {
    const url = new URL('/login', request.url);
    // Add a redirect parameter to return to the requested page after login
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // User has token, allow access
  return NextResponse.next();
}

// Configure matcher for all routes except API routes and static files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     * - login (login page)
     * - signup (signup page)
     * - about (about page)
     * - how-it-works (how-it-works page)
     * - landing (landing page)
     * - integrations (integrations page)
     * - documentation (documentation page)
     * - guides (guides page)
     * - tutorials (tutorials page)
     * - webinars (webinars page)
     * - blog (blog page)
     * - careers (careers page)
     * - contact (contact page)
     * - privacy (privacy page)
     * - terms (terms page)
     * - security (security page)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|login|signup|about|how-it-works|landing|integrations|documentation|guides|tutorials|webinars|blog|careers|contact|privacy|terms|security).*)',
  ],
}; 