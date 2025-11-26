// app/quote/quote-form.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type ProductItem = {
  id: string;
  name: string;
};

export default function QuoteForm({
  products,
  defaultProductId,
}: {
  products: ProductItem[];
  defaultProductId?: string;
}) {
  const t = useTranslations('QuotePage');
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    productId: defaultProductId ?? "",
    details: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          productId: form.productId || null,
          details: form.details,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || t('submitError'));
      }

      setSuccess(t('success'));
      setForm({
        name: "",
        email: "",
        company: "",
        productId: defaultProductId ?? "",
        details: "",
      });
    } catch (err: any) {
      setError(err.message ?? t('error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-sm bg-white border border-slate-200 rounded-lg p-5">
      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-700">
          {t('contactPerson')}*
        </label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-700">
          {t('email')}*
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-700">
          {t('companyName')}
        </label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-700">
          {t('targetProduct')}
        </label>
        <select
          name="productId"
          value={form.productId}
          onChange={handleChange}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm bg-white"
        >
          <option value="">{t('selectProduct')}</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="block text-xs font-medium text-slate-700">
          {t('requirements')}
        </label>
        <textarea
          name="details"
          value={form.details}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          placeholder={t('requirements')}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {loading ? t('submitting') : t('submit')}
      </button>

      {success && <p className="text-xs text-emerald-600">{success}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}