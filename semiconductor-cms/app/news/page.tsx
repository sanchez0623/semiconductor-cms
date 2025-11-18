// app/news/page.tsx
import Link from "next/link";

type NewsListItem = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  published_at: string | null;
};

async function fetchNews(): Promise<NewsListItem[]> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/content/news`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function NewsPage() {
  const news = await fetchNews();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">新闻中心</h1>

      {news.length === 0 ? (
        <p className="text-slate-500">暂无新闻。</p>
      ) : (
        <ul className="space-y-6">
          {news.map((item) => (
            <li key={item.id} className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-semibold mb-1">
                <Link
                  href={`/news/${item.slug}`}
                  className="text-sky-700 hover:underline"
                >
                  {item.title}
                </Link>
              </h2>
              {item.published_at && (
                <p className="text-xs text-slate-500 mb-2">
                  {new Date(item.published_at).toLocaleDateString("zh-CN")}
                </p>
              )}
              {item.content && (
                <p className="text-sm text-slate-600 line-clamp-2">
                  {item.content}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}