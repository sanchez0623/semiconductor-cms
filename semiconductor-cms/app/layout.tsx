import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Semiconductor CMS",
  description: "企业级半导体CMS系统",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}