// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;

  // 只保护 /dashboard 开头的路径
  if (url.pathname.startsWith("/dashboard")) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options) {
            res.cookies.set({ name, value, ...options });
          },
          remove(name: string, options) {
            res.cookies.set({ name, value: "", ...options });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const redirectUrl = new URL("/auth/login", req.url);
      redirectUrl.searchParams.set("redirect", url.pathname + url.search);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"], // ✅ 只保护后台
};