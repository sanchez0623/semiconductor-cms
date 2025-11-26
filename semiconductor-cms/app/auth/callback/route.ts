import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  
  // 1. 获取 code 和 next (重定向目标)
  const code = searchParams.get("code");
  const next = searchParams.get("redirect") || "/dashboard"; // 注意这里我们统一用 redirect 参数

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // 2. 交换 Code 获取 Session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 3. 成功：重定向到目标页面 (不要把 code 带过去)
      // 确保 next 是相对路径或同源 URL，防止开放重定向攻击
      const forwardedHost = request.headers.get('x-forwarded-host'); // 如果有反向代理
      const isLocal = origin.includes('localhost');
      
      // 如果是在 Netlify 预览环境（例如 https://6924...netlify.app），origin 就是对的
      // 直接构建目标 URL
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // 4. 失败：重定向回登录页，并提示错误
  return NextResponse.redirect(`${origin}/auth/login?error=auth-code-error`);
}