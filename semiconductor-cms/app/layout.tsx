// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "半导体 CMS Demo",
  description: "基于 Next.js + Supabase 的简单 CMS Demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}