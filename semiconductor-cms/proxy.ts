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

  // 🔒 安全修正：使用 getUser() 替代 getSession()
  // getUser 会向 Supabase Auth 服务器验证 token 的真实性
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 只保护 /dashboard 开头的路径
  if (url.pathname.startsWith("/dashboard")) {
    // 如果用户不存在（未登录或 token 无效），重定向到登录页
    if (!user) {
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
  ],
};