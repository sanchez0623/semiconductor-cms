// app/(dashboard)/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  price: string | null;
  created_at: string | null;
};

async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching product detail:", error);
    return null;
  }

  return data as Product | null;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

      {product.category && (
        <p className="text-sm text-slate-500 mb-1">{product.category}</p>
      )}

      {product.price && (
        <p className="text-lg font-semibold text-emerald-700 mb-4">
          参考价：¥{product.price}
        </p>
      )}

      <p className="text-slate-700 mb-8">
        {product.description || "暂无详细介绍。"}
      </p>

      <Link
        href={`/quote?productId=${product.id}`}
        className="inline-flex items-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 text-sm font-medium"
      >
        针对该产品提交询价
      </Link>
    </main>
  );
}