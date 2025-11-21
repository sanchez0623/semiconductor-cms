// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/route-handler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "name, email, message 为必填字段" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { error } = await supabase.from("contact_forms").insert({
      name,
      email,
      subject,
      message,
    });

    if (error) {
      console.error("Supabase insert error (contact_forms):", error);
      return NextResponse.json(
        { error: "提交失败，请稍后再试。" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "服务器错误，请稍后再试。" },
      { status: 500 }
    );
  }
}