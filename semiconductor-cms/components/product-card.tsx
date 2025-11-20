"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Star } from "lucide-react"
import { motion } from "framer-motion"

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
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 hover:shadow-2xl transition-all duration-300">
        {featured && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
              <Star className="w-3 h-3 mr-1" />
              推荐
            </Badge>
          </div>
        )}

        <div className="relative h-64 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent z-10" />
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <CardHeader>
          <Badge variant="secondary" className="w-fit mb-2">
            {category}
          </Badge>
          <CardTitle className="text-2xl group-hover:text-blue-600 transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            {description}
          </CardDescription>
        </CardHeader>

        <CardFooter>
          <Button
            variant="ghost"
            className="group/button w-full justify-between p-6 hover:bg-blue-600 hover:text-white transition-all"
          >
            <span className="font-semibold">了解更多</span>
            <ArrowRight className="h-5 w-5 group-hover/button:translate-x-2 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}