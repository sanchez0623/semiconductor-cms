import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-200 selection:bg-cyan-500/30 overflow-x-hidden">
      {/* 全局背景特效：深色噪点与微光 */}
      <div className="fixed inset-0 bg-[url('/product-placeholder.png')] opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"></div>
      <div className="fixed top-[-20%] right-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
      <div className="fixed bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* 悬浮导航栏 */}
      <div className="relative z-50">
        <Navbar />
      </div>

      <main className="flex-1 relative z-10">
        {children}
      </main>

      <div className="relative z-10 border-t border-white/5 bg-slate-950">
        <Footer />
      </div>
    </div>
  );
}