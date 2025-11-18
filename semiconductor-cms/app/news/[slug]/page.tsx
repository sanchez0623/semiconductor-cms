// app/(dashboard)/news/[slug]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  published_at: string | null;
  created_at: string | null;
};

async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error fetching news detail:", error);
    return null;
  }

  return data as NewsItem | null;
}

export default async function NewsDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;
  console.log("NewsDetailPage slug =", slug); // 临时调试
  const item = await getNewsBySlug(slug);

  if (!item) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-3">{item.title}</h1>

      {(item.published_at || item.created_at) && (
        <p className="text-sm text-slate-500 mb-6">
          发布于{" "}
          {new Date(
            item.published_at || item.created_at || ""
          ).toLocaleDateString("zh-CN")}
        </p>
      )}

      <article className="prose prose-slate max-w-none">
        {item.content || "暂无详细内容。"}
      </article>
    </main>
  );
}