"use client"

import { motion } from "framer-motion"
import { Zap, Shield, Cpu, TrendingUp, Users, Globe } from "lucide-react"
import { useTranslations } from "next-intl"

export function FeaturesSection() {
  const t = useTranslations('Features');

  const features = [
    {
      icon: Zap,
      title: t('highPerformance'),
      description: t('highPerformanceDesc'),
      color: "from-yellow-400 to-orange-500"
    },
    {
      icon: Shield,
      title: t('reliable'),
      description: t('reliableDesc'),
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Cpu,
      title: t('advancedTech'),
      description: t('advancedTechDesc'),
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: TrendingUp,
      title: t('innovation'),
      description: t('innovationDesc'),
      color: "from-purple-400 to-pink-500"
    },
    {
      icon: Users,
      title: t('expertTeam'),
      description: t('expertTeamDesc'),
      color: "from-red-400 to-rose-500"
    },
    {
      icon: Globe,
      title: t('globalService'),
      description: t('globalServiceDesc'),
      color: "from-indigo-400 to-blue-500"
    }
  ]

  return (
    <section className="py-24 bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:border-transparent transition-all duration-300">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}