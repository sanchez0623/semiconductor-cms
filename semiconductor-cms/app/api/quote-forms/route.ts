// app/api/quote-forms/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/route-handler";

const DEFAULT_PAGE_SIZE = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(
      searchParams.get("pageSize") || String(DEFAULT_PAGE_SIZE),
      10
    );

    if (page < 1 || pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: "Invalid page or pageSize parameters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get total count
    const { count, error: countError } = await supabase
      .from("quote_forms")
      .select("*", { count: "exact", head: true });

    if (countError) {
      console.error("Supabase count error (quote_forms):", countError);
      return NextResponse.json(
        { error: "Failed to fetch data count" },
        { status: 500 }
      );
    }

    // Get paginated data
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
      .from("quote_forms")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Supabase select error (quote_forms):", error);
      return NextResponse.json(
        { error: "Failed to fetch data" },
        { status: 500 }
      );
    }

    const totalPages = Math.ceil((count || 0) / pageSize);

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages,
      },
    });
  } catch (err) {
    console.error("Quote Forms API error:", err);
    return NextResponse.json(
      { error: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
