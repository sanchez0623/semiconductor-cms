import { ContactFormsTable } from "./ContactFormsTable";

export default function ContactFormsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">联系表单</h2>
        <p className="text-sm text-slate-500 mt-1">
          查看和管理所有用户提交的联系表单
        </p>
      </div>
      
      <ContactFormsTable />
    </div>
  );
}
