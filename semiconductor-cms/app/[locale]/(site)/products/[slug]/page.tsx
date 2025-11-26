// app/(site)/products/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getProductBySlug, getProductsPaginated } from "@/lib/notion/notion-products";
import { ArrowLeft, Cpu, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";
import { getTranslations } from 'next-intl/server';

// 1. 缓存策略：1小时更新一次
export const revalidate = 3600;

// 2. 允许动态生成未预渲染的页面
export const dynamicParams = true;

// 3. 预生成策略：只预生成前 50 个热门/最新产品
export async function generateStaticParams() {
  const { items } = await getProductsPaginated({ pageSize: 50 });

  return items.map((product) => ({
    slug: product.slug,
  }));
}

// 4. 动态生成 SEO 元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({locale, namespace: 'ProductDetailPage'});
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: t('notFound'),
    };
  }

  return {
    title: `${product.name} - ${t('productsCenter')}`,
    description: product.description || t('viewDetails', {name: product.name}),
    keywords: [product.name, product.category || "semiconductor", ...t('keywords').split(', ')].filter(Boolean),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const t = await getTranslations({locale, namespace: 'ProductDetailPage'});
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-950">
      {/* ... 保持您满意的深色 UI 代码不变 ... */}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="text-slate-400 hover:text-cyan-400 hover:bg-white/5 -ml-4"
          >
            <Link href="/#products" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('backToCenter')}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="relative">
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl shadow-cyan-900/20 group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#020617_100%)] flex items-center justify-center">
                <Cpu className="w-32 h-32 text-slate-700 group-hover:text-cyan-600/50 transition-colors duration-500" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
              <div className="absolute inset-0 border-2 border-white/5 rounded-2xl group-hover:border-cyan-500/30 transition-colors duration-500" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              {[
                { icon: Zap, label: t('highPerformance'), color: "text-yellow-400" },
                { icon: ShieldCheck, label: t('industrialGrade'), color: "text-emerald-400" },
                { icon: Cpu, label: t('lowPower'), color: "text-blue-400" },
              ].map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                  <feature.icon className={`w-6 h-6 mb-2 ${feature.color}`} />
                  <span className="text-xs text-slate-400">{feature.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="mb-6">
              {product.category && (
                <Badge variant="outline" className="mb-4 border-cyan-500/30 text-cyan-400 bg-cyan-950/30 px-3 py-1">
                  {product.category}
                </Badge>
              )}
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                {product.name}
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
            </div>

            <div className="prose prose-invert mb-10 text-slate-300 leading-relaxed">
              <p>{product.description || t('noDescription')}</p>
            </div>

            <div className="space-y-8">
              {product.price && (
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-slate-400">{t('referencePrice')}</span>
                  <span className="text-3xl font-bold text-cyan-400">¥{product.price}</span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-900/20 text-lg h-14 px-8 rounded-full"
                >
                  <Link href={`/quote?productId=${product.id}`}>
                    {t('requestQuote')}
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-cyan-300 h-14 px-8 rounded-full"
                >
                  {t('downloadDatasheet')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}