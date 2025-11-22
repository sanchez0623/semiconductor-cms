// app/(site)/news/[slug]/page.tsx
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/notion/notion-news";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      {/* 顶部导航 */}
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

      {/* 文章头部 */}
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

        {/* 文章正文 - 使用 prose-invert 适配深色模式 */}
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