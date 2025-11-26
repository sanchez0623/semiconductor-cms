// app/(dashboard)/dashboard/products/page.tsx
import Link from "next/link";
import { getProductsPaginated, getProductCategories } from "@/lib/notion/notion-products";
import { DashboardProductSearch } from "./_components/dashboard-product-search";
import { getTranslations } from "next-intl/server";

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations('DashboardProducts');
  const resolvedSearchParams = await searchParams;
  const category = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;
  const search = typeof resolvedSearchParams.search === "string" ? resolvedSearchParams.search : undefined;

  const [productsData, categories] = await Promise.all([
    getProductsPaginated({ category, search, pageSize: 100 }),
    getProductCategories(),
  ]);

  const products = productsData.items;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">{t('title')}</h1>
      <p className="text-slate-600 mb-8">
        {t('description')}
      </p>

      <DashboardProductSearch categories={categories} />

      {products.length === 0 ? (
        <p className="text-slate-500">{t('noProducts')}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="border border-slate-200 rounded-lg p-4 flex flex-col justify-between"
            >
              <div>
                {/* 标题跳详情 */}
                <h2 className="text-lg font-semibold mb-1">
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-sky-700 hover:underline"
                  >
                    {p.name}
                  </Link>
                </h2>
                {p.category && (
                  <p className="text-xs text-slate-500 mb-1">{p.category}</p>
                )}
                {p.price && (
                  <p className="text-sm text-emerald-700 font-medium mb-2">
                    {t('referencePrice')}{p.price}
                  </p>
                )}
                <p className="text-sm text-slate-600 line-clamp-3">
                  {p.description || t('noDescription')}
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/products/${p.slug}`}
                  className="text-sm text-sky-700 hover:underline"
                >
                  {t('viewDetails')}
                </Link>
                {/* <Link
                  href={`/quote?productId=${p.id}`}
                  className="ml-auto text-sm text-sky-700 hover:underline"
                >
                  直接询价
                </Link> */}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}