"use client";

import { useEffect, useState, Suspense } from "react"; // 引入 Suspense
import { useSearchParams } from "next/navigation";

type ProductOption = {
  id: string;
  name: string;
};

function QuoteContent() {
  const searchParams = useSearchParams();
  const preselectedId = searchParams.get("productId");

  const [products, setProducts] = useState<ProductOption[]>([]);
  const [productId, setProductId] = useState<string>("");
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/content/products");
        if (!res.ok) throw new Error("获取产品列表失败");
        const json = await res.json();
        const list: ProductOption[] = (json.data ?? []).map((p: any) => ({
          id: p.id,
          name: p.name,
        }));
        setProducts(list);

        if (preselectedId && list.some((p) => p.id === preselectedId)) {
          setProductId(preselectedId);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchProducts();
  }, [preselectedId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: productId || null,
          company,
          contact,
          phone,
          email,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error("提交失败");
      }

      setSubmitResult("提交成功，我们会尽快与您联系。");
      setMessage("");
    } catch (err) {
      console.error(err);
      setSubmitResult("提交失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-white">提交询价</h1>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            目标产品
          </label>
          <select
            className="w-full border border-slate-700 bg-slate-900 text-slate-200 rounded-md px-3 py-2 text-sm"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          >
            <option value="">请选择产品（可选）</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            公司名称
          </label>
          <input
            className="w-full border border-slate-700 bg-slate-900 text-slate-200 rounded-md px-3 py-2 text-sm"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            联系人
          </label>
          <input
            className="w-full border border-slate-700 bg-slate-900 text-slate-200 rounded-md px-3 py-2 text-sm"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            联系电话
          </label>
          <input
            className="w-full border border-slate-700 bg-slate-900 text-slate-200 rounded-md px-3 py-2 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            电子邮箱
          </label>
          <input
            type="email"
            className="w-full border border-slate-700 bg-slate-900 text-slate-200 rounded-md px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            需求描述
          </label>
          <textarea
            className="w-full border border-slate-700 bg-slate-900 text-slate-200 rounded-md px-3 py-2 text-sm min-h-[120px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 text-sm font-medium disabled:opacity-60 transition-colors"
        >
          {submitting ? "提交中..." : "提交询价"}
        </button>

        {submitResult && (
          <p className="text-sm text-slate-400 mt-2">{submitResult}</p>
        )}
      </form>
    </main>
  );
}

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20">
       <Suspense fallback={<div className="p-10 text-center text-slate-400">加载中...</div>}>
        <QuoteContent />
       </Suspense>
    </div>
  );
}