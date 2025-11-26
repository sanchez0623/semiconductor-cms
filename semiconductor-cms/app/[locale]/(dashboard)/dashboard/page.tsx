// app/(dashboard)/dashboard/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "./_components/DashboardStats";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const t = await getTranslations('Dashboard');
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
      <h1 className="text-2xl font-semibold mb-4">{t('title')}</h1>
      <p className="text-sm text-slate-600">{t('loggedInAs', { email: user.email || 'Unknown' })}</p>
      
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{t('overview')}</h2>
        <p className="text-sm text-slate-500 mt-1">
          {t('description')}
        </p>
      </div>

      <DashboardStats />
    </div>
    </main>
  );
}