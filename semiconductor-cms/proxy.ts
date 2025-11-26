import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(req: NextRequest) {
  console.log(`[Proxy] Request: ${req.method} ${req.nextUrl.pathname}`);
  
  try {
    // 1. 执行 next-intl 中间件
    const res = intlMiddleware(req);
    
    // 如果 next-intl 产生了重定向（例如 / -> /en），直接返回
    if (res.headers.get('Location')) {
      console.log(`[Proxy] Redirecting to: ${res.headers.get('Location')}`);
      return res;
    }

    // 2. Supabase Auth 逻辑
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              res.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // 🔒 安全修正：使用 getUser() 替代 getSession()
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();
    
    if (authError) {
        // console.log("[Proxy] Auth check info:", authError.message);
    }

    const url = req.nextUrl;
    const isDashboard = url.pathname.includes('/dashboard');

    if (isDashboard) {
      if (!user) {
        const pathSegments = url.pathname.split('/');
        const potentialLocale = pathSegments[1];
        const locale = routing.locales.includes(potentialLocale as any) ? potentialLocale : routing.defaultLocale;

        const redirectUrl = new URL(`/${locale}/auth/login`, req.url);
        redirectUrl.searchParams.set("redirect", url.pathname + url.search);
        console.log(`[Proxy] Unauthorized access to dashboard. Redirecting to: ${redirectUrl.toString()}`);
        return NextResponse.redirect(redirectUrl);
      }
    }

    return res;
  } catch (error: any) {
    console.error("[Proxy] Critical Error:", error);
    return new NextResponse(
      `<html><body><h1>Proxy Error</h1><pre>${error.message}\n\n${error.stack}</pre></body></html>`, 
      { 
        status: 500,
        headers: { 'content-type': 'text/html' }
      }
    );
  }
}

// 兼容默认导出，以防 Next.js 需要
export default proxy;

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};