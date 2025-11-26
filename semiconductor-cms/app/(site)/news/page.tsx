// app/(site)/news/page.tsx
import { getAllNews } from "@/lib/notion/notion-news";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "新闻中心 - Semiconductor CMS",
  description: "获取最新的半导体行业动态、公司新闻和技术资讯。",
  keywords: ["新闻中心", "行业动态", "技术资讯", "半导体新闻"],
};

export default async function NewsListPage() {
  const news = await getAllNews();

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
              {item.publishedAt && (
                <p className="text-xs text-slate-500 mb-2">
                  {new Date(item.publishedAt).toLocaleDateString("zh-CN")}
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