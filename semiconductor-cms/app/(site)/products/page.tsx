import { getProductsPaginated, getProductCategories } from "@/lib/notion/notion-products";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteProductSearch } from "@/components/site-product-search";

export default async function ProductsListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
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
              返回首页
            </Link>
          </Button>
        </div>

        {/* 标题区域 - 样式调整 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">产品中心</h1>
          <p className="text-xl text-slate-400">
            浏览全部半导体产品
          </p>
        </div>

        {/* 搜索区域 */}
        <SiteProductSearch categories={categories} />

        {/* 列表区域 */}
        {products.length === 0 ? (
          <p className="text-center text-slate-500 mt-12">暂无产品。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {products.map((p, index) => (
              <ProductCard
                key={p.id}
                title={p.name}
                description={p.description || "暂无描述"}
                image="/product-placeholder.jpg"
                category={p.category || "未分类"}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}