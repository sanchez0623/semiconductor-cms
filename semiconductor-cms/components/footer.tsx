import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-slate-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold">Semiconductor</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {t('description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('quickLinks')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('products')}</a></li>
              {/* <li><a href="#" className="text-slate-400 hover:text-white transition-colors">解决方案</a></li> */}
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('news')}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('about')}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('careers')}</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('services')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('support')}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('downloads')}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('faq')}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('training')}</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">{t('customerService')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6">{t('contact')}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-slate-400">contact@semiconductor.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-slate-400">+86 400-123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-1" />
                <span className="text-slate-400">{t('address')}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Semiconductor CMS. {t('rights')}</p>
        </div>
      </div>
    </footer>
  )
}