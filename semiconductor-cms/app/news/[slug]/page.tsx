// app/news/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/notion/notion-news";

interface NewsDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">{item.title}</h1>

      {(item.publishedAt) && (
        <p className="text-sm text-slate-500 mb-6">
          发布于{" "}
          {new Date(
            item.publishedAt || ""
          ).toLocaleDateString("zh-CN")}
        </p>
      )}

      <article className="prose prose-slate max-w-none">
        {item.content || "暂无详细内容。"}
      </article>
    </main>
  );
}