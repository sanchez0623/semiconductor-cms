import { getProductsPaginated, getProductCategories } from "@/lib/notion/notion-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { SiteProductSearch } from "@/components/site-product-search";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'ProductsPage'});
  return {
    title: `${t('title')} - Semiconductor CMS`,
    description: t('description'),
    keywords: t('keywords').split(', '),
  };
}

export default async function ProductsListPage({
  searchParams,
  params
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'ProductsPage'});
  const tCommon = await getTranslations({locale, namespace: 'Common'});
  const resolvedSearchParams = await searchParams;
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;

  const [productsData, categories] = await Promise.all([
    getProductsPaginated({ category, search, pageSize: 100 }),
    getProductCategories(),
  ]);

  const products = productsData.items;

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        {/* 顶部导航 - 新增 */}
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="text-slate-400 hover:text-cyan-400 hover:bg-white/5 -ml-4"
          >
            <Link href="/#products" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('backHome')}
            </Link>
          </Button>
        </div>

        {/* 标题区域 - 样式调整 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">{t('pageTitle')}</h1>
          <p className="text-xl text-slate-400">
            {t('pageSubtitle')}
          </p>
        </div>

        {/* 搜索区域 */}
        <SiteProductSearch categories={categories} />

        {/* 列表区域 */}
        {products.length === 0 ? (
          <p className="text-center text-slate-500 mt-12">{t('noProducts')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {products.map((p, index) => (
              <ProductCard
                key={p.id}
                title={p.name}
                description={p.description || tCommon('noDescription')}
                image="/product-placeholder.jpg"
                category={p.category || tCommon('uncategorized')}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}