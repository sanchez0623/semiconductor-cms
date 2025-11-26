import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

export function Footer() {
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
              领先的半导体解决方案提供商，致力于为全球客户提供高品质的产品和服务。
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
            <h3 className="font-bold text-lg mb-6">快速链接</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">产品中心</a></li>
              {/* <li><a href="#" className="text-slate-400 hover:text-white transition-colors">解决方案</a></li> */}
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">新闻动态</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">职业发展</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-6">服务支持</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">技术支持</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">下载中心</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">常见问题</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">培训资源</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white transition-colors">联系客服</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6">联系方式</h3>
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
                <span className="text-slate-400">中国上海市浦东新区科技园区</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2025 Semiconductor CMS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}