// app/news/[slug]/page.tsx
import { notFound } from "next/navigation";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  published_at: string | null;
  created_at: string;
};

async function fetchNewsBySlug(slug: string): Promise<NewsItem | null> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/content/news?slug=${encodeURIComponent(slug)}`, {
    // 服务端渲染，适度缓存
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

export default async function NewsDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await fetchNewsBySlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
      {article.published_at && (
        <p className="text-sm text-slate-500 mb-6">
          发布于 {new Date(article.published_at).toLocaleDateString("zh-CN")}
        </p>
      )}
      <article className="prose prose-slate max-w-none">
        {article.content || "暂无详细内容。"}
      </article>
    </main>
  );
}