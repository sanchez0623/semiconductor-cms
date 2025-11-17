// app/products/page.tsx

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  price: string | null;
};

async function fetchProducts(): Promise<ProductItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/content/products`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">产品中心</h1>
        <p className="text-sm text-slate-600 mb-6">
          浏览全部半导体产品，支持按产品进入详情或提交询价。
        </p>

        {products.length === 0 && (
          <p className="text-sm text-slate-500">暂无产品。</p>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col"
            >
              {/* 占位图片块，后续可替换为真实图片 */}
              <div className="mb-3 aspect-video rounded-md bg-slate-100" />

              <h2 className="text-sm font-semibold text-slate-900">{p.name}</h2>
              {p.category && (
                <p className="mt-1 text-xs text-slate-500">{p.category}</p>
              )}
              {p.description && (
                <p className="mt-2 text-xs text-slate-600 line-clamp-3">
                  {p.description}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between">
                {p.price ? (
                  <p className="text-sm font-medium text-slate-900">
                    ¥{p.price}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">价格面议</p>
                )}
                <a
                  href={`/quote?product=${encodeURIComponent(p.id)}`}
                  className="text-xs text-sky-700 hover:underline"
                >
                  询价
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}