// app/api/content/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/lib/notion/notion-products";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const q = searchParams.get("q");
    const limitRaw = Number(searchParams.get("limit") ?? "50");
    const limit = Number.isFinite(limitRaw)
      ? Math.min(Math.max(limitRaw, 1), 200)
      : 50;
    const fromRaw = Number(searchParams.get("from") ?? "0");
    const from = Number.isFinite(fromRaw) && fromRaw >= 0 ? fromRaw : 0;

    // 1. Fetch all products from Notion
    let allProducts = await getAllProducts();
    let data = allProducts;

    // 2. Server-side filtering and searching
    if (id) {
      data = data.filter((p) => p.id === id);
    } else {
      if (q && q.trim().length > 0) {
        const term = q.trim().toLowerCase();
        data = data.filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.slug.toLowerCase().includes(term)
        );
      }
    }

    // 3. Server-side pagination
    const paginatedData = data.slice(from, from + limit);

    return NextResponse.json({ data: paginatedData });
  } catch (err) {
    console.error("Products API error:", err);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}