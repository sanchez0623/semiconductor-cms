// app/page.tsx
import HomeContactSection from "./_components/home-contact-section";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
};

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  price: string | null;
};

async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/content/news`, {
    next: { revalidate: 60 }, // 1 分钟缓存
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

async function fetchProducts(): Promise<ProductItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/content/products`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function HomePage() {
  const [news, products] = await Promise.all([fetchNews(), fetchProducts()]);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16 grid gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              半导体解决方案 CMS
            </h1>
            <p className="mt-4 text-slate-600">
              管理你的半导体产品、新闻动态及客户咨询，一体化的内容管理平台。
            </p>
          </div>
          <div className="bg-slate-900 text-slate-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">快速联系</h2>
            <p className="text-sm text-slate-300 mb-4">
              填写表单，销售工程师会尽快与您联系。
            </p>
            <HomeContactSection />
          </div>
        </div>
      </section>

      {/* 新闻 & 产品预览 */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-2">
        {/* 新闻预览 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">最新新闻</h2>
            <a
              href="/news"
              className="text-sm text-sky-700 hover:underline"
            >
              查看全部
            </a>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 divide-y">
            {news.length === 0 && (
              <p className="p-4 text-sm text-slate-500">暂无新闻。</p>
            )}
            {news.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={`/news/${item.slug}`}
                className="block px-4 py-3 hover:bg-slate-50"
              >
                <p className="text-sm font-medium text-slate-900">
                  {item.title}
                </p>
                {item.published_at && (
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(item.published_at).toLocaleDateString("zh-CN")}
                  </p>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* 产品预览 */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">精选产品</h2>
            <a
              href="/products"
              className="text-sm text-sky-700 hover:underline"
            >
              查看全部
            </a>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 divide-y">
            {products.length === 0 && (
              <p className="p-4 text-sm text-slate-500">暂无产品。</p>
            )}
            {products.slice(0, 5).map((p) => (
              <a
                key={p.id}
                href={`/products/${p.slug}`}
                className="block px-4 py-3 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-900">
                    {p.name}
                  </p>
                  {p.price && (
                    <p className="text-sm text-slate-700">¥{p.price}</p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}