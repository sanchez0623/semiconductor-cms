// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          // ✅ 同时设置到 request 和 response
          req.cookies.set({ name, value, ...options });
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          req.cookies.set({ name, value: "", ...options });
          res.cookies.set({ name, value: "", ...options });
        },
      },
    }
  );

  // ✅ 刷新 session（重要！）
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 只保护 /dashboard 开头的路径
  if (url.pathname.startsWith("/dashboard")) {
    if (!session) {
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("redirect", url.pathname + url.search);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/callback",  // ✅ 添加 callback 路由
  ],
};