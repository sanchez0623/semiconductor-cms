"use client"

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Cpu } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

interface ProductCardProps {
  title: string
  description: string
  image: string
  category: string
  featured?: boolean
  index?: number
}

export function ProductCard({ title, description, image, category, featured, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div className="group relative rounded-2xl bg-slate-900/40 border border-white/5 hover:border-cyan-500/50 overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)]">
        
        {/* 图片区域 */}
        <div className="relative h-48 overflow-hidden bg-slate-900">
           <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 opacity-80" />
           {/* Placeholder image style */}
           <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#0f172a_100%)] group-hover:scale-105 transition-transform duration-700 flex items-center justify-center relative">
              <Image 
                src={image} 
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
           </div>
           
           {featured && (
             <Badge className="absolute top-4 right-4 z-20 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 backdrop-blur-md">
               旗舰新品
             </Badge>
           )}
        </div>

        <div className="p-6 relative z-20">
          <div className="text-xs font-medium text-cyan-500 mb-2 uppercase tracking-wider">{category}</div>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{description}</p>
          
          <div className="flex items-center text-sm font-medium text-white/60 group-hover:text-white transition-colors">
            了解详情 <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-500" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}