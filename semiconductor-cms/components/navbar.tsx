"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/language-switcher"

export function Navbar() {
  const t = useTranslations('Navigation');
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // 定义链接样式，避免重复代码
  const linkClass = "text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors relative group"
  const activeIndicator = (
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 transition-all group-hover:w-full opacity-0 group-hover:opacity-100" />
  )

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "bg-slate-950/80 backdrop-blur-xl border-white/10 py-4 shadow-lg shadow-cyan-900/5"
          : "bg-transparent border-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo (Left) */}
          <div className="flex-shrink-0 z-20 relative">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-shadow duration-300">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Semi<span className="text-cyan-400">conductor</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation (Center - Absolute Position) */}
          <div className="hidden lg:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/#products" className={linkClass}>
              {t('products')}
              {activeIndicator}
            </Link>
            <Link href="/#news" className={linkClass}>
              {t('news')}
              {activeIndicator}
            </Link>
            <Link href="/about" className={linkClass}> {/* ✅ 指向新页面 */}
              {t('about')}
              {activeIndicator}
            </Link>
          </div>

          {/* CTA Buttons (Right) */}
          <div className="hidden lg:flex items-center gap-4 z-20 relative">
            <LanguageSwitcher />
            <Button 
                asChild
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm rounded-full px-6 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.5)] transition-all duration-300"
                >
                <Link href="/#contact">{t('contact')}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden z-20 relative ml-auto flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 overflow-hidden absolute top-full left-0 right-0"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col">
              <Link 
                href="/#products" 
                className="text-slate-300 hover:text-cyan-400 py-2 text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('products')}
              </Link>
              <Link 
                href="/#news" 
                className="text-slate-300 hover:text-cyan-400 py-2 text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('news')}
              </Link>
              <Link 
                href="/about" 
                className="text-slate-300 hover:text-cyan-400 py-2 text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('about')}
              </Link>
              <Link 
                href="/#contact" 
                className="text-cyan-400 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('contact')} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}