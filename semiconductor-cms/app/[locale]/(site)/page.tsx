import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { ProductCard } from "@/components/product-card";
import { NewsSection } from "@/components/news-section";
import { ArrowRight } from "lucide-react"; // 引入图标
import dynamic from 'next/dynamic';
import { getTranslations } from 'next-intl/server';

const ContactForm = dynamic(() => import('@/components/contact-form').then(mod => mod.ContactForm), {
  loading: () => <div className="h-96 flex items-center justify-center text-slate-500">Loading...</div>,
});

import { getAllProducts } from "@/lib/notion/notion-products"; 
import { getAllNews } from "@/lib/notion/notion-news";
import { Link } from "@/i18n/routing"; // 引入 Link
import { Button } from "@/components/ui/button"; // 引入 Button
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Metadata'});
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords').split(', '),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'Home'});
  const tCommon = await getTranslations({locale, namespace: 'Common'});
  const products = await getAllProducts(); 
  const news = await getAllNews();

  return (
    <>
      <HeroSection />
      <FeaturesSection />

      {/* Products Section */}
      <section className="py-24 relative" id="products">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
             <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">{t('productsCenter')}</span>
             </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              {t('coreProducts')}
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              {t('productsDesc')}
            </p>
          </div>

          {/* 只展示前 3 个产品 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.slice(0, 3).map((product, index) => (
              <ProductCard
                key={product.id}
                title={product.name}
                description={product.description || tCommon('noDescription')}
                image="/product-placeholder.jpg"
                category={product.category || tCommon('uncategorized')}
                featured={index === 0}
                index={index}
              />
            ))}
          </div>

          {/* 查看更多产品按钮 */}
          <div className="text-center">
            <Button 
              asChild 
              variant="outline"
              className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300 bg-transparent rounded-full px-8"
            >
              <Link href="/products">
                {t('viewAllProducts')} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSection news={news} />

      <div id="contact" className="relative">
        <ContactForm />
      </div>
    </>
  );
}