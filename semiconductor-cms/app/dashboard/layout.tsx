// app/(dashboard)/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-slate-800">
          <span className="font-semibold text-lg">Semi CMS</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            总览
          </Link>
          <Link
            href="/dashboard/news"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            新闻管理
          </Link>
          <Link
            href="/dashboard/products"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            产品管理
          </Link>
          <Link
            href="/dashboard/contact-forms"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            联系表单
          </Link>
          <Link
            href="/dashboard/quote-forms"
            className="block px-3 py-2 rounded hover:bg-slate-800"
          >
            询价表单
          </Link>
        </nav>

        <div className="px-4 py-3 border-t border-slate-800 text-xs text-slate-400">
          Semiconductor CMS · Admin
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">控制台</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-600">admin@example.com</span>
            <Button variant="outline" size="sm">
              退出
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}