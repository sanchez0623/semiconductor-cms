// app/auth/callback/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type CallbackSearchParams = {
  code?: string;
  redirect?: string;
  next?: string;
};

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: CallbackSearchParams;
}) {
  const { code, redirect: redirectParam, next } = searchParams;
  const targetPath = redirectParam || next || "/dashboard";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // 如果交换 code 失败，重定向到登录页并附带错误信息
      console.error("Authentication error:", error.message);
      redirect(
        `/auth/login?error=auth_failed&error_description=${encodeURIComponent(
          "无法验证您的身份，请重试。"
        )}`
      );
    }
  }

  // 认证成功后，cookie 已被 @supabase/ssr 设置
  // 现在重定向到用户最初想访问的页面
  redirect(targetPath);
}