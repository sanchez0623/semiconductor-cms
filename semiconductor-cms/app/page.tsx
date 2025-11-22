// app/page.tsx
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { ProductCard } from "@/components/product-card";
import { ContactForm } from "@/components/contact-form";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Products Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900" id="products">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                我们的产品
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                高品质的半导体解决方案
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.slice(0, 6).map((product, index) => (
                <ProductCard
                  key={product.id}
                  title={product.name}
                  description={product.description || "暂无描述"}
                  image="/product-placeholder.jpg" // 替换为实际图片
                  category={product.category || "未分类"}
                  featured={index === 0}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* News Section */}
        <NewsSection news={news} />

        {/* Contact Form */}
        <div id="contact">
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}