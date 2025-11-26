// app/(dashboard)/layout.tsx
import type { ReactNode } from "react";
import { Link, redirect } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import {
  LayoutDashboard,
  Newspaper,
  Package,
  MessageSquare,
  FileText,
  LogOut,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations('DashboardLayout');
  const handleLogout = async () => {
    "use server";

    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* 侧边栏：深色收敛视觉 */}
      <aside className="w-64 bg-[#1E293B] text-slate-300 flex flex-col shadow-xl sticky top-0 h-screen z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-700/50">
          <span className="font-bold text-lg text-white tracking-wide">
            Semi<span className="text-cyan-400">Admin</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 text-sm font-medium">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />}>{t('dashboard')}</NavLink>
          <div className="pt-4 pb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('contentManagement')}</div>
          <NavLink href="/dashboard/news" icon={<Newspaper size={18} />}>{t('news')}</NavLink>
          <NavLink href="/dashboard/products" icon={<Package size={18} />}>{t('products')}</NavLink>
          <div className="pt-4 pb-2 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('customerFeedback')}</div>
          <NavLink href="/dashboard/contact-forms" icon={<MessageSquare size={18} />}>{t('contactForms')}</NavLink>
          <NavLink href="/dashboard/quote-forms" icon={<FileText size={18} />}>{t('quoteRecords')}</NavLink>
        </nav>

        <div className="p-4 border-t border-slate-700/50">
           <div className="flex items-center gap-3 px-3 py-3 text-xs text-slate-400 bg-slate-800/50 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              {t('systemOperational')}
           </div>
        </div>
      </aside>

      {/* 主内容区：极简白底 */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm sticky top-0 z-10">
          <h1 className="text-base font-medium text-gray-700">{t('adminConsole')}</h1>
          <div className="flex items-center gap-4">
             <span className="text-sm text-gray-500">{t('administrator')}</span>
             <form action={handleLogout}>
               <Button
                 type="submit"
                 variant="ghost"
                 size="sm"
                 className="text-red-600 hover:bg-red-50 hover:text-red-700"
               >
                 <LogOut className="w-4 h-4 mr-2" /> {t('logout')}
               </Button>
             </form>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, children, icon }: { href: string; children: ReactNode; icon?: ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-slate-800 hover:text-white transition-colors group"
    >
      <span className="text-slate-400 group-hover:text-cyan-400 transition-colors">{icon}</span>
      {children}
    </Link>
  );
}