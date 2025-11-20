// app/api/content/news/route.ts
import { NextResponse } from "next/server";
import { getAllNews, getNewsBySlug } from "@/lib/notion/notion-news";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  try {
    if (slug) {
      // 详情查询
      const data = await getNewsBySlug(slug);
      if (!data) {
        return NextResponse.json(
          { data: null, error: "News not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ data, error: null });
    } else {
      // 列表查询
      const data = await getAllNews();
      return NextResponse.json({ data, error: null });
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { data: null, error: errorMessage },
      { status: 500 }
    );
  }
}