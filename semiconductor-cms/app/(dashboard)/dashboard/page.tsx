// app/(dashboard)/dashboard/page.tsx

export default function DashboardHome() {
  return (
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
          <p className="text-2xl font-semibold mt-2">—</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">产品数量</p>
          <p className="text-2xl font-semibold mt-2">—</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">未读联系表单</p>
          <p className="text-2xl font-semibold mt-2">—</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <p className="text-xs text-slate-500">未处理询价表单</p>
          <p className="text-2xl font-semibold mt-2">—</p>
        </div>
      </div>
    </div>
  );
}