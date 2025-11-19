// app/api/content/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const q = searchParams.get("q");
    const fields = searchParams.get("fields") ?? "*";
    const limitRaw = Number(searchParams.get("limit") ?? "50");
    const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 200) : 50;
    const fromRaw = Number(searchParams.get("from") ?? "0");
    const from = Number.isFinite(fromRaw) && fromRaw >= 0 ? fromRaw : 0;
    const to = from + limit - 1;

    const supabase = createClient();
    let query = supabase
      .from("products")
      .select(fields)
      .eq("is_active", true);

    if (id) {
      query = query.eq("id", id).limit(1);
    } else {
      if (q && q.trim().length > 0) {
        const term = q.trim();
        query = query.or(`name.ilike.%${term}%,slug.ilike.%${term}%`);
      }
      query = query.order("created_at", { ascending: false }).range(from, to);
    }

    const { data, error } = await query;
    if (error) {
      console.error("Supabase select error (products):", error);
      return NextResponse.json(
        { error: "获取产品失败" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Products API error:", err);
    return NextResponse.json(
      { error: "服务器错误" },
      { status: 500 }
    );
  }
}