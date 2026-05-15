import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

const PROTECTED_ROUTES = ['/dashboard', '/editor'];

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit /invite/demo to prevent scraping
  if (pathname.startsWith('/invite/demo')) {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const record = rateLimitMap.get(ip);
    if (record && now - record.timestamp < 60000) {
      if (record.count > 100) {
        return new NextResponse('Too Many Requests', { status: 429 });
      }
      record.count += 1;
      rateLimitMap.set(ip, record);
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
  }

  // Only guard protected routes
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL;
  
  if (!user || (adminEmail && user.email !== adminEmail)) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/editor/:path*', '/invite/demo'],
};
