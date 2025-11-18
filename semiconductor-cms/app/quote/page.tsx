// app/quote/page.tsx
import QuoteForm from "./quote-form";
import { headers } from "next/headers";

type ProductItem = {
  id: string;
  name: string;
};

async function fetchProducts(opts: { id?: string; q?: string } = {}): Promise<ProductItem[]> {
  const h = headers();
  const proto = (await h).get("x-forwarded-proto") ?? "http";
  const host = (await h).get("host") ?? "localhost:3000";
  const base = `${proto}://${host}`;
  const params = new URLSearchParams();
  params.set("fields", "id,name");
  if (opts.id) {
    params.set("id", opts.id);
  } else {
    params.set("limit", "50");
    if (opts.q) params.set("q", opts.q);
  }
  const res = await fetch(`${base}/api/content/products?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map((p: any) => ({ id: p.id, name: p.name }));
}

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function QuotePage({ searchParams }: Props) {
  const productParam = searchParams?.product;
  const defaultProductId = Array.isArray(productParam)
    ? productParam[0]
    : typeof productParam === "string"
    ? productParam
    : undefined;
  let products = await fetchProducts(defaultProductId ? { id: defaultProductId } : {});
  if (defaultProductId && products.every((p) => p.id !== defaultProductId)) {
    const extra = await fetchProducts({ id: defaultProductId });
    if (extra.length) products = [extra[0], ...products];
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">产品询价</h1>
        <p className="text-sm text-slate-600 mb-6">
          请选择意向产品并填写需求信息，我们会在 1~2 个工作日内回复报价。
        </p>
        <QuoteForm products={products} defaultProductId={defaultProductId} />
      </section>
    </main>
  );
}