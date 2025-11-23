// app/(dashboard)/dashboard/products/page.tsx
import Link from "next/link";
import { getAllProducts } from "@/lib/notion/notion-products";

export default async function ProductsListPage() {
  const products = await getAllProducts();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">产品中心</h1>
      <p className="text-slate-600 mb-8">
        浏览全部半导体产品，支持按产品进入详情或提交询价。
      </p>

      {products.length === 0 ? (
        <p className="text-slate-500">暂无产品。</p>
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
                    参考价：¥{p.price}
                  </p>
                )}
                <p className="text-sm text-slate-600 line-clamp-3">
                  {p.description || "暂无描述。"}
                </p>
              </div>
              <div className="mt-4 flex gap-3">
                <Link
                  href={`/products/${p.slug}`}
                  className="text-sm text-sky-700 hover:underline"
                >
                  查看详情
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