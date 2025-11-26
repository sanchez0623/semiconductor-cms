// app/(site)/news/page.tsx
import { getAllNews } from "@/lib/notion/notion-news";
import { Link } from "@/i18n/routing";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'NewsPage'});
  return {
    title: `${t('title')} - Semiconductor CMS`,
    description: t('description'),
    keywords: t('keywords').split(', '),
  };
}

export default async function NewsListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'NewsPage'});
  const news = await getAllNews();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{t('pageTitle')}</h1>

      {news.length === 0 ? (
        <p className="text-slate-500">{t('noNews')}</p>
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
                  {new Date(item.publishedAt).toLocaleDateString(locale === 'zh' ? "zh-CN" : "en-US", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
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