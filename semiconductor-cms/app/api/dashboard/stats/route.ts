import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/route-handler";
import { getNewsCount } from "@/lib/notion/notion-news";
import { getProductsCount } from "@/lib/notion/notion-products";

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch data in parallel
    const [newsCount, productsCount, unreadContactForms, unhandledQuoteForms] =
      await Promise.all([
        getNewsCount(),
        getProductsCount(),
        supabase
          .from("contact_forms")
          .select("*", { count: "exact", head: true })
          .not("handled", "eq", true)
          .then(({ count }) => count),
        supabase
          .from("quote_forms")
          .select("*", { count: "exact", head: true })
          .not("handled", "eq", true)
          .then(({ count }) => count),
      ]);

    return NextResponse.json({
      newsCount,
      productsCount,
      unreadContactForms: unreadContactForms ?? 0,
      unhandledQuoteForms: unhandledQuoteForms ?? 0,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
