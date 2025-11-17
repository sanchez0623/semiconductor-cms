// app/quote/page.tsx
import QuoteForm from "./quote-form";

type ProductItem = {
  id: string;
  name: string;
};

async function fetchProducts(): Promise<ProductItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/content/products`,
    { cache: "no-store" }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return (json.data ?? []).map((p: any) => ({
    id: p.id,
    name: p.name,
  }));
}

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function QuotePage({ searchParams }: Props) {
  const products = await fetchProducts();
  const defaultProductId =
    typeof searchParams.product === "string" ? searchParams.product : undefined;

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