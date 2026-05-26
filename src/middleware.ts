import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle locale detection and redirection if there is no locale prefix
  const hasLocale = pathname.startsWith("/ar") || pathname.startsWith("/en");
  
  const isApiOrStatic = 
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico";

  if (!hasLocale && !isApiOrStatic) {
    if (pathname !== "/") {
      const url = request.nextUrl.clone();
      url.pathname = `/ar${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // 2. Refresh Supabase session
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // 3. Auth Guard
  const isProtected = 
    pathname.includes("/dashboard") ||
    pathname.includes("/workflows") ||
    pathname.includes("/settings") ||
    pathname.includes("/billing");

  if (isProtected && !user) {
    const locale = pathname.startsWith("/en") ? "en" : "ar";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/auth/sign-in`;
    return NextResponse.redirect(url);
  }

  if (user && pathname.includes("/auth/")) {
    const locale = pathname.startsWith("/en") ? "en" : "ar";
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/dashboard`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
