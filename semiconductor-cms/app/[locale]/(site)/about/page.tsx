import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ArrowRight, Target, Lightbulb, Globe, ShieldCheck, Users } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({locale, namespace: 'About'});

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-950 dark:bg-slate-950 pt-20">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-500/10 via-slate-50/0 to-slate-50/0 dark:from-cyan-900/20 dark:via-slate-950/0 dark:to-slate-950/0 -z-10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {t('title')}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10">
              {t('description')}
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/#contact">
                  {t('joinUs')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Mission & Vision Grid */}
        <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400">
                  <Target className="mr-2 h-4 w-4" /> {t('missionBadge')}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {t.rich('missionTitle', {
                    br: () => <br />
                  })}
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {t('missionDesc')}
                </p>
              </div>
              <div className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center group">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                <div className="relative z-10 p-8 text-center">
                  <p className="text-4xl font-bold text-slate-900 dark:text-white mb-2">10M+</p>
                  <p className="text-slate-500 dark:text-slate-400">{t('statsChips')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">{t('valuesTitle')}</h2>
              <p className="text-slate-600 dark:text-slate-400">{t('valuesSubtitle')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Lightbulb,
                  title: t('valueInnovation'),
                  desc: t('valueInnovationDesc'),
                },
                {
                  icon: ShieldCheck,
                  title: t('valueQuality'),
                  desc: t('valueQualityDesc'),
                },
                {
                  icon: Globe,
                  title: t('valueGlobal'),
                  desc: t('valueGlobalDesc'),
                },
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-slate-900 p-8 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team / Culture Snippet */}
        <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
          <div className="container mx-auto px-4 text-center">
             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mb-6">
                <Users className="h-8 w-8" />
             </div>
             <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">{t('teamTitle')}</h2>
             <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
               {t('teamDesc')}
             </p>
             <Button asChild variant="outline" className="border-slate-300 dark:border-slate-700">
                <Link href="/#contact">{t('contactUs')}</Link>
             </Button>
          </div>
        </section>
      </main>

    </>
  );
}