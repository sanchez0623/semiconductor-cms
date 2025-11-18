// app/(dashboard)/news/page.tsx
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  published_at: string | null;
};

async function getNewsList(): Promise<NewsItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("news")
    .select("id, title, slug, content, published_at")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
    return [];
  }

  return (data ?? []) as NewsItem[];
}

export default async function NewsPage() {
  const news = await getNewsList();

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