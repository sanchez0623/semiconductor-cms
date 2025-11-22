// app/auth/callback/route.ts
import { createClient } from "@/lib/supabase/route-handler";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirect = requestUrl.searchParams.get("redirect") || "/dashboard";

  console.log("=== Auth Callback Debug ===");
  console.log("Code:", code);
  console.log("Full URL:", requestUrl.href);
  
  if (code) {
    const supabase = await createClient();
    
    // 交换 code 获取 session
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      // 认证失败，重定向到登录页并显示错误
      return NextResponse.redirect(
        new URL(`/auth/login?error=${encodeURIComponent("认证失败，请重试")}`, requestUrl.origin)
      );
    }
  }

  // 认证成功，重定向到目标页面
  return NextResponse.redirect(new URL(redirect, requestUrl.origin));
}