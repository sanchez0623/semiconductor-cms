import { getAllProducts } from "@/lib/notion/notion-products";
import { ProductCard } from "@/components/product-card";

export default async function ProductsListPage() {
  const products = await getAllProducts();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6">产品中心</h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            浏览全部半导体产品
          </p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-slate-500">暂无产品。</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
    </main>
  );
}