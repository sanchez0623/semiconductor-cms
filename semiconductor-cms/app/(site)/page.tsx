import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { ProductCard } from "@/components/product-card";
import { ContactForm } from "@/components/contact-form";
import { NewsSection } from "@/components/news-section";
import { getAllNews } from "@/lib/notion/notion-news";

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  price: string | null;
  description?: string;
  category?: string;
};

async function fetchProducts(): Promise<ProductItem[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/content/products`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data ?? [];
}

export default async function HomePage() {
  const products = await fetchProducts();
  const news = await getAllNews();

  return (
    <>
      {/* Hero Section (已包含锚点功能如果 Hero 内部有的话，通常没有) */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Products Section - 修复锚点 id="products" */}
      <section className="py-24 relative" id="products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
             <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">Products Center</span>
             </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              核心半导体产品
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              高品质的半导体解决方案，赋能您的创新
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 6).map((product, index) => (
              <ProductCard
                key={product.id}
                title={product.name}
                description={product.description || "暂无描述"}
                image="/product-placeholder.jpg" // 请确保此图片存在或替换
                category={product.category || "未分类"}
                featured={index === 0}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* News Section - 组件内部通常包含 id="news"，如果没有请检查组件 */}
      <NewsSection news={news} />

      {/* Contact Form - 修复锚点 id="contact" */}
      <div id="contact" className="relative">
        <ContactForm />
      </div>
    </>
  );
}