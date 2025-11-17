// app/_components/home-contact-section.tsx
"use client";

import { useState } from "react";

export default function HomeContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "提交失败");
      }

      setSuccess("提交成功，我们会尽快联系你。");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setError(err.message ?? "服务器错误，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-sm">
      <div className="space-y-1">
        <label className="block text-xs font-medium">姓名*</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-2 py-1.5 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium">邮箱*</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-2 py-1.5 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium">主题</label>
        <input
          name="subject"
          value={form.subject}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-2 py-1.5 text-sm"
        />
      </div>
      <div className="space-y-1">
        <label className="block text-xs font-medium">留言*</label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          required
          rows={3}
          className="w-full rounded-md border border-slate-700 bg-slate-950/40 px-2 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-md bg-slate-50 px-3 py-2 text-xs font-medium text-slate-900 hover:bg-slate-200 disabled:opacity-60"
      >
        {loading ? "提交中..." : "提交联系表单"}
      </button>
      {success && <p className="text-xs text-emerald-300">{success}</p>}
      {error && <p className="text-xs text-red-300">{error}</p>}
    </form>
  );
}