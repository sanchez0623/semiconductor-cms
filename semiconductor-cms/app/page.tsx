"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type News = {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
};

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setNews(data || []);
      }
      setLoading(false);
    }

    loadNews();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-3xl py-10 px-4">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            项目初始化 & 数据库连通性测试
          </h1>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            刷新
          </Button>
        </header>

        {loading && <p className="text-slate-600">正在从 Supabase 加载数据...</p>}

        {error && (
          <p className="text-red-600">
            读取 Supabase 失败：{error}
          </p>
        )}

        {!loading && !error && (
          <ul className="space-y-4">
            {news.map((item) => (
              <li
                key={item.id}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-900">
                  {item.title}
                </h2>
                {item.content && (
                  <p className="mt-2 text-slate-700">{item.content}</p>
                )}
                <p className="mt-2 text-xs text-slate-500">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </li>
            ))}

            {news.length === 0 && (
              <li className="text-slate-600">
                当前没有新闻数据，请在 Supabase 中插入示例数据。
              </li>
            )}
          </ul>
        )}
      </div>
    </main>
  );
}