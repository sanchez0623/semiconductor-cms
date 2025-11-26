// app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "./_components/DashboardStats";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // 🔒 安全修正：使用 getUser()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // 如果获取用户失败或用户不存在，重定向
  if (error || !user) {
    redirect(`/auth/login?redirect=${encodeURIComponent("/dashboard")}`);
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-4">后台仪表盘</h1>
      <p className="text-sm text-slate-600">当前登录：{user.email}</p>
      
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">概览</h2>
        <p className="text-sm text-slate-500 mt-1">
          这里是半导体 CMS 的控制面板，你可以管理新闻、产品以及表单数据。
        </p>
      </div>

      <DashboardStats />
    </div>
    </main>
  );
}