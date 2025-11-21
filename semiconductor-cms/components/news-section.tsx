// components/news-section.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  content?: string;
};

interface NewsSectionProps {
  news: NewsItem[];
}

export function NewsSection({ news }: NewsSectionProps) {
  return (
    <section className="py-24 bg-white dark:bg-slate-950" id="news">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            新闻动态
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            了解最新的行业资讯和公司动态
          </p>
        </div>

        {news.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400">
            暂无新闻
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {news.slice(0, 6).map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="p-6">
                  {item.publishedAt && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                      {new Date(item.publishedAt).toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  {item.content && (
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
                      {item.content}
                    </p>
                  )}
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all">
                    阅读更多
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {news.length > 6 && (
          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-slate-900"
            >
              <Link href="/news">
                查看所有新闻
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
