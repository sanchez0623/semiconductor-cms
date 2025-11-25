// app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getNewsCount } from "@/lib/notion/notion-news";
import { getProductsCount } from "@/lib/notion/notion-products";

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

  // Fetch data in parallel
  const [newsCount, productsCount, unreadContactForms, unhandledQuoteForms] = await Promise.all([
    getNewsCount(),
    getProductsCount(),
    supabase
      .from("contact_forms")
      .select("*", { count: "exact", head: true })
      .not("handled", "eq", true)
      .then(({ count }) => count),
    supabase
      .from("quote_forms")
      .select("*", { count: "exact", head: true })
      .not("handled", "eq", true)
      .then(({ count }) => count),
  ]);

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

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">新闻数量</p>
          <p className="text-2xl font-semibold mt-2">{newsCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">产品数量</p>
          <p className="text-2xl font-semibold mt-2">{productsCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">未读联系表单</p>
          <p className="text-2xl font-semibold mt-2">{unreadContactForms ?? "—"}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">未处理询价表单</p>
          <p className="text-2xl font-semibold mt-2">{unhandledQuoteForms ?? "—"}</p>
        </div>
      </div>
    </div>
    </main>
  );
}