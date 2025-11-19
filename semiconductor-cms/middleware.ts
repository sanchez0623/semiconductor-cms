// middleware.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // 创建一个响应对象，以便我们可以修改它的 headers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 创建一个能在 Middleware 和 Server Component 中使用的 Supabase 客户端
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // 如果在 Server Component 中设置了 cookie，也在这里更新
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          // 如果在 Server Component 中删除了 cookie，也在这里更新
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  // 核心：刷新 session。这对于保证服务端渲染的 session 状态至关重要。
  // 它会处理好 session 过期后的刷新逻辑。
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 检查需要保护的路径
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    // 如果没有 session 且访问的是受保护路径，重定向到登录页
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    // 将原始访问路径作为 redirect 参数，以便登录后能跳回来
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 如果用户已登录，或者访问的是公共页面，则正常继续
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};