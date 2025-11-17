// app/news/page.tsx
type NewsItem = {
  id: string;
  title: string;
  slug: string;
  published_at: string | null;
};

async function fetchNews(): Promise<NewsItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/content/news`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function NewsListPage() {
  const news = await fetchNews();

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight mb-2">新闻动态</h1>
        <p className="text-sm text-slate-600 mb-6">
          了解公司最新的产品发布、技术更新和行业信息。
        </p>

        {news.length === 0 && (
          <p className="text-sm text-slate-500">暂无新闻。</p>
        )}

        <div className="space-y-3">
          {news.map((item) => (
            <a
              key={item.id}
              href={`/news/${item.slug}`}
              className="block bg-white border border-slate-200 rounded-lg px-4 py-3 hover:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-sm font-medium text-slate-900">
                  {item.title}
                </h2>
                {item.published_at && (
                  <span className="text-xs text-slate-500">
                    {new Date(item.published_at).toLocaleDateString("zh-CN")}
                  </span>
                )}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}