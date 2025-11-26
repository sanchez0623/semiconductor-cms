// components/news-section.tsx
import { Link } from "@/i18n/routing";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations('Home');
  const tNews = useTranslations('NewsSection');
  const locale = useLocale();

  return (
    <section className="py-24 bg-slate-950 relative border-t border-white/5" id="news">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-blue-400 text-xs font-bold tracking-wider uppercase">{t('latestNews')}</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
            {t('newsTitle')}
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('newsDesc')}
          </p>
        </div>

        {news.length === 0 ? (
          <p className="text-center text-slate-500">{t('noNews')}</p>
        ) : (
          // 只展示前 3 条新闻
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {news.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex flex-col bg-slate-900/40 rounded-2xl overflow-hidden border border-white/5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-900/10 transition-all duration-300"
              >
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    {item.publishedAt ? (
                      new Date(item.publishedAt).toLocaleDateString(locale === 'zh' ? "zh-CN" : "en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      t('unknownDate')
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  
                  {item.content && (
                    <p className="text-slate-400 line-clamp-3 mb-6 flex-1">
                      {item.content}
                    </p>
                  )}
                  
                  <div className="flex items-center text-blue-500 font-medium group-hover:gap-2 transition-all mt-auto pt-4 border-t border-white/5">
                    {tNews('readMore')}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 查看所有新闻按钮 */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 bg-transparent rounded-full px-8"
          >
            <Link href="/news">
              {t('viewAllNews')} <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}