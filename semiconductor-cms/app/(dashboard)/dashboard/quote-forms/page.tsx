import { QuoteFormsTable } from "./QuoteFormsTable";

export default function QuoteFormsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">询价表单</h2>
        <p className="text-sm text-slate-500 mt-1">
          查看和管理所有用户提交的询价表单
        </p>
      </div>
      
      <QuoteFormsTable />
    </div>
  );
}
