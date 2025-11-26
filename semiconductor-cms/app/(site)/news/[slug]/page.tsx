// app/(site)/news/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getNewsBySlug, getNewsPaginated } from "@/lib/notion/notion-news";
import { ArrowLeft, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

// 1. 开启 ISR 增量静态再生，每 3600 秒（1小时）尝试更新一次缓存
export const revalidate = 3600;

// 2. 允许动态参数：如果访问的 slug 不在 generateStaticParams 返回的列表中，
// Next.js 不会返回 404，而是会尝试实时生成页面并缓存下来。
export const dynamicParams = true; 

// 3. 静态路径生成：只预渲染最新的 50 条新闻
// 这样可以极大缩短构建时间，同时保证热点内容秒开。
export async function generateStaticParams() {
  // 假设 getNewsPaginated 是我们之前定义的可以传 pageSize 的方法
  // 如果没有这个方法，可以用 getAllNews().slice(0, 50) 模拟，但最好是在 API 层级就限制查询数量
  const { items } = await getNewsPaginated({ pageSize: 50 });

  return items.map((item) => ({
    slug: item.slug,
  }));
}

// 4. 动态生成 SEO 元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    return {
      title: "新闻未找到",
    };
  }

  return {
    title: `${item.title} - 新闻中心`,
    description: item.content?.slice(0, 100) || "查看新闻详情",
    keywords: ["半导体新闻", "行业动态", item.title],
  };
}

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
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
      {/* ... 保持您满意的深色 UI 代码不变 ... */}
      <div className="max-w-3xl mx-auto mb-8">
        <Button
          variant="ghost"
          asChild
          className="text-slate-400 hover:text-cyan-400 hover:bg-white/5 -ml-4"
        >
          <Link href="/#news" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回新闻列表
          </Link>
        </Button>
      </div>

      <article className="max-w-3xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-cyan-500/80 mb-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              News
            </span>
            {item.publishedAt && (
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(item.publishedAt).toLocaleDateString("zh-CN")}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            {item.title}
          </h1>

          <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 via-blue-500/50 to-transparent opacity-50" />
        </header>

        <div className="prose prose-invert prose-slate max-w-none prose-headings:text-slate-200 prose-p:text-slate-300 prose-a:text-cyan-400 prose-strong:text-white prose-img:rounded-xl prose-img:border prose-img:border-white/10">
          {item.content ? (
            <div className="whitespace-pre-wrap leading-relaxed">
              {item.content}
            </div>
          ) : (
            <p className="text-slate-500 italic">暂无详细内容。</p>
          )}
        </div>
      </article>
    </div>
  );
}