// app/api/quote/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, company, productId, details } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: "name, email 为必填字段" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("quote_forms").insert({
      name,
      email,
      company,
      product_id: productId ?? null,
      details,
    });

    if (error) {
      console.error("Supabase insert error (quote_forms):", error);
      return NextResponse.json(
        { error: "提交失败，请稍后再试。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Quote API error:", err);
    return NextResponse.json(
      { error: "服务器错误，请稍后再试。" },
      { status: 500 }
    );
  }
}